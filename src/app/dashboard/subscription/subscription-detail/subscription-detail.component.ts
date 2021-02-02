import { Component, Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from '../../../api-sdk/model/Subscription';
import { SubscriptionService } from '../../../services/subscription.service';
import { Department, Departments } from '../../../model/Region';
import { AnomalyService } from '../../../services/anomaly.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import oldCategories from '../../../../assets/data/old-categories.json';
import { ConstantService } from '../../../services/constant.service';

@Directive({
  selector: '[appSubscriptionDialog]',
  host: {
    '(click)': 'openDialog()'
  },
})
export class SubscriptionDialogDirective {

  constructor(public dialog: MatDialog) {
  }

  @Input() appSubscriptionDialog?: Subscription;

  @Output() submitted = new EventEmitter<Subscription>();

  openDialog(): void {
    const ref = this.dialog.open(SubscriptionDetailComponent, { width: '500px', });
    ref.componentInstance.submitted = this.submitted;
    ref.componentInstance.subscription = this.appSubscriptionDialog;
  }
}

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-detail.component.html',
  styleUrls: ['./subscription-detail.component.scss']
})
export class SubscriptionDetailComponent implements OnInit {

  readonly departments = Departments;

  readonly departmentCtrl = new FormControl('');
  readonly departmentForm = this.formBuilder.group(this.departmentCtrl);
  readonly categoryCtrl = new FormControl('');
  readonly categoryForm = this.formBuilder.group(this.categoryCtrl);
  readonly siretCtrl = new FormControl('');
  readonly siretForm = this.formBuilder.group(this.siretCtrl);

  categories: string[];

  constructor(
    // private dialogRef: MatDialogRef<SubscriptionDialogDirective>,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private constantService: ConstantService,
    public subscriptionService: SubscriptionService,
    private anomalyService: AnomalyService) {
  }

  readonly countries$ = this.constantService.getCountries();

  @Input() subscription?: Subscription;

  @Output() submitted = new EventEmitter<Subscription>();

  ngOnInit() {
    this.categories = this.anomalyService.getCategories();
    this.categories = [
      ...this.anomalyService.getAnomalies().filter(anomaly => !anomaly.information).map(anomaly => anomaly.category),
      ...oldCategories
    ];
  }

  readonly submitSubscription = () => {

  };

  addToDepartementFilter() {
    const newDepartments = this.departmentCtrl.value.split(',')
      .map(code => this.departments.find(d => d.code === code.trim().padStart(2, '0')))
      .filter(dept => dept !== undefined)
      .filter((dept, index, deptArray) => deptArray.findIndex(d => d === dept) === index) // unicity
      .filter(dept => this.subscription.departments.indexOf(dept) === -1); // new department only
    if (newDepartments) {
      this.subscription.departments.push(...newDepartments);
      this.subscription.departments.sort((d1, d2) => d1.code.localeCompare(d2.code));
    }
    this.departmentCtrl.setValue('');
  }

  removeFromDepartementFilter(departement: Department) {
    this.subscription.departments.splice(this.subscription.departments.findIndex(d => d === departement), 1);
  }

  addToCategoryFilter() {
    if (this.categoryCtrl.value && this.subscription.categories.indexOf(this.categoryCtrl.value) === -1) {
      this.subscription.categories.push(this.categoryCtrl.value);
      this.subscription.categories.sort();
    }
    this.categoryCtrl.setValue('');
  }

  removeFromCategoryFilter(category: String) {
    this.subscription.categories.splice(this.subscription.categories.findIndex(c => c === category), 1);
  }

  addToSiretFilter() {
    const newSirets = this.siretCtrl.value.split(',')
      .map(siret => siret.replace(/\s/g, ''))
      .filter(siret => siret.match(/[0-9]{14}/))
      .filter((siret, index, siretArray) => siretArray.findIndex(d => d === siret) === index) // unicity
      .filter(siret => this.subscription.sirets.indexOf(siret) === -1); // new department only
    if (newSirets) {
      this.subscription.sirets.push(...newSirets);
      this.subscription.sirets.sort();
    }
    this.siretCtrl.setValue('');
  }

  removeFromSiretFilter(siret: String) {
    this.subscription.sirets.splice(this.subscription.sirets.findIndex(s => s === siret), 1);
  }

  cancel() {
    // this.dialogRef.close();
  }

}
