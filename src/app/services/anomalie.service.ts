import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Anomalie, TypeAnomalie } from '../model/Anomalie';

@Injectable({
  providedIn: 'root'
})
export class AnomalieService {

  constructor() { }

  getAnomalies() {
    return of([
      new Anomalie(
        'Café restaurant',
        [
          new TypeAnomalie('Hygiène', ['Restaurant sale', 'Présence de rat ou d\'insecte']),
          new TypeAnomalie('Nourriture', ['Malade suite à un repas', 'Plat de mauvaise qualité, pas frais ou pas bon']),
          new TypeAnomalie('Paiement', ['Refus de remise d\'une note', 'Refus d\'un moyen de paiement non annoncé'])
        ]),
      new Anomalie(
        'Grande surface et supérette',
          [
            new TypeAnomalie('Prix', ['Absence d\'affichage de prix ou absence de carte', 'Prix trop cher']),
          ])
      ]);
  }
}
