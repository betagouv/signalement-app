import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Anomaly, AnomalyInfo, AnomalyType } from '../../model/Anomaly';
import { AnomalyService } from '../../services/anomaly.service';
import { SignalementService } from '../../services/signalement.service';
import { Signalement } from '../../model/Signalement';
import { BsLocaleService } from 'ngx-bootstrap';
import { Company } from '../../model/Company';

@Component({
  selector: 'app-signalement-form',
  templateUrl: './signalement-form.component.html',
  styleUrls: ['./signalement-form.component.scss']
})
export class SignalementFormComponent implements OnInit {

  signalementForm: FormGroup;
  typeEtablissementCtrl: FormControl;
  anomalyCategoryCtrl: FormControl;
  anomalyPrecisionCtrl: FormControl;
  dateConstatCtrl: FormControl;
  heureConstatCtrl: FormControl;
  descriptionCtrl: FormControl;
  prenomCtrl: FormControl;
  nomCtrl: FormControl;
  emailCtrl: FormControl;
  accordContactCtrl: FormControl;
  companyCtrl: FormControl;

  ticketFile: File;
  anomalyFile: File;

  anomalies: Anomaly[];
  anomalyInfos: AnomalyInfo[];
  anomalyTypeList: AnomalyType[];
  anomalyPrecisionList: string[];
  plageHoraireList: number[];

  showErrors: boolean;
  showSuccess: boolean;
  loading: boolean;
  anomalyInfo: AnomalyInfo;


  constructor(public formBuilder: FormBuilder,
              private anomalyService: AnomalyService,
              private signalementService: SignalementService,
              private localeService: BsLocaleService) {
  }

  ngOnInit() {
    this.showErrors = false;
    this.localeService.use('fr');

    this.initSignalementForm();
    this.constructPlageHoraireList();
    this.loadAnomalies();
    this.loadAnomalyInfos();
  }

  private initSignalementForm() {
    this.typeEtablissementCtrl = this.formBuilder.control('', Validators.required);
    this.anomalyCategoryCtrl = this.formBuilder.control('', Validators.required);
    this.anomalyPrecisionCtrl = this.formBuilder.control('', Validators.required);
    this.dateConstatCtrl = this.formBuilder.control('', Validators.required);
    this.heureConstatCtrl = this.formBuilder.control('');
    this.descriptionCtrl = this.formBuilder.control('');
    this.prenomCtrl = this.formBuilder.control('', Validators.required);
    this.nomCtrl = this.formBuilder.control('', Validators.required);
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.accordContactCtrl = this.formBuilder.control(false);
    this.companyCtrl = this.formBuilder.control('', Validators.required);

    this.signalementForm = this.formBuilder.group({
      typeEtablissement: this.typeEtablissementCtrl,
      dateConstat: this.dateConstatCtrl,
      heureConstat: this.heureConstatCtrl,
      description: this.descriptionCtrl,
      prenom: this.prenomCtrl,
      nom: this.nomCtrl,
      email: this.emailCtrl,
      accordContact: this.accordContactCtrl,
      company: this.companyCtrl
    });
  }

  constructPlageHoraireList() {
    this.plageHoraireList = [];
    for (let i = 0; i < 24; i++) {
      this.plageHoraireList.push(i);
    }
  }

  loadAnomalies() {
    this.anomalyService.getAnomalies().subscribe(anomalyList => {
      this.anomalies = anomalyList;
    });
  }

  loadAnomalyInfos() {
    this.anomalyService.getAnomalyInfos().subscribe(anomalyInfoList => {
      this.anomalyInfos = anomalyInfoList;
    });
  }

  changeTypeEtablissement() {
    this.resetAnomalyCategory();
    if (this.typeEtablissementCtrl.value !== '') {
      this.anomalyTypeList = this.getAnomalyTypeList();
      this.signalementForm.addControl('anomalyCategory', this.anomalyCategoryCtrl);
    }
  }

