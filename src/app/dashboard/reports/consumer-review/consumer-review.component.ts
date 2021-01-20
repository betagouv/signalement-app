import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ReviewOnReportResponse } from '../../../model/ReportEvent';
import HttpStatusCodes from 'http-status-codes';
import { Meta, Title } from '@angular/platform-browser';
import pages from '../../../../assets/data/pages.json';

@Component({
  selector: 'app-consumer-review',
  templateUrl: './consumer-review.component.html',
  styleUrls: ['./consumer-review.component.scss']
})
export class ConsumerReviewComponent implements OnInit {

  reportId!: string;

  readonly positiveCtrl = this.formBuilder.control('', Validators.required);
  readonly detailsCtrl = this.formBuilder.control('');
  readonly reviewForm = this.formBuilder.group({
    positive: this.positiveCtrl,
    details: this.detailsCtrl
  });

  showErrors = false;
  loading = false;
  loadingError = false;
  conflictError?: boolean;
  postSuccess?: boolean;

  constructor(public formBuilder: FormBuilder,
    private reportService: ReportService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle(pages.reports.review.title);
    this.meta.updateTag({ name: 'description', content: pages.reports.review.title });

    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => this.reportId = params.get('reportId')!
    );
    this.postSuccess = false;
  }

  submitReviewForm() {
    if (!this.reviewForm.valid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      this.loadingError = false;
      this.reportService.postReviewOnReportResponse(
        this.reportId,
        Object.assign(new ReviewOnReportResponse(), {
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
