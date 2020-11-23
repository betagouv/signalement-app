import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-member',
  template: `
    <div class="team-member-info">
      <div class="team-member-name">{{name}}</div>
      <div class="team-member-role">
        {{role}}
        <ng-container *ngIf="dgccre">
          <br/>Inspecteur <abbr title="Direction Générale de la Concurrence, Consommation et Répression des Fraudes">DGCCRF</abbr>
        </ng-container>
      </div>
    </div>
    <img src="/assets/images/avatars/{{avatar}}" alt=""/>
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
