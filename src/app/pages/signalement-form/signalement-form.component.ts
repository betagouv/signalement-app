import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Anomalie, TypeAnomalie } from '../../model/Anomalie';
import { AnomalieService } from '../../services/anomalie.service';

@Component({
  selector: 'app-signalement-form',
  templateUrl: './signalement-form.component.html',
  styleUrls: ['./signalement-form.component.scss']
})
export class SignalementFormComponent implements OnInit {

  typeEtablissementCtrl: FormControl;
  typeAnomalieCtrl: FormControl;
  precisionAnomalieCtrl: FormControl;
  nomEtablissementCtrl: FormControl;
  adresseEtablissementCtrl: FormControl;
  descriptionCtrl: FormControl;
  photoCtrl: FormControl;
  prenomCtrl: FormControl;
  nomCtrl: FormControl;
  emailCtrl: FormControl;

  signalementForm: FormGroup;
  anomalies: Anomalie[];
  typeAnomalieList: TypeAnomalie[];
  precisionAnomalieList: string[];

  constructor(public formBuilder: FormBuilder,
              private anomalieService: AnomalieService) {
  }

  ngOnInit() {
    this.typeEtablissementCtrl = this.formBuilder.control('');
    this.typeAnomalieCtrl = this.formBuilder.control('');
    this.precisionAnomalieCtrl = this.formBuilder.control('');
    this.nomEtablissementCtrl = this.formBuilder.control('');
    this.adresseEtablissementCtrl = this.formBuilder.control('');
    this.descriptionCtrl = this.formBuilder.control('');
    this.photoCtrl = this.formBuilder.control('');
    this.prenomCtrl = this.formBuilder.control('');
    this.nomCtrl = this.formBuilder.control('');
    this.emailCtrl = this.formBuilder.control('');

    this.signalementForm = this.formBuilder.group({
      typeEtablissement: this.typeEtablissementCtrl,
      nomEtablissement: this.nomEtablissementCtrl,
      adresseEtablissement: this.adresseEtablissementCtrl,
      description: this.descriptionCtrl,
      photo: this.photoCtrl,
      prenom: this.prenomCtrl,
      nom: this.nomCtrl,
      email: this.emailCtrl,
    });

    this.loadAnomalies();
  }

  loadAnomalies() {
    this.anomalieService.getAnomalies().subscribe(anomalieList => {
      this.anomalies = anomalieList.list;
    });
  }

  changeTypeEtablissement() {
    this.resetTypeAnomalie();
    if (this.typeEtablissementCtrl.value !== '') {
      this.typeAnomalieList = this.getTypeAnomalieList();
      this.signalementForm.addControl('typeAnomalie', this.typeAnomalieCtrl);
    }
  }

  private resetTypeAnomalie() {
    this.typeAnomalieList = [];
    this.signalementForm.removeControl('typeAnomalie');
    this.typeAnomalieCtrl.setValue('');
    this.resetPrecisionAnomalie();
  }

  private getTypeAnomalieList() {
    return this.anomalies
        .find(anomalie => anomalie.typeEtablissement === this.typeEtablissementCtrl.value)
        .typeAnomalieList;
  }

  changeTypeAnomalie() {
    this.resetPrecisionAnomalie();
    if (this.typeAnomalieCtrl.value !== '') {
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
      .find(typeAnomalie => typeAnomalie.categorie === this.typeAnomalieCtrl.value)
      .precisionList;
  }
}
