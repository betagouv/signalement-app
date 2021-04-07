import { animate, state, style, transition, trigger } from '@angular/animations';

export const slideToggleNgIf = trigger('slideToggleNgIf', [
  transition(':enter', [style({ opacity: 0, height: 0, }), animate('160ms', style({ opacity: 1, height: '*' }))]),
  transition(':leave', [animate('160ms', style({ opacity: 0, height: 0, }))]),
]);

export const slideToggle = trigger('slideToggle', [
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
