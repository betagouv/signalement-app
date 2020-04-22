import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from '../../../model/Subscription';
import { SubscriptionService } from '../../../services/subscription.service';
import { Department, Departments } from '../../../model/Region';
import { AnomalyService } from '../../../services/anomaly.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-subscription-detail',
  templateUrl: './subscription-detail.component.html',
  styleUrls: ['./subscription-detail.component.scss']
})
export class SubscriptionDetailComponent implements OnInit {

  categories: string[];
  departments = Departments;

  subscription: Subscription;

  departmentForm: FormGroup;
  departmentCtrl: FormControl;

  categoryForm: FormGroup;
  categoryCtrl: FormControl;

  siretForm: FormGroup;
  siretCtrl: FormControl;

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(public formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private subscriptionService: SubscriptionService,
              private anomalyService: AnomalyService,
              private platformLocation: PlatformLocation,
              private router: Router) { }

  ngOnInit() {

    this.loading = true;
    if (this.route.snapshot.paramMap.get('subscriptionId')) {
      this.subscriptionService.getSubscription(this.route.snapshot.paramMap.get('subscriptionId')).subscribe(
        subscription => {
          this.subscription = subscription;
          this.loading = false;
          this.initSubscriptionForms();
        },
        err => {
          this.loading = false;
          this.loadingError = true;
        });
    } else {
      this.subscription = new Subscription();
      this.initSubscriptionForms();
    }
  }

  initSubscriptionForms() {
    this.categories = this.anomalyService.getCategories();

    this.departmentCtrl = new FormControl('');
    this.departmentForm = this.formBuilder.group(this.departmentCtrl);

    this.categoryCtrl = new FormControl('');
    this.categoryForm = this.formBuilder.group(this.categoryCtrl);

    this.siretCtrl = new FormControl('');
    this.siretForm = this.formBuilder.group(this.siretCtrl);
  }

  submitSubscription() {
    this.loading = true;
    this.loadingError = false;
    this.showErrors = true;
    this.subscriptionService.createOrUpdateSubscription(this.subscription).subscribe(
      subscription => {
        this.loading = false;
        this.platformLocation.back();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

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
    this.router.navigate(['abonnements']);
  }

}