  private resetAnomalyCategory() {
    this.anomalyTypeList = [];
    this.signalementForm.removeControl('anomalyCategory');
    this.anomalyCategoryCtrl.setValue('');
    this.resetAnomalyPrecision();
  }

  private getAnomalyTypeList() {
    return this.anomalies
        .find(anomaly => anomaly.companyType === this.typeEtablissementCtrl.value)
        .anomalyTypeList;
  }

  changeAnomalyCategory() {
    this.resetAnomalyPrecision();
    if (this.anomalyCategoryCtrl.value !== '') {
      this.anomalyPrecisionList = this.getAnomalyPrecisionList();
      if (this.anomalyPrecisionList.length) {
        this.signalementForm.addControl('anomalyPrecision', this.anomalyPrecisionCtrl);
      }
    }
  }

  private resetAnomalyPrecision() {
    this.anomalyPrecisionList = [];
    this.signalementForm.removeControl('anomalyPrecision');
    this.anomalyPrecisionCtrl.setValue('');
    this.anomalyInfo = null;
  }

  private getAnomalyPrecisionList() {
    return this.getAnomalyTypeList()
      .find(anomalyType => anomalyType.category === this.anomalyCategoryCtrl.value)
      .precisionList;
  }

  changeAnomalyPrecision() {
    console.log('this.anomalyInfos', this.anomalyInfos)
    console.log('this.anomalyPrecisionCtrl.value', this.anomalyPrecisionCtrl.value)
    this.anomalyInfo = this.anomalyInfos.find(anomalyInfo => anomalyInfo.key === this.anomalyPrecisionCtrl.value);
  }

  createSignalement() {
    if (!this.signalementForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.signalementService.createSignalement(
        Object.assign(
          new Signalement(),
          {
            typeEtablissement: this.typeEtablissementCtrl.value,
            categorieAnomalie: this.anomalyCategoryCtrl.value,
            precisionAnomalie: this.anomalyPrecisionCtrl.value,
            dateConstat: this.dateConstatCtrl.value,
            heureConstat: this.heureConstatCtrl.value,
            description: this.descriptionCtrl.value,
            prenom: this.prenomCtrl.value,
            nom: this.nomCtrl.value,
            email: this.emailCtrl.value,
            accordContact: this.accordContactCtrl.value,
            ticketFile: this.ticketFile,
            anomalieFile: this.anomalyFile,
            nomEtablissement: this.companyCtrl.value.name,
            adresseEtablissement: this.getCompanyAddress(),
            siretEtablissement: this.companyCtrl.value.siret ? this.companyCtrl.value.siret : ''
          }
        )
      ).subscribe(
        result => {
          this.loading = false;
          return this.treatCreationSuccess();
        },
        error => {
          this.loading = false;
          // TODO cas d'erreur
        });

    }
  }

  private treatCreationSuccess() {
    this.showSuccess = true;
  }

  onTicketFileSelected(file: File) {
    this.ticketFile = file;
  }

  onAnomalyFileSelected(file: File) {
    this.anomalyFile = file;
  }

  isIntoxicationAlimentaire() {
    return this.anomalyCategoryCtrl.value === IntoxicationAlimentaire;
  }

  onCompanySelected(company: Company) {
    this.companyCtrl.setValue(company);
  }

  changeCompany() {
    this.companyCtrl.reset();
  }

  getCompanyAddress() {
    let address = '';
    const addressAttibutes = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7'];
    if (this.companyCtrl.value) {
      for (const attribute of addressAttibutes) {
        if (this.companyCtrl.value[attribute]) {
          address = address.concat(`${this.companyCtrl.value[attribute]} - `);
        }
      }
    }
    return address.substring(0, address.length - 3);
  }

  newReport() {
    this.ngOnInit();
  }
}

export const IntoxicationAlimentaire = 'Intoxication alimentaire';
