import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Departments, Regions } from '../../../model/Region';
import { SubscriptionService } from '../../../services/subscription.service';
import { Subscription } from '../../../model/Subscription';
import pages from '../../../../assets/data/pages.json';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  regions = Regions;
  departments = Departments;
  departmentSubscription: Subscription;

  subscriptionForm: FormGroup;

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(public formBuilder: FormBuilder,
              private titleService: Title,
              private meta: Meta,
              private subscriptionService: SubscriptionService) { }

  ngOnInit() {
    this.titleService.setTitle(pages.secured.subscriptions.title);
    this.meta.updateTag({ name: 'description', content: pages.secured.subscriptions.description });

    this.loading = true;
    this.subscriptionService.getSubscriptions().subscribe(
      subscriptions => {
        this.departmentSubscription = subscriptions.length ? subscriptions[0] : new Subscription();
        this.loading = false;
      }
    );
  }

  showSubscriptionForm() {
    this.subscriptionForm = this.formBuilder.group({});
    this.departments.forEach(department => {
      this.subscriptionForm.addControl(
        `department_${department.code}`,
        this.formBuilder.control(
          this.departmentSubscription ? this.departmentSubscription.values.indexOf(department.code) !== -1 : false
        )
      );
    });
  }

  hideSubscriptionForm() {
    this.subscriptionForm = undefined;
  }

  submitSubscriptionForm() {
    if (!this.subscriptionForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.loadingError = false;
      this.subscriptionService.subscribe(
        Object.assign(this.departmentSubscription ? this.departmentSubscription : new Subscription(), {
          category: 'Departments',
          values: this.departments
            .filter(department => this.subscriptionForm
              .get([`department_${department.code}`]) && this.subscriptionForm.get([`department_${department.code}`]).value)
            .map(department => department.code)
        })
      )
      .subscribe(
        subscription => {
          this.loading = false;
          this.departmentSubscription = subscription;
          this.hideSubscriptionForm();
        },
        err => {
          this.loading = false;
          this.loadingError = true;
        });
    }

  }

  getDepartement(code: string) {
    return this.departments.find(department => department.code === code);
  }

}
