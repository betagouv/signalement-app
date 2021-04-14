import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Animations } from '../../../utils/animations';

export interface ProblemStep {
  title: string;
  example?: string;
  value?: any;
}

@Component({
  selector: 'app-problem-step[step]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'onChange()',
    '[class]': 'selected ? \'-selected\' : \'\' ',
  },
  template: `
    <mat-radio-button class="-radio" [checked]="!!selected"></mat-radio-button>
    <!--    <input class="-radio" type="radio" [checked]="!!selected"/>-->
    <div>
      <div class="-title">{{step.title}}</div>
      <div class="-desc" *ngIf="step.example">{{step.example}}</div>
    </div>
  `,
  styleUrls: ['./problem-step.component.scss'],
})
export class ProblemStepComponent {

  @Input() step!: ProblemStep;

  @Input() selected?: boolean;

  @Output() changed = new EventEmitter<string>();

  readonly onChange = () => this.changed.emit(this.step.value ?? this.step.title);
}

@Component({
  selector: 'app-problem-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 [innerHTML]="title || 'Pouvez-vous préciser ?'" class="-title"></h3>

    <app-problem-step
      *ngFor="let step of steps"
      [step]="step"
      [selected]="step.value !== undefined ? step.value === selected : step.title === selected"
      (changed)="onChange($event)"
    ></app-problem-step>
  `,
  styleUrls: ['./problem-steps.component.scss'],
  animations: [Animations.appear({ exitAnimation: false })]
})
export class ProblemStepsComponent {

  @HostBinding('@animation') readonly animation = true;

  @Input() steps: ProblemStep[] = [];

  @Input() selected?: any;

  @Input() title?: string;

  @Output() changed = new EventEmitter<any>();

  readonly onChange = (selectedTitle: any) => {
    this.changed.emit(selectedTitle);
  };
}

