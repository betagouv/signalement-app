import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Department, Region, Regions } from '../../../../model/Region';
import { MatPseudoCheckboxState } from '@angular/material/core';
import { Animations } from '../../../../utils/animations';

@Component({
  selector: 'app-select-departments',
  template: `
    <mat-select [placeholder]="placeholder" [disabled]="disabled" [value]="1">
      <mat-select-trigger>{{getSelectValue()}}</mat-select-trigger>
      <mat-option class="mat-option-dense" [value]="1" [hidden]="true">
        Hack because panel won't open is there is not mat-option.
        To set a value is also a needed hack to display mat-select-trigger...
      </mat-option>
      <div class="mat-option select-optgroup" matRipple (click)="toggleAllDepartments()">
        <mat-pseudo-checkbox [state]="getRegionCheckboxState()" class="mat-option-pseudo-checkbox"></mat-pseudo-checkbox>
        Tous les départements
      </div>
      <ng-container *ngFor="let r of regions">
        <div class="mat-option select-optgroup" matRipple (click)="toggleAllDepartments(r)">
          <mat-pseudo-checkbox class="mat-option-pseudo-checkbox" [state]="getRegionCheckboxState(r)"></mat-pseudo-checkbox>
          {{r.label}}
          <mat-icon class="-expend_more" (click)="toggleVisibility(r.label, $event)">
            {{visibleRegions.has(r.label) ? 'expand_more' : 'navigate_next'}}
          </mat-icon>
        </div>
        <div *ngIf="visibleRegions.has(r.label)" @slideToggleNgIf>
          <div class="mat-option mat-option-dense txt-secondary" *ngFor="let d of r.departments" (click)="toggleDepartment(d)" matRipple>
            <mat-pseudo-checkbox class="mat-option-pseudo-checkbox" [state]="getDepartmentCheckboxState(d)"></mat-pseudo-checkbox>
            ({{d.code}}) {{d.label}}
          </div>
        </div>
      </ng-container>
    </mat-select>
  `,
  animations: [Animations.slideToggleNgIf],
  styleUrls: ['./select-departments.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectDepartmentsComponent),
    multi: true
  }],
})
export class SelectDepartmentsComponent implements ControlValueAccessor {

  @Input() disabled?: boolean;

  @Input() placeholder?: string;

  readonly regions: Region[] = Regions;

  readonly visibleRegions = new Set();

  readonly departments = this.regions.flatMap(_ => _.departments).map(_ => _.code);

  selectedDepartments = new Set<string>();

  readonly getSelectValue = (): string => [...this.selectedDepartments].join(',');

  writeValue(value: string[]): void {
    this.selectedDepartments = new Set(value);
    this.onChangeCallback(value);
  }

  readonly departmentCodes = (r?: Region): string[] => r ? r.departments.map(_ => _.code) : this.departments;

  private readonly allDepartmentsSelected = (r?: Region): boolean => {
    return this.departmentCodes(r).every(_ => this.selectedDepartments.has(_));
  };

  private readonly noDepartmentsSelected = (r?: Region): boolean => {
    return !this.departmentCodes(r).find(_ => this.selectedDepartments.has(_));
  };

  readonly getRegionCheckboxState = (r?: Region): MatPseudoCheckboxState => {
    if (this.noDepartmentsSelected(r)) {
      return 'unchecked';
    }
    if (this.allDepartmentsSelected(r)) {
      return 'checked';
    }
    return 'indeterminate';
  };

  readonly getDepartmentCheckboxState = (d: Department): MatPseudoCheckboxState => this.selectedDepartments.has(d.code) ? 'checked' : 'unchecked';

  readonly toggleAllDepartments = (r?: Region) => {
    if (this.noDepartmentsSelected(r)) {
      this.selectAllDepartments(r);
    } else {
      this.removeAllDepartments(r);
    }
    this.onChangeCallback([...this.selectedDepartments]);
  };

  private selectAllDepartments = (r?: Region) => {
    this.departmentCodes(r).forEach(_ => this.selectedDepartments.add(_));
  };

  private removeAllDepartments = (r?: Region) => {
    this.departmentCodes(r).forEach(_ => this.selectedDepartments.delete(_));
  };

  readonly toggleDepartment = (d: Department) => {
    if (this.selectedDepartments.has(d.code)) {
      this.selectedDepartments.delete(d.code);
    } else {
      this.selectedDepartments.add(d.code);
    }
    this.onChangeCallback([...this.selectedDepartments]);
  };

  readonly toggleVisibility = (r: string, $event: any) => {
    $event.stopPropagation();
    if (this.visibleRegions.has(r)) {
      this.visibleRegions.delete(r);
    } else {
      this.visibleRegions.add(r);
    }
  };

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
}
