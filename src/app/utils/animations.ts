import { animate, state, style, transition, trigger } from '@angular/animations';

export class Animations {
  static readonly slideToggleNgIf = trigger('slideToggleNgIf', [
    transition(':enter', [style({ opacity: 0, height: 0, }), animate('160ms', style({ opacity: 1, height: '*' }))]),
    transition(':leave', [animate('160ms', style({ opacity: 0, height: 0, }))]),
  ]);

  static readonly slideToggle = trigger('slideToggle', [
    state('true', style({
      opacity: 1,
      height: '*',
    })),
    state('false', style({
      opacity: 0,
      height: 0,
      'min-height': 0,
    })),
    transition('true => false', [
      animate('160ms')
    ]),
    transition('false => true', [
      animate('160ms')
    ]),
  ]);

  static readonly appear = ({ exitAnimation = true, size = 40 }: {exitAnimation?: boolean, size?: number} = {}) => trigger('animation', [
    transition('void => true', [
      style({ opacity: 0, transform: `translate3d(0, ${size}px, 0)` }),
      animate('360ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }))
    ]),
    ...(exitAnimation ? [
        transition('true => void', [
          animate('360ms cubic-bezier(0.35, 0, 0.25, 1)', style({
            opacity: 0,
            transform: `translate3d(0, ${size}px 0)`
          }))
        ])] : []
    ),
  ]);
}
