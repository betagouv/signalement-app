import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private angulartics2: Angulartics2) {
  }

  trackEvent(category, action, name?, value?) {
    this.angulartics2.eventTrack.next({
      action,
      properties: { category, name, value }
    });
  }
}

export enum EventCategories {
  reporting = 'Formulaire de signalement',
  company = 'Identification de l\'établissement'
}

export enum ReportingEventActions {
  information = 'Affichage d\'un message d\'information',
  invalidForm = 'Formulaire non valide',
  formSubmitted = 'Envoi d\'un signalement',
  selectCompanyType = 'Sélection d\'un type d\'établissement',
  selectAnomalyCategory = 'Sélection d\'un type d\'anomalie',
  selectAnomalyPrecision = 'Sélection d\'une précision d\'anomalie'
}

export enum CompanyEventActions {
  search = 'Recherche',
  select = 'Sélection dans la liste de résultats',
  searchEdit = 'Modification de la recherche',
  manualEntry = 'Saisie manuelle',
  change = 'Changement d\'établissement'
}

export enum CompanySearchEventNames {
  noResult = 'Aucun résultat',
  tooManyResults = 'Trop de résultat',
  severalResult = 'Plusieurs résultats',
  singleResult = 'Un seul résultat'
}




