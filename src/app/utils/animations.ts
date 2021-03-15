import { animate, state, style, transition, trigger } from '@angular/animations';

export const slideToggleNgIf = trigger('slideToggleNgIf', [
  transition(':enter', [style({ opacity: 0, height: 0, }), animate('160ms', style({ opacity: 1, height: '*' }))]),
  transition(':leave', [animate('160ms', style({ opacity: 0, height: 0, }))]),
]);

export const slideToggle = trigger('slideToggle', [
  state('open', style({
    opacity: 1,
    height: '*',
  })),
  state('closed', style({
    opacity: 0,
    height: 0,
  })),
  transition('open => closed', [
    animate('160ms')
  ]),
  transition('closed => open', [
    animate('160ms')
  ]),
]);
