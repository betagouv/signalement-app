import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-problem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="notification info">
      <strong>Ce problème est un litige : </strong>
      c'est-à-dire un problème individuel entre l’entreprise et vous.
      <p class="m-0">
        La répression des fraudes ne s’occupe pas directement de résoudre des problèmes individuels.
      </p>
    </div>

    <h2 class="pt-3 pb-3">Pourquoi faire un signalement ?</h2>

    <ul>
      <li>
        <strong>
          Pour augmenter vos chances de trouver une solution avec l'entreprise :
        </strong>
        50% des professionnels apportent une réponse au signalement.
      </li>
      <li>
        <strong>
          Pour l’acte citoyen :
        </strong>
        les enquêteurs de la répression des fraudes ne vont pas résoudre directement votre problème mais pourront lancer une enquête
        auprès de l’entreprise grâce à vos informations.
      </li>
      <li>
        <strong>
          Pour faire les bonnes démarches :
        </strong>
        SignalConso vous guide dans la marche à suivre pour trouver une solution ou obtenir réparation.
      </li>
    </ul>
  `
})
export class AlertContractualDisputeComponent {
}
