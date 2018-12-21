import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Anomalie, TypeAnomalie } from '../../model/Anomalie';
import { AnomalieService } from '../../services/anomalie.service';
import { SignalementService } from '../../services/signalement.service';
import { Signalement } from '../../model/Signalement';
import { BsLocaleService } from 'ngx-bootstrap';
import { Company } from '../../model/Company';
import { AnalyticsService, EventCategories, ReportingEventActions } from '../../services/analytics.service';

@Component({
  selector: 'app-signalement-form',
  templateUrl: './signalement-form.component.html',
  styleUrls: ['./signalement-form.component.scss']
})
export class SignalementFormComponent implements OnInit {

  signalementForm: FormGroup;
  typeEtablissementCtrl: FormControl;
  categoryAnomalieCtrl: FormControl;
  precisionAnomalieCtrl: FormControl;
  dateConstatCtrl: FormControl;
  heureConstatCtrl: FormControl;
  descriptionCtrl: FormControl;
  prenomCtrl: FormControl;
  nomCtrl: FormControl;
  emailCtrl: FormControl;
  accordContactCtrl: FormControl;
  companyCtrl: FormControl;

  ticketFile: File;
  anomalieFile: File;

  anomalies: Anomalie[];
  typeAnomalieList: TypeAnomalie[];
  precisionAnomalieList: string[];
  plageHoraireList: number[];

  showErrors: boolean;
  showSuccess: boolean;
  loading: boolean;


  constructor(public formBuilder: FormBuilder,
              private anomalieService: AnomalieService,
              private signalementService: SignalementService,
              private localeService: BsLocaleService,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.showErrors = false;
    this.localeService.use('fr');

    this.initSignalementForm();
    this.constructPlageHoraireList();
    this.loadAnomalies();
  }

  private initSignalementForm() {
    this.typeEtablissementCtrl = this.formBuilder.control('', Validators.required);
    this.categoryAnomalieCtrl = this.formBuilder.control('', Validators.required);
    this.precisionAnomalieCtrl = this.formBuilder.control('', Validators.required);
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
    this.anomalieService.getAnomalies().subscribe(anomalieList => {
      this.anomalies = anomalieList;
    });
  }

  changeTypeEtablissement() {
    this.resetCategorieAnomalie();
    if (this.typeEtablissementCtrl.value !== '') {
      this.typeAnomalieList = this.getTypeAnomalieList();
      this.signalementForm.addControl('categorieAnomalie', this.categoryAnomalieCtrl);
    }
  }

  private resetCategorieAnomalie() {
    this.typeAnomalieList = [];
    this.signalementForm.removeControl('categorieAnomalie');
    this.categoryAnomalieCtrl.setValue('');
    this.resetPrecisionAnomalie();
  }

  private getTypeAnomalieList() {
    return this.anomalies
        .find(anomalie => anomalie.typeEtablissement === this.typeEtablissementCtrl.value)
        .typeAnomalieList;
  }

  changeCategorieAnomalie() {
    this.resetPrecisionAnomalie();
    if (this.categoryAnomalieCtrl.value !== '') {
      this.precisionAnomalieList = this.getPrecisionAnomalieList();
      if (this.precisionAnomalieList.length) {
        this.signalementForm.addControl('precisionAnomalie', this.precisionAnomalieCtrl);
      }
    }
  }

  private resetPrecisionAnomalie() {
    this.precisionAnomalieList = [];
    this.signalementForm.removeControl('precisionAnomalie');
    this.precisionAnomalieCtrl.setValue('');
  }

  private getPrecisionAnomalieList() {
    return this.getTypeAnomalieList()
      .find(typeAnomalie => typeAnomalie.categorie === this.categoryAnomalieCtrl.value)
      .precisionList;
  }

  createSignalement() {
    if (!this.signalementForm.valid) {
      this.analyticsService.trackEvent(EventCategories.reporting, ReportingEventActions.invalidForm);
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.reporting, ReportingEventActions.formSubmitted);
      this.loading = true;
      this.signalementService.createSignalement(
        Object.assign(
          new Signalement(),
          {
            typeEtablissement: this.typeEtablissementCtrl.value,
            categorieAnomalie: this.categoryAnomalieCtrl.value,
            precisionAnomalie: this.precisionAnomalieCtrl.value,
            dateConstat: this.dateConstatCtrl.value,
            heureConstat: this.heureConstatCtrl.value,
            description: this.descriptionCtrl.value,
            prenom: this.prenomCtrl.value,
            nom: this.nomCtrl.value,
            email: this.emailCtrl.value,
            accordContact: this.accordContactCtrl.value,
            ticketFile: this.ticketFile,
            anomalieFile: this.anomalieFile,
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

  onAnomalieFileSelected(file: File) {
    this.anomalieFile = file;
  }

  isIntoxicationAlimentaire() {
    return this.categoryAnomalieCtrl.value === IntoxicationAlimentaire;
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
