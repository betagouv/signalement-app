import { animate, style, transition, trigger } from '@angular/animations';

export const slideToggle = trigger('slideToggle', [
  transition(':enter', [style({ opacity: 0, height: 0, }), animate('160ms', style({ opacity: 1, height: '*' }))]),
  transition(':leave', [animate('160ms', style({ opacity: 0, height: 0, }))]),
]);
