import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-member',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="team-member-info">
      <div class="team-member-name">{{name}}</div>
      <div class="team-member-role">
        {{role}}<br/>
        <span *ngIf="!dgccre">&nbsp;</span>
        <ng-container *ngIf="dgccre">
          Inspecteur <abbr title="Direction Générale de la Concurrence, Consommation et Répression des Fraudes">DGCCRF</abbr>
        </ng-container>
      </div>
    </div>
    <img src="/assets/images/avatars/{{avatar}}" alt="Avatar {{name}}"/>
  `,
  host: {
    '[class.old]': 'disabled',
  },
  styleUrls: ['./member.component.scss']
})
export class MemberComponent {
  @Input() name: string;
  @Input() role: string;
  @Input() avatar: string;
  @Input() dgccre: boolean;
  @Input() disabled: boolean;
}
