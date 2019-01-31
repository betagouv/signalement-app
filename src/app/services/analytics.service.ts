import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private angulartics2: Angulartics2) {
  }

  trackEvent(category, action, name?, value?) {
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({
        action,
        properties: { category, name, value }
      });
    }
  }
}

export enum EventCategories {
  report = 'Signalement',
  company = 'Identification de l\'établissement'
}

export enum ReportEventActions {
  information = 'Affichage d\'un message d\'information',
  secondaryCategories = 'Affichage des autres problèmes',
  validateCategory = 'Sélection d\'une catégorie',
  validateSubcategory = 'Sélection d\'une sous catégorie',
  validateDetails = 'Validation de la description',
  validateCompany = 'Validation de l\'établissement',
  validateConsumer = 'Validation du consommateur',
  validateConfirmation = 'Envoi d\'un signalement',
}

export enum CompanyEventActions {
  search = 'Recherche',
  select = 'Sélection dans la liste de résultats',
  manualEntry = 'Saisie manuelle'
}

export enum CompanySearchEventNames {
  noResult = 'Aucun résultat',
  tooManyResults = 'Trop de résultat',
  severalResult = 'Plusieurs résultats',
  singleResult = 'Un seul résultat'
}




