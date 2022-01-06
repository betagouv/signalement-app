import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DraftReport, isContractualDispute, Step } from '../../../model/Report';
import { distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { AnomalyClient, ReportTag, Subcategory } from '@signal-conso/signalconso-api-sdk-js';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ProblemStep } from './problem-step.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogContractualDisputeComponent } from './alert-contractual-dispute.component';
import { environment } from '../../../../environments/environment';

const getSubcategory = (anomaly: Subcategory, path: string[]): Subcategory[] => {
  const [current, ...nextPath] = path;
  if (current && anomaly.subcategories) {
    const pickedCategory = anomaly.subcategories.find(_ => _.title === current);
    if (pickedCategory) {
      return [pickedCategory, ...getSubcategory(pickedCategory, nextPath)];
    }
  }
  return [];
};

@Component({
  selector: 'app-problem',
  template: `
    <app-breadcrumb [step]="step" [draftReport]="draftReport"></app-breadcrumb>
    <app-page size="small" *ngIf="draftReport">
      <ng-container *ngIf="(anomaly$ | async).subcategories as subcategories">
        <app-problem-steps
          [selected]="(selectedTitles$ | async)[0]"
          [steps]="subcategories"
          (changed)="onChange(subcategories, 0, $event)"
        ></app-problem-steps>
      </ng-container>

      <ng-container *ngFor="let step of getSteps | async; let i = index">
        <app-problem-steps
          *ngIf="step.subcategories"
          [title]="step.subcategoriesTitle"
          [steps]="step.subcategories"
          [selected]="(selectedTitles$ | async )[i + 1]"
          (changed)="onChange(step.subcategories, i + 1, $event)"
        ></app-problem-steps>
      </ng-container>

      <ng-container *ngIf="showEmployeeConsumer$ | async">
        <app-problem-steps
          title="Travaillez-vous dans l'entreprise que vous souhaitez signaler ?"
          [selected]="draftReport.employeeConsumer"
          [steps]="employeeConsumerStepOptions"
          (changed)="draftReport.employeeConsumer = $event"
        >
        </app-problem-steps>

        <app-problem-steps
          *ngIf="showReponseConsoQuestion()"
          title="Que souhaitez-vous faire ?"
          [selected]="draftReport.forwardToReponseConso"
          [steps]="reponseConsoStepOptions"
          (changed)="draftReport.forwardToReponseConso = $event"
        >
        </app-problem-steps>

        <app-problem-steps
          *ngIf="showContractualDispute()"
          title="Que souhaitez-vous faire ?"
          [selected]="draftReport.contractualDispute"
          [steps]="askForContractualDispute()"
          (changed)="draftReport.contractualDispute = $event"
        >
        </app-problem-steps>

      </ng-container>

      <ng-container *ngIf="showContinueButton() | async">
        <button type="button" class="btn btn-lg btn-primary" (click)="nextStepIfNotContractualDispute()">
          Continuer
        </button>
      </ng-container>
    </app-page>
  `,
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object,
    private anomalyService: AnomalyService,
    public dialog: MatDialog,
    private reportStorageService: ReportStorageService,
    private reportRouterService: ReportRouterService,
    private analyticsService: AnalyticsService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,
    private cdr: ChangeDetectorRef
  ) {
    this.activatedRoute.url.pipe(
      take(1),
      switchMap(
        url => {
          const anomaly = this.anomalyService.getAnomalyBy(a => a.path === url[0].path);
          if (anomaly && !url[1]) {
            this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCategory, anomaly.category);
            this.draftReport = new DraftReport();
            this.draftReport.category = anomaly.category;
            this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
            this.titleService.setTitle(`${anomaly.category} - SignalConso`);
            this.meta.updateTag({ name: 'description', content: anomaly.description || '' });
          }
          return this.reportStorageService.retrieveReportInProgress();
        }
      ),
      take(1),
    ).subscribe(report => {
      if (report && report.category) {
        this.draftReport = report;
        this.selectedCategoriesSubject.next(report.subcategories ?? []);
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  private readonly shouldDisplayReponseConso = Math.random() * 100 < environment.reponseConsoDisplayRate;
  readonly displayReponseConso = () => this.draftReport.forwardToReponseConso || this.shouldDisplayReponseConso;

  readonly step = Step.Problem;

  draftReport?: DraftReport;

  readonly employeeConsumerStepOptions: ProblemStep[] = [
    { title: 'Oui', value: true },
    { title: 'Non, je n\'y travaille pas', value: false }
  ];

  readonly reponseConsoStepOptions: ProblemStep[] = [
    {
      title: 'Je souhaite signaler mon problème personnel à l’entreprise pour qu’elle trouve une solution',
      example: 'La répression des fraudes sera informée',
      value: false
    },
    {
      title: 'Je souhaite que la Répression des Fraudes (DGCCRF) m’informe sur mes droits',
      value: true
    }
  ];

  readonly askForContractualDispute = (): ProblemStep[] => [
    {
      title: 'Je veux résoudre mon problème personnel avec l\'entreprise',
      example: 'La répression des fraudes sera informée',
      value: true
    },
    {
      title: 'Je souhaite signaler un problème pour que l\'entreprise s\'améliore',
      value: false
    },
    {
      title: 'Je souhaite que la Répression des Fraudes (DGCCRF) m’informe sur mes droits',
      value: true
    }

  ];

  readonly isContractualDispute = () => isContractualDispute(this.draftReport);

  readonly showReponseConsoQuestion = () => {
    const show = this.displayReponseConso()
      && this.selectedCategoriesSubject.getValue().find(_ => _.tags?.indexOf(ReportTag.ReponseConso) > -1)
      && this.draftReport.employeeConsumer === false;
    if (!show) {
      delete this.draftReport.forwardToReponseConso;
    }
    return show;
  };

  readonly showContractualDispute = (): boolean => {
    const show = this.draftReport.employeeConsumer === false && !this.showReponseConsoQuestion();
    if (!show) {
      delete this.draftReport.contractualDispute;
    }
    return show;
  };

  readonly anomaly$ = this.activatedRoute.url.pipe(
    map(url => url[0].path),
    distinctUntilChanged(),
    map(path => {
      const anomaly = this.anomalyService.getAnomalyBy(_ => _.path === path);
      if (anomaly) {
        return anomaly;
      } else {
        throw new Error(`[SignalConso] Anomaly '${path}' does not exists`);
      }
    }),
  );

  readonly selectedCategoriesSubject = new BehaviorSubject<Subcategory[]>([]);

  readonly selectedCategories$ = this.selectedCategoriesSubject.asObservable().pipe(distinctUntilChanged());

  readonly selectedTitles$ = this.selectedCategories$.pipe(map(subcategories => subcategories.map(_ => _.title)));

  readonly lastSelectedCategories: Observable<Subcategory | undefined> = this.selectedCategories$.pipe(map(_ => _[_.length - 1]));

  readonly isLastCategories$ = this.lastSelectedCategories.pipe(map(_ => _ && !_.subcategories));

  readonly showEmployeeConsumer$ = this.lastSelectedCategories.pipe(map(_ => _ && !_.subcategories && !AnomalyClient.instanceOfSubcategoryInformation(_)));

  readonly getSteps: Observable<Subcategory[]> = combineLatest([this.anomaly$, this.selectedTitles$]).pipe(
    map(([anomaly, selected]) => getSubcategory(anomaly as any, selected))
  );

  readonly showContinueButton = (): Observable<boolean> => combineLatest([this.isLastCategories$, this.showEmployeeConsumer$]).pipe(
    map(([isLast, showEmployeeConsumer]) => {
      if (!isLast) {
        return false;
      }
      if (this.showReponseConsoQuestion()) {
        return this.draftReport.forwardToReponseConso !== undefined;
      }
      if (this.showContractualDispute()) {
        return this.draftReport.contractualDispute !== undefined;
      }
      if (showEmployeeConsumer) {
        return this.draftReport.employeeConsumer !== undefined;
      }
      return true;
    })
  );

  readonly onChange = (subcategories: Subcategory[], index: number, selectedValue: string) => {
    const selected = [...this.selectedCategoriesSubject.value];
    selected.length = index + 1;
    selected[index] = subcategories.find(_ => _.title === selectedValue)!;
    this.selectedCategoriesSubject.next([...selected]);

    this.draftReport.subcategories = selected;

    this.analyticsService.trackEvent(
      EventCategories.report,
      ReportEventActions.validateSubcategory,
      subcategories.map(_ => _.title)
    );
    this.analyticsService.trackEvent(
      EventCategories.report,
      ReportEventActions.contactualReport,
      this.draftReport.isContractualDispute ? 'Oui' : 'Non'
    );
  };

  readonly nextStepIfNotContractualDispute = () => {
    if (this.isContractualDispute()) {
      this.openContractualDisputeDialog();
    } else {
      this.nextStep();
    }
  };

  readonly nextStep = () => {
    this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
    this.reportRouterService.routeForward(this.step);
  };

  readonly openContractualDisputeDialog = () => {
    const ref = this.dialog.open(DialogContractualDisputeComponent, { width: '500px', });
    ref.afterClosed().subscribe(_ => _ && this.nextStep());
  };

  ngOnInit() {
  }
}

