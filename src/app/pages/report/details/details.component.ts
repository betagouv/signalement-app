import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailInputValue, PrecisionKeyword, Report, Step } from '../../../model/Report';
import { BsLocaleService } from 'ngx-bootstrap';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { KeywordService } from '../../../services/keyword.service';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { DescriptionLabel, DetailInput, InputType, ReportingDateLabel, ReportingTimeslotLabel } from '../../../model/Anomaly';
import { UploadedFile } from '../../../model/UploadedFile';
import { FileUploaderService } from '../../../services/file-uploader.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isDefined } from '@angular/compiler/src/util';
import Utils from '../../../utils';
import { ReportStorageService } from '../../../services/report-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const fileSizeMax = 5000000;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        display: 'block',
        opacity: 1,
      })),
      state('closed', style({
        display: 'none',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.2s ease-out')
      ]),
      transition('closed => open', [
        animate('0.5s ease-in-out')
      ]),
    ]),
  ],
})
export class DetailsComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  step: Step;
  report: Report;

  detailInputs: DetailInput[];
  detailsForm: FormGroup;
  descriptionCtrl: FormControl;

  @ViewChild('fileInput') fileInput;

  plageHoraireList: number[];
  uploadedFiles: UploadedFile[];

  showErrors: boolean;
  tooLargeFilename: string;
  keywordsDetected: Keyword;

  maxDate: Date;

  constructor(public formBuilder: FormBuilder,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private analyticsService: AnalyticsService,
              private fileUploaderService: FileUploaderService,
              private localeService: BsLocaleService,
              private keywordService: KeywordService,
              private anomalyService: AnomalyService) {
  }

  ngOnInit() {
    this.step = Step.Details;
    this.reportStorageService.retrieveReportInProgressFromStorage()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(report => {
        if (report) {
          this.report = report;
          this.initDetailInputs();
          this.initDetailsForm();
          this.initUploadedFiles();
          this.constructPlageHoraireList();
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
    this.localeService.use('fr');

    this.searchKeywords();

    this.maxDate = new Date();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initDetailInputs() {
    if (this.getReportLastSubcategory() && this.getReportLastSubcategory().detailInputs) {
      this.detailInputs = this.getReportLastSubcategory().detailInputs;
    } else {
      this.detailInputs = this.getDefaultDetailInputs();
    }
  }

  getDefaultDetailInputs() {
    const detailInputs = [];
    detailInputs.push(Object.assign(new DetailInput(), {
      label: DescriptionLabel,
      rank: 1,
      type: InputType.Textarea
    }));
    detailInputs.push(Object.assign(new DetailInput(), {
      label: ReportingDateLabel,
      rank: 2,
      type: InputType.Date,
      defaultValue: 'SYSDATE'
    }));
    detailInputs.push(Object.assign(new DetailInput(), {
      label: ReportingTimeslotLabel,
      rank: 3,
      type: InputType.Timeslot,
      optionnal: true
    }));
    return detailInputs;
  }

  initDetailsForm() {

    this.showErrors = false;

    this.detailsForm = this.formBuilder.group({});
    this.detailInputs
      .sort((d1, d2) => d1.rank < d2.rank ? -1 : 1)
      .forEach(detailInput => {
        if (detailInput.type === InputType.Checkbox) {
          this.detailsForm.addControl(
            this.getFormControlName(detailInput),
            this.formBuilder.array(detailInput.options.map((option, optionIndex) => {
             return this.formBuilder.control(
               this.getCheckboxFormControlInitialValue(detailInput, optionIndex)
             );
            }), ValidateCheckboxControl)
          );
          this.initCheckboxInputsPrecision(detailInput);
        } else if (detailInput.type === InputType.Radio) {
          this.detailsForm.addControl(
            this.getFormControlName(detailInput),
            this.formBuilder.control(this.getRadioFormControlInitialValue(detailInput), this.getDetailInputValidators(detailInput))
          );
          this.initRadioInputPrecision(detailInput, this.getRadioFormControlInitialValue(detailInput));
        } else if (detailInput.type === InputType.Date) {
          this.detailsForm.addControl(
            this.getFormControlName(detailInput),
            this.formBuilder.control(this.getDateFormControlInitialValue(detailInput), this.getDetailInputValidators(detailInput))
          );
        } else {
          this.detailsForm.addControl(
            this.getFormControlName(detailInput),
            this.formBuilder.control(this.getTextFormControlInitialValue(detailInput), this.getDetailInputValidators(detailInput))
          );
        }
        if (detailInput.type === InputType.Textarea) {
          this.searchKeywords(this.getFormControl(detailInput));
        }
      });
  }

  getDetailInputValidators(detailInput: DetailInput) {
    return !detailInput.optionnal ? Validators.required : [];
  }

  hasRequiredError(detailInput: DetailInput, option?: string) {
    return this.showErrors && this.getFormControl(detailInput, option) && this.getFormControl(detailInput, option).hasError('required');
  }

  getDateFormControlInitialValue(detailInput: DetailInput) {
    let value: Date;
    if (this.getReportDetailInputValue(detailInput)) {
      value = this.getReportDetailInputValue(detailInput).value as Date;
    } else if (detailInput.defaultValue === 'SYSDATE') {
      value = new Date();
    }
    return value;
  }

  getTextFormControlInitialValue(detailInput: DetailInput) {
    let value: string | Date;
    if (this.getReportDetailInputValue(detailInput)) {
      value = this.getReportDetailInputValue(detailInput).value as string;
    }
    return value;
  }

  getRadioFormControlInitialValue(detailInput: DetailInput) {
    let value = '';
    if (this.getReportDetailInputValue(detailInput)) {
      value = this.getReportDetailInputValue(detailInput).value as string;
      if (value && value.indexOf(PrecisionKeyword) !== -1) {
        value = value.slice(0, value.indexOf(PrecisionKeyword) + PrecisionKeyword.length);
      }
    }
    return value;
  }

  getCheckboxFormControlInitialValue(detailInput: DetailInput, optionIndex: number) {
    let value = false;
    if (this.getReportDetailInputValue(detailInput)) {
      value = isDefined((this.getReportDetailInputValue(detailInput).value as Array<string>)[optionIndex]);
    }
    return value;
  }

  getFormControl(detailInput: DetailInput, option?: string) {
    return this.detailsForm.controls[this.getFormControlName(detailInput, option)];
  }

  getFormArray(detailInput: DetailInput) {
    return this.getFormControl(detailInput) as FormArray;
  }

  getFormControlName(detailInput: DetailInput, option?: string) {
    let formControlName = `formControl_${detailInput.rank}`;
    if (detailInput.options && option) {
      formControlName = formControlName.concat(`_${detailInput.options.findIndex(o => o === option)}`);
    }
    return formControlName;
  }

  getFormControlId(detailInput: DetailInput, option?: string, precision = false) {
    if (precision) {
      return `${this.getFormControlName(detailInput, option)}_precision`;
    } else {
      return this.getFormControlName(detailInput, option);
    }
  }

  getFormControlValue(detailInput: DetailInput) {
    const detailInputValue = this.getFormControl(detailInput).value;
    if (detailInput.type === InputType.Checkbox) {
      return this.getFormArray(detailInput).controls
        .map((control, index) => {
          if (control.value) {
            if (this.isCheckboxInputPrecisionRequired(detailInput, index)) {
              return detailInput.options[index] + this.getFormControl(detailInput, detailInput.options[index]).value;
            } else {
              return detailInput.options[index];
            }
          }
        })
        .filter(value => value !== null);
    } else if (detailInput.type === InputType.Radio && this.isRadioInputPrecisionRequired(detailInput, detailInputValue)) {
      return detailInputValue + this.detailsForm.controls[this.getFormControlName(detailInput, detailInputValue)].value;
    } else {
      return detailInputValue;
    }
  }

  constructPlageHoraireList() {
    this.plageHoraireList = [];
    for (let i = 0; i < 24; i++) {
      this.plageHoraireList.push(i);
    }
  }

  submitDetailsForm() {

    if (!this.detailsForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateDetails);
      this.report.detailInputValues = this.detailInputs
        .filter(d => isDefined(this.getFormControlValue(d)))
        .sort((d1, d2) => d1.rank < d2.rank ? -1 : 1)
        .map(detailInput => {
          return Object.assign(new DetailInputValue(), {
            label: detailInput.label,
            value: this.getFormControlValue(detailInput)
          });
        });
      this.report.uploadedFiles = this.uploadedFiles.filter(file => file.id);
      this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
      this.reportRouterService.routeForward(this.step);
    }
  }

  bringFileSelector() {
    this.fileInput.nativeElement.click();
  }

  selectFile() {
    this.tooLargeFilename = undefined;
    if (this.fileInput.nativeElement.files[0]) {
      if (this.fileInput.nativeElement.files[0].size > fileSizeMax) {
        this.tooLargeFilename = this.fileInput.nativeElement.files[0].name;
      } else {
        const fileToUpload = new UploadedFile();
        fileToUpload.filename = this.fileInput.nativeElement.files[0].name;
        fileToUpload.loading = true;
        this.uploadedFiles.push(fileToUpload);
        this.fileUploaderService.uploadFile(this.fileInput.nativeElement.files[0]).subscribe(uploadedFile => {
          fileToUpload.loading = false;
          fileToUpload.id = uploadedFile.id;
          fileToUpload.creationDate = uploadedFile.creationDate;
        }, error => {
          fileToUpload.loading = false;
        });
      }
    }
  }

  getErrorFilename(filename: string) {
    return `Echec du téléchargement (${Utils.textOverflowMiddleCropping(filename, 10)})`.concat();
  }

  isUploadingFile() {
    return this.uploadedFiles.find(file => file.loading);
  }

  initUploadedFiles() {
    if (this.report.uploadedFiles) {
      this.uploadedFiles = this.report.uploadedFiles;
    } else {
      this.uploadedFiles = [];
    }
  }

  removeUploadedFile(uploadedFile: UploadedFile) {
    this.uploadedFiles.splice(
      this.uploadedFiles.findIndex(f => f.id === uploadedFile.id),
      1
    );
    if (uploadedFile.id) {
      this.fileUploaderService.deleteFile(uploadedFile).subscribe();
    }
  }

  onFileUploaded(uploadedFile: UploadedFile) {
    this.uploadedFiles.push(uploadedFile);
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  searchKeywords(formControl: AbstractControl = this.descriptionCtrl) {
    if (formControl) {
      const res = this.keywordService.search(formControl.value);
      if (!res) {
        this.keywordsDetected = null;
      } else {
        const anomaly = this.anomalyService.getAnomalyByCategoryId(res.categoryId);
        if (anomaly) {
          this.analyticsService.trackEvent(
            EventCategories.report,
            ReportEventActions.keywordsDetection,
            JSON.stringify(res.found.map(elt => elt.expression))
          );
          this.keywordsDetected = {
            category: anomaly.category,
            message: anomaly.information ? anomaly.information.title : ''
          };
        } else {
          this.keywordsDetected = null;
        }
      }
    }
  }

  goToInformationPage() {
    // modification des éléments du report et du step pour que le router affiche la page d'info avec le contexte
    this.step = Step.Category;
    this.report.category = this.keywordsDetected.category;
    this.report.subcategories = null;

    this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  getReportLastSubcategory() {
    if (this.report && this.report.subcategories && this.report.subcategories.length) {
      return this.report.subcategories[this.report.subcategories.length - 1];
    }
  }

  isRadioInputPrecisionRequired(detailInput: DetailInput, option: string) {
    return option && this.getFormControl(detailInput).value === option && option.indexOf(PrecisionKeyword) !== -1;
  }

  initRadioInputPrecision(detailInput: DetailInput, checkedOption: string) {
    if (this.isRadioInputPrecisionRequired(detailInput, checkedOption)) {
      let precisionValue = '';
      if (this.getReportDetailInputValue(detailInput)) {
        const value = this.getReportDetailInputValue(detailInput).value as string;
        if (value && value.indexOf(PrecisionKeyword) !== -1) {
          precisionValue = value.slice(value.indexOf(PrecisionKeyword) + PrecisionKeyword.length);
        }
      }
      this.detailsForm.addControl(
        this.getFormControlName(detailInput, checkedOption),
        this.formBuilder.control(precisionValue, Validators.required)
      );
    }
    detailInput.options.forEach(o => {
        if (o !== checkedOption) {
          this.detailsForm.removeControl(this.getFormControlName(detailInput, o));
        }
    });
  }

  isCheckboxInputPrecisionRequired(detailInput: DetailInput, optionIndex: number) {
    return this.getFormArray(detailInput).controls[optionIndex].value && detailInput.options[optionIndex].indexOf(PrecisionKeyword) !== -1;
  }

  initCheckboxInputsPrecision(detailInput: DetailInput) {
    detailInput.options.forEach((option, optionIndex) => {
      this.initCheckboxInputPrecision(detailInput, optionIndex);
    });
  }

  initCheckboxInputPrecision(detailInput: DetailInput, optionIndex: number) {
    if (this.isCheckboxInputPrecisionRequired(detailInput, optionIndex)) {
      let precisionValue = '';
      if (this.getReportDetailInputValue(detailInput)) {
        const value = (this.getReportDetailInputValue(detailInput).value as Array<string>)[optionIndex];
        if (value && value.indexOf(PrecisionKeyword) !== -1) {
          precisionValue = value.slice(value.indexOf(PrecisionKeyword) + PrecisionKeyword.length);
        }
      }
      this.detailsForm.addControl(
        this.getFormControlName(detailInput, detailInput.options[optionIndex]),
        this.formBuilder.control(precisionValue, Validators.required)
      );
    } else {
      this.detailsForm.removeControl(this.getFormControlName(detailInput, detailInput.options[optionIndex]));
    }
  }

  getReportDetailInputValue(detailInput: DetailInput) {
    if (this.report.detailInputValues) {
      return this.report.detailInputValues.find(inputValue => inputValue.label === detailInput.label);
    }
  }

}

interface Keyword {
  readonly category: string;
  readonly message: string;
}

export function ValidateCheckboxControl(formArray: FormArray) {
  let isOneOptionChecked = false;
  if (formArray.controls) {
    isOneOptionChecked = formArray.controls.reduce((value, control) => (value || control.value), false);
  }
  if (!isOneOptionChecked) {
    return {required: true};
  }
}
