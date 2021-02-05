import { Component, HostBinding, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-page',
  template: `
    <main role="main">
      <ng-content></ng-content>
    </main>
  `,
  host: {
    '[class.large]': 'large',
    '[class.container]': 'true',
  },
  styleUrls: ['./page.component.scss'],
  animations: [
    trigger('animation', [
      transition('void => true', [
        style({ opacity: 0, transform: 'translate3d(0, 40px, 0)' }),
        animate('360ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }))
      ]),
      transition('true => void', [
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

  private _animated = true;
  @Input()
  get animated() {
    return this._animated;
  }

  set animated(value: any) {
    this._animated = coerceBooleanProperty(value);
  }

  private _large = false;
  @Input()
  get large() {
    return this._large;
  }

  set large(value: any) {
    this._large = coerceBooleanProperty(value);
  }
}
