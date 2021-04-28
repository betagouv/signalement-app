import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-email-validation-consumer',
  template: `
    <app-banner title="Validation de l'email"></app-banner>
    <app-page pageDefinitionKey="account_emailValidation" size="small">
      <app-fender *ngIf="email$ | async as email; else invalidTpl" type="success" title="Votre adresse {{email}} est validée !">
        Le signalement a été envoyé à l'entreprise.
      </app-fender>
      <ng-template #invalidTpl>
        <app-fender title="Le lien sur lequel vous avez cliqué n'est plus valide."></app-fender>
      </ng-template>
    </app-page>
  `
})
export class EmailValidationConsumerComponent {

  constructor(private route: ActivatedRoute) {
  }

  readonly email$ = this.route.paramMap.pipe(map(_ => _.get('email')));
}
