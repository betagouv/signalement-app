import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Department, Departments } from '../../model/Region';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription } from '../../model/Subscription';
import pages from '../../../assets/data/pages.json';
import { Meta, Title } from '@angular/platform-browser';
import { AnomalyService } from '../../services/anomaly.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  departments = Departments;
  categories: string[];

  subscriptions: Subscription[];

  departmentForm: FormGroup;
  departmentCtrl: FormControl;
  departmentFilter: Department[];

  categoryForm: FormGroup;
  categoryCtrl: FormControl;
  categoryFilter: string[];

  siretForm: FormGroup;
  siretCtrl: FormControl;
  siretFilter: String[];

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private subscriptionService: SubscriptionService,
              private anomalyService: AnomalyService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.subscriptions.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.subscriptions.description });

    this.loading = true;
    this.subscriptionService.getSubscriptions().subscribe(
      subscriptions => {
        this.subscriptions = subscriptions;
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      }
    );
  }

  showSubscriptionForm() {
    this.categories = this.anomalyService.getCategories();

    this.departmentCtrl = new FormControl('');
    this.departmentForm = this.formBuilder.group(this.departmentCtrl);
    this.departmentFilter = [];

    this.categoryCtrl = new FormControl('');
    this.categoryForm = this.formBuilder.group(this.categoryCtrl);
    this.categoryFilter = [];

    this.siretCtrl = new FormControl('');
    this.siretForm = this.formBuilder.group(this.siretCtrl);
    this.siretFilter = [];
  }

  hideSubscriptionForm() {
    this.departmentForm = undefined;
    this.categoryForm = undefined;
  }

  submitSubscription() {
    // TODO rajouter test au moins un critère
    this.loading = true;
    this.loadingError = false;
    this.subscriptionService.subscribe(
      Object.assign(new Subscription(), {
        departments: this.departmentFilter.map(dept => dept.code),
        categories: this.categoryFilter,
        sirets: this.siretFilter
      })
    )
    .subscribe(
      subscription => {
        this.loading = false;
        this.subscriptions.push(subscription);
        this.hideSubscriptionForm();
      },
      err => {
        this.loading = false;
        this.loadingError = true;
      });
  }

  removeSubscription(removeId: string) {
    this.subscriptionService.removeSubscription(removeId).subscribe(
      _ => this.subscriptions.splice(this.subscriptions.findIndex(s => s.id === removeId), 1)
    );
  }

  addToDepartementFilter() {
    const newDepartments = this.departmentCtrl.value.split(',')
      .map(code => this.departments.find(d => d.code === code.trim().padStart(2, '0')))
      .filter(dept => dept !== undefined)
      .filter((dept, index, deptArray) => deptArray.findIndex(d => d === dept) === index) // unicity
      .filter(dept => this.departmentFilter.indexOf(dept) === -1); // new department only
    if (newDepartments) {
      this.departmentFilter.push(...newDepartments);
      this.departmentFilter.sort((d1, d2) => d1.code.localeCompare(d2.code));
    }
    this.departmentCtrl.setValue('');
  }

  removeFromDepartementFilter(departement: Department) {
    this.departmentFilter.splice(this.departmentFilter.findIndex(d => d === departement), 1);
  }

  addToCategoryFilter() {
    if (this.categoryCtrl.value && this.categoryFilter.indexOf(this.categoryCtrl.value) === -1) {
      this.categoryFilter.push(this.categoryCtrl.value);
      this.categoryFilter.sort();
    }
    this.categoryCtrl.setValue('');
  }

  removeFromCategoryFilter(category: String) {
    this.categoryFilter.splice(this.categoryFilter.findIndex(c => c === category), 1);
  }

  addToSiretFilter() {
    const newSirets = this.siretCtrl.value.split(',')
      .filter(siret => siret.match(/[0-9]{14}/))
      .filter((siret, index, siretArray) => siretArray.findIndex(d => d === siret) === index) // unicity
      .filter(siret => this.siretFilter.indexOf(siret) === -1); // new department only
    if (newSirets) {
      this.siretFilter.push(...newSirets);
      this.siretFilter.sort();
    }
    this.siretCtrl.setValue('');
  }

  removeFromSiretFilter(siret: String) {
    this.siretFilter.splice(this.siretFilter.findIndex(s => s === siret), 1);
  }

}
