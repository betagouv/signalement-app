import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Utils from '../../../../utils';
import { Region, Regions } from '../../../../model/Region';
import { MatPseudoCheckboxState } from '@angular/material/core';

@Component({
  selector: 'app-select-departments',
  template: `
    <mat-select [placeholder]="placeholder" multiple [(ngModel)]="value" (ngModelChange)="onChangeCallback(this.value)"
                [disabled]="disabled">
      <mat-option class="mat-option-dense" [hidden]="true">Hack because panel won't open is there is not mat-option</mat-option>
      <div class="mat-option select-optgroup" matRipple (click)="toggleAllDepartments()">
        <mat-pseudo-checkbox [state]="getDepartmentsCheckboxState()" class="mat-option-pseudo-checkbox"></mat-pseudo-checkbox>
        Tous les départements
      </div>
      <ng-container *ngFor="let region of regions">
        <div class="mat-option select-optgroup" matRipple (click)="toggleAllDepartments(region)">
          <mat-pseudo-checkbox class="mat-option-pseudo-checkbox" [state]="getDepartmentsCheckboxState(region)"></mat-pseudo-checkbox>
          {{region.label}}
          <mat-icon class="-expend_more" (click)="toggleVisibility(region.label, $event)">
            {{visibleRegions.has(region.label) ? 'expand_more' : 'navigate_next'}}
          </mat-icon>
        </div>
        <ng-container *ngIf="visibleRegions.has(region.label)">
          <mat-option class="mat-option-dense txt-secondary" *ngFor="let dep of region.departments" [value]="dep.code">
            ({{dep.code}}) {{dep.label}}
          </mat-option>
        </ng-container>
      </ng-container>
    </mat-select>
  `,
  styleUrls: ['./select-departments.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectDepartmentsComponent),
    multi: true
  }],
})
export class SelectDepartmentsComponent implements ControlValueAccessor {

  constructor() {
  }

  @Input() disabled?: boolean;

  @Input() placeholder?: string;

  readonly regions: Region[] = Regions;

  readonly visibleRegions = new Set();

  readonly departments = this.regions.flatMap(_ => _.departments).map(_ => _.code);

  value: string[];

  writeValue(value: any): void {
    this.value = value;
    this.onChangeCallback(this.value);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private onTouched = () => {
  };

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  onChangeCallback: (_: any) => void = (_: any) => {
  };

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private allDepartmentsSelected = (r?: Region): boolean => {
    const departments = r ? r.departments.map(_ => _.code) : this.departments;
    return departments.every(_ => this.safeDepartmentInputValue.includes(_));
  };

  private noDepartmentsSelected = (r?: Region): boolean => {
    const departments = r ? r.departments.map(_ => _.code) : this.departments;
    return !departments.find(_ => this.safeDepartmentInputValue.includes(_));
  };

  getDepartmentsCheckboxState = (r?: Region): MatPseudoCheckboxState => {
    if (this.noDepartmentsSelected(r)) {
      return 'unchecked';
    }
    if (this.allDepartmentsSelected(r)) {
      return 'checked';
    }
    return 'indeterminate';
  };

  toggleAllDepartments = (region?: Region) => {
    if (this.noDepartmentsSelected(region)) {
      this.selectAllDepartments(region);
    } else {
      this.removeAllDepartments(region);
    }
    this.onChangeCallback(this.value);
  };

  get safeDepartmentInputValue() {
    return this.value || [];
  }

  private selectAllDepartments = (region?: Region) => {
    const departments = region ? region.departments.map(_ => _.code) : this.departments;
    this.value = Utils.uniqueValues([...this.safeDepartmentInputValue, ...departments]);
  };

  private removeAllDepartments = (region?: Region) => {
    const departments = region ? region.departments.map(_ => _.code) : this.departments;
    this.value = this.safeDepartmentInputValue.filter(_ => !departments.includes(_));
  };

  readonly toggleVisibility = (region: string, $event: any) => {
    $event.stopPropagation();
    if (this.visibleRegions.has(region)) {
      this.visibleRegions.delete(region);
    } else {
      this.visibleRegions.add(region);
    }
  };
}
