import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Anomalie, TypeAnomalie } from '../../model/Anomalie';
import { AnomalieService } from '../../services/anomalie.service';
import { SignalementService } from '../../services/signalement.service';
import { Signalement } from '../../model/Signalement';

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
  nomEtablissementCtrl: FormControl;
  adresseEtablissementCtrl: FormControl;
  descriptionCtrl: FormControl;
  photoCtrl: FormControl;
  prenomCtrl: FormControl;
  nomCtrl: FormControl;
  emailCtrl: FormControl;
  @ViewChild('file') file;

  anomalies: Anomalie[];
  typeAnomalieList: TypeAnomalie[];
  precisionAnomalieList: string[];

  showErrors: boolean;
  showSuccess: boolean;

  constructor(public formBuilder: FormBuilder,
              private anomalieService: AnomalieService,
              private signalementService: SignalementService) {
  }

  ngOnInit() {
    this.typeEtablissementCtrl = this.formBuilder.control('', Validators.required);
    this.categoryAnomalieCtrl = this.formBuilder.control('', Validators.required);
    this.precisionAnomalieCtrl = this.formBuilder.control('', Validators.required);
    this.nomEtablissementCtrl = this.formBuilder.control('', Validators.required);
    this.adresseEtablissementCtrl = this.formBuilder.control('', Validators.required);
    this.descriptionCtrl = this.formBuilder.control('');
    this.prenomCtrl = this.formBuilder.control('', Validators.required);
    this.nomCtrl = this.formBuilder.control('', Validators.required);
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);

    this.signalementForm = this.formBuilder.group({
      typeEtablissement: this.typeEtablissementCtrl,
      nomEtablissement: this.nomEtablissementCtrl,
      adresseEtablissement: this.adresseEtablissementCtrl,
      description: this.descriptionCtrl,
      prenom: this.prenomCtrl,
      nom: this.nomCtrl,
      email: this.emailCtrl,
    });

    this.showErrors = false;

    this.loadAnomalies();
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
      this.signalementForm.addControl('precisionAnomalie', this.precisionAnomalieCtrl);
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
      this.showErrors = true;
    } else {
      this.signalementService.createSignalement(Object.assign(new Signalement(), {'photo': this.getPhoto()}, this.signalementForm.value))
        .subscribe(result => {
          return this.treatCreationSuccess();
        });
        // TODO cas d'erreur
    }
  }

  private treatCreationSuccess() {
    this.showSuccess = true;
  }

  private getPhoto() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key))) {
        return files[key];
      }
    }
  }
}
