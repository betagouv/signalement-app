import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-page',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./page.component.scss'],
  animations: [
    trigger('animation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate3d(0, 40px, 0)' }),
        animate('360ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }))
      ]),
      transition(':leave', [
        animate('360ms cubic-bezier(0.35, 0, 0.25, 1)', style({
          opacity: 0,
          transform: 'translate3d(0, 40px 0)'
        }))
      ]),
    ])
  ]
})
export class PageComponent {
  @HostBinding('@animation')
  get animation() {
    return this.animated;
  }

  @Input() animated = true;
}
