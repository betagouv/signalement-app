import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AdviceOnReportResponse } from '../../../model/ReportEvent';
import HttpStatusCodes from 'http-status-codes';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-consumer-advice',
  templateUrl: './consumer-advice.component.html',
  styleUrls: ['./consumer-advice.component.scss']
})
export class ConsumerAdviceComponent implements OnInit {

  reportId: string;

  adviceForm: FormGroup;
  positiveCtrl: FormControl;
  detailsCtrl: FormControl;

  showErrors: boolean;
  loading: boolean;
  loadingError: boolean;
  conflictError: boolean;
  postSuccess: boolean;

  constructor(public formBuilder: FormBuilder,
              private reportService: ReportService,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(pages.reports.advice.title);
    this.meta.updateTag({ name: 'description', content: pages.reports.advice.title });

    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => this.reportId = params.get('reportId')
    );

    this.postSuccess = false;
    this.initAdviceForm();
  }

  initAdviceForm() {
    this.positiveCtrl = this.formBuilder.control('', Validators.required);
    this.detailsCtrl = this.formBuilder.control('');
    this.adviceForm = this.formBuilder.group({
      positive: this.positiveCtrl,
      details: this.detailsCtrl
    });
  }

  submitAdviceForm() {
    if (!this.adviceForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.loadingError = false;
      this.reportService.postAdviceOnReportResponse(
        this.reportId,
        Object.assign(new AdviceOnReportResponse(), {
          positive: this.positiveCtrl.value,
          details: this.detailsCtrl.value
        })
      ).subscribe(
        events => {
          this.loading = false;
          this.postSuccess = true;
        },
        err => {
          this.loading = false;
          if (err.status === HttpStatusCodes.CONFLICT) {
            this.conflictError = true;
          } else {
            this.loadingError = true;
          }
        });
    }
  }

  getPositiveCtrlClass(value: boolean) {
    return this.positiveCtrl.value === value ? 'selected' : 'not-selected';
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }
}
