import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailInputValue, DraftReport, PrecisionKeyword, Step } from '../../../model/Report';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { KeywordService } from '../../../services/keyword.service';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { AnomalyClient, DetailInput, InputType, ReportTag, } from '@signal-conso/signalconso-api-sdk-js';
import { FileOrigin, UploadedFile } from '../../../model/UploadedFile';
import { FileUploaderService } from '../../../services/file-uploader.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isDefined } from '@angular/compiler/src/util';
import { ReportStorageService } from '../../../services/report-storage.service';
import { take } from 'rxjs/operators';
import { Keyword } from '../../../model/Keyword';

export const fileSizeMax = 5000000;

export const ReportingDateLabel = 'Date du constat';
export const ReportingTimeslotLabel = 'Heure du constat';
export const DescriptionLabel = 'Description';

const ResponseConsoQuestionLabel = 'Votre question'

const reponseConsoQuestion = (rank: number) => ({
  label: ResponseConsoQuestionLabel,
  rank,
  type: InputType.Textarea,
});

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
export class DetailsComponent implements OnInit {

  step: Step;
  draftReport: DraftReport;

  detailInputs: DetailInput[];
  detailsForm: FormGroup;
  descriptionCtrl: FormControl;

  plageHoraireList: number[];
  uploadedFiles: UploadedFile[];

  showErrors: boolean;
  keywordDetected: Keyword;

  maxDate: Date;
  fileOrigins = FileOrigin;

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
    this.reportStorageService.retrieveReportInProgress()
      .pipe(take(1))
      .subscribe(report => {
        if (report) {
          this.draftReport = report;
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

  initDetailInputs() {
    if (AnomalyClient.instanceOfSubcategoryInput(this.draftReport.lastSubcategory)) {
      this.detailInputs = this.draftReport.lastSubcategory.detailInputs;
      if (!this.detailInputs.some(input => input.type === InputType.Textarea)) {
        this.detailInputs.push({
          label: DescriptionLabel,
          rank: this.detailInputs.length + 1,
          type: InputType.Textarea,
          optionnal: true
        });
      }
    } else {
      this.detailInputs = this.getDefaultDetailInputs();
    }
    if (this.draftReport.tags.includes(ReportTag.ReponseConso)) {
      const i = this.detailInputs.findIndex(_ => _.type === InputType.Textarea && _.label !== ResponseConsoQuestionLabel);
      if (i) {
        this.detailInputs[i].label = `${DescriptionLabel} (${this.detailInputs[i].label})`;
      }
      this.detailInputs.push(reponseConsoQuestion(this.detailInputs.length));
    }
  }

  readonly isDangerousProductReport = () => this.draftReport.tags.indexOf(ReportTag.ProduitDangereux) > -1;

  getDefaultDetailInputs() {
    const detailInputs: DetailInput[] = [];
    detailInputs.push({
      label: DescriptionLabel,
      rank: 1,
      type: InputType.Textarea
    });
    detailInputs.push({
      label: ReportingDateLabel,
      rank: 3,
      type: InputType.Date,
      defaultValue: 'SYSDATE'
    });
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
      this.draftReport.detailInputValues = this.detailInputs
        .filter(d => isDefined(this.getFormControlValue(d)))
        .sort((d1, d2) => d1.rank < d2.rank ? -1 : 1)
        .map(detailInput => {
          return Object.assign(new DetailInputValue(), {
            label: detailInput.label,
            value: this.getFormControlValue(detailInput)
          });
        });
      this.draftReport.uploadedFiles = this.uploadedFiles.filter(file => file.id);
      this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
      this.reportRouterService.routeForward(this.step);
    }
  }

  isUploadingFile() {
    return this.uploadedFiles.find(file => file.loading);
  }

  initUploadedFiles() {
    if (this.draftReport.uploadedFiles) {
      this.uploadedFiles = this.draftReport.uploadedFiles;
    } else {
      this.uploadedFiles = [];
    }
  }

  searchKeywords(formControl: AbstractControl = this.descriptionCtrl) {
    if (formControl && this.draftReport.category) {
      const res = this.keywordService.search(
        formControl.value,
        this.anomalyService.getAnomalyByCategory(this.draftReport.category).categoryId
      );
      if (!res) {
        this.keywordDetected = null;
      } else {
        const anomaly = this.anomalyService.getAnomalyByCategoryId(res.keyword.redirectCategory);
        if (anomaly) {
          this.analyticsService.trackEvent(
            EventCategories.report,
            ReportEventActions.keywordsDetection,
            JSON.stringify(res.found.map(elt => elt.expression))
          );
          this.keywordDetected = res.keyword;
        } else {
          this.keywordDetected = null;
        }
      }
    }
  }

  goToInformationPage() {
    this.analyticsService.trackEvent(
      EventCategories.report,
      ReportEventActions.informationFromKeywordsDetection,
      this.keywordDetected.redirectCategory
    );

    this.step = Step.Category;
    this.draftReport.category = this.anomalyService.getAnomalyByCategoryId(this.keywordDetected.redirectCategory).category;
    this.draftReport.subcategories = null;

    this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
    this.reportRouterService.routeForward(this.step);
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
    if (this.draftReport.detailInputValues) {
      return this.draftReport.detailInputValues.find(inputValue => inputValue.label === detailInput.label);
    }
  }
}

export function ValidateCheckboxControl(formArray: FormArray) {
  let isOneOptionChecked = false;
  if (formArray.controls) {
    isOneOptionChecked = formArray.controls.reduce((value, control) => (value || control.value), false);
  }
  if (!isOneOptionChecked) {
    return { required: true };
  }
}
