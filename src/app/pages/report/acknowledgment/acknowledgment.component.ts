import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReportStorageService } from '../../../services/report-storage.service';
import { DraftReport, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { take } from 'rxjs/operators';
import { Country } from '../../../model/Country';
import { combineLatest } from 'rxjs';
import { ConstantService } from '../../../services/constant.service';

enum AcknowledgmentCases {
  EmployeeReport, ForeignCompany, FrenchCompanyWithoutSIRET, ContractualDisputeWithSIRET, NotTransmittable, Default
}

@Component({
  selector: 'app-acknowledgment',
  templateUrl: './acknowledgment.component.html',
  styleUrls: ['./acknowledgment.component.scss']
})
export class AcknowledgmentComponent implements OnInit, OnDestroy {

  step: Step;
  draftReport: DraftReport;

  foreignCountry?: Country;

  acknowledgmentCases = AcknowledgmentCases;
  acknowledgmentCase: AcknowledgmentCases;

  constructor(private reportStorageService: ReportStorageService,
              private constantService: ConstantService,
              private reportRouterService: ReportRouterService) { }

  ngOnInit() {
    this.step = Step.Acknowledgment;
    combineLatest([
      this.reportStorageService.retrieveReportInProgress().pipe(take(1)),
      this.constantService.getCountries()
    ]).subscribe(([draftReport, countries]) => {
        if (draftReport) {
          this.draftReport = draftReport;
          this.foreignCountry = countries.find(country => country.name === draftReport.draftCompany.country);
          this.initAcknowledgmentCase();
        } else {
          this.reportRouterService.routeToFirstStep();
        }
      });
  }

  ngOnDestroy() {
    this.reportStorageService.removeReportInProgress();
  }

  newReport() {
    this.reportStorageService.removeReportInProgress();
    this.reportRouterService.routeToFirstStep();
  }

  initAcknowledgmentCase() {
    if (this.draftReport.employeeConsumer) {
      this.acknowledgmentCase = AcknowledgmentCases.EmployeeReport;
    } else if (this.draftReport.draftCompany.country ?? 'France' !== 'France') {
      this.acknowledgmentCase = AcknowledgmentCases.ForeignCompany;
    } else if (!this.draftReport.isTransmittableToPro) {
      this.acknowledgmentCase = AcknowledgmentCases.NotTransmittable;
    } else if (!this.draftReport.draftCompany.siret) {
      this.acknowledgmentCase = AcknowledgmentCases.FrenchCompanyWithoutSIRET;
    } else if (this.draftReport.isContractualDispute && this.draftReport.draftCompany.siret) {
      this.acknowledgmentCase = AcknowledgmentCases.ContractualDisputeWithSIRET;
    } else {
      this.acknowledgmentCase = AcknowledgmentCases.Default;
    }
  }

}



@Component({
  selector: 'app-ack-charge-back',
  template: `
    <ng-container *ngIf="draftReport?.isContractualDispute && draftReport?.draftCompany.website">
      <p>
        <strong>Vous avez payé avec votre carte bancaire ?</strong>
      </p>
      <p>
        Grâce à la procédure de charge-back vous pouvez être remboursé gratuitement suite à un achat effectué en ligne :
        <a href="https://www.economie.gouv.fr/particuliers/procedure-chargeback">https://www.economie.gouv.fr/particuliers/procedure-chargeback</a>
      </p>
    </ng-container>
  `
})
export class AcknowledgmentChargeBackComponent {

  @Input() draftReport: DraftReport;

  constructor() { }
}

