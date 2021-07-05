import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-radio-container',
  host: {
    ['class.-selected']: 'selected'
  },
  template: `
    <div class="form-like row pb-2 pt-2">
      <div class="col col-radio z-0">
        <ng-content></ng-content>
      </div>
      <div class="col">
        <label class="d-block mb-0 pointer" [for]="for">{{label}}</label>
        <div class="note" [innerHTML]="description" *ngIf="description"></div>
      </div>
    </div>
  `,
  styleUrls: ['./radio-container.component.scss'],
})
export class RadioContainerComponent {

  @Input() for: string;

  @Input() label: string;

  @Input() description: string;

  @Input() selected?: boolean;
}
