import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ComponentsModule } from '../../../components/components.module';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-contractual-dispute',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-dialog-content>
      <h2 class="-title" mat-dialog-title>
        <mat-icon class="-title_icon">info</mat-icon>
        Ce problème est un litige
      </h2>

      <p>
        C'est-à-dire un problème individuel entre l’entreprise et vous.
        <br/>
        La répression des fraudes ne s’occupe pas directement de résoudre des problèmes individuels.
      </p>

      <div class="font-weight-bold pb-1">Pourquoi faire un signalement ?</div>

      <ul style="padding-inline-start: 18px;">
        <li>
          <strong>
            Pour augmenter vos chances de trouver une solution avec l'entreprise:
          </strong>
          50% des professionnels apportent une réponse au signalement.
        </li>
        <li>
          <strong>
            Pour l’acte citoyen:
          </strong>
          les enquêteurs de la répression des fraudes ne vont pas résoudre directement votre problème mais pourront lancer une enquête
          auprès de l’entreprise grâce à vos informations.
        </li>
        <li>
          <strong>
            Pour faire les bonnes démarches:
          </strong>
          SignalConso vous guide dans la marche à suivre pour trouver une solution ou obtenir réparation.
        </li>
      </ul>
    </mat-dialog-content>
    <div mat-dialog-actions>
      <button type="button" class="btn btn-lg btn-primary" [mat-dialog-close]="true">
        Continuer
      </button>
      <button type="button" class="btn btn-lg" [mat-dialog-close]="false">
        Fermer
      </button>
    </div>
  `,
  styleUrls: ['./alert-contractual-dispute.component.scss']
})
export class DialogContractualDisputeComponent {
}

@NgModule({
  declarations: [
    DialogContractualDisputeComponent,
  ],
  exports: [
    DialogContractualDisputeComponent,
  ],
  imports: [
    MatDialogModule,
    ComponentsModule,
  ]
})
export class DialogContractualDisputeModule {
}
