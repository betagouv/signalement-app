import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DraftReport, isContractualDispute, Step } from '../../../model/Report';
import { distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { instanceOfSubcategoryInformation, Subcategory } from '../../../model/Anomaly';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { ProblemStep } from './problem-step.component';

const getSubcategory = (anomaly: Subcategory, path: string[]): Subcategory[] => {
  const [current, ...nextPath] = path;
  if (current) {
    if (anomaly.subcategories) {
      const pickedCategory = anomaly.subcategories.find(_ => _.title === current);
      if (pickedCategory) {
        return [pickedCategory, ...getSubcategory(pickedCategory, nextPath)];
      }
      return [];
    }
    return [];
  }
  return [];
};

@Component({
  selector: 'app-problem',
  template: `
    <app-breadcrumb [step]="step" [draftReport]="draftReport"></app-breadcrumb>
    <main role="main">
      <section class="section section-white form-like" *ngIf="draftReport">
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
            *ngIf="draftReport.employeeConsumer === false"
            title="Que souhaitez-vous faire ?"
            [selected]="draftReport.forwardToReponseConso"
            [steps]="reponseConsoStepOptions"
            (changed)="draftReport.forwardToReponseConso = $event"
          >
          </app-problem-steps>
        </ng-container>

        <ng-container *ngIf="displayContinueButton() | async">
          <button type="button" class="btn btn-lg btn-primary" (click)="nextStep()">
            Continuer
          </button>
        </ng-container>
      </section>
    </main>
  `,
  styleUrls: ['./problem2.component.scss']
})
export class Problem2Component implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object,
    private anomalyService: AnomalyService,
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

  readonly step = Step.Problem;

  readonly employeeConsumerStepOptions: ProblemStep[] = [
    { title: 'Oui', value: true },
    { title: 'Non, je n\'y travaille pas', value: false }
  ];

  readonly reponseConsoStepOptions: ProblemStep[] = [
    {
      title: 'Je souhaite signaler mon problème à l\'entreprise pour qu\'elle le corrige.',
      example: 'La répression des fraudes sera informée.',
      value: true
    },
    {
      title: 'Je souhaite contacter la répresion des fraudes pour obtenir des informations sur mon problème.',
      value: false
    }
  ];

  isContractualDispute = isContractualDispute;

  draftReport?: DraftReport;

  readonly anomaly$ = this.activatedRoute.url.pipe(
    map(url => url[0].path),
    distinctUntilChanged(),
    map(path => {
      const anomaly = this.anomalyService.getAnomalyBy(_ => _.path === path);
      if (anomaly) {
        return anomaly;
      } else {
        throw new Error(`[SignalConso] Anomaly ${path} does not exists`);
      }
    }),
  );
  readonly selectedCategoriesSubject = new BehaviorSubject<Subcategory[]>([]);
  readonly selectedCategories$ = this.selectedCategoriesSubject.asObservable().pipe(distinctUntilChanged());
  readonly selectedTitles$ = this.selectedCategories$.pipe(map(subcategories => subcategories.map(_ => _.title)));
  readonly lastSelectedCategories: Observable<Subcategory | undefined> = this.selectedCategories$.pipe(map(_ => _[_.length - 1]));

  readonly isLastCategories$ = this.lastSelectedCategories.pipe(map(_ => _ && !_.subcategories));

  readonly showEmployeeConsumer$ = this.lastSelectedCategories.pipe(map(_ => _ && !_.subcategories && !instanceOfSubcategoryInformation(_)));

  readonly getSteps: Observable<Subcategory[]> = combineLatest([this.anomaly$, this.selectedTitles$]).pipe(
    map(([anomaly, selected]) => getSubcategory(anomaly as any, selected))
  );

  readonly displayContinueButton = (): Observable<boolean> => {
    if (this.draftReport.forwardToReponseConso !== undefined) {
      return of(true);
    }
    if (this.draftReport.employeeConsumer === true) {
      return of(true);
    }
    return combineLatest([this.isLastCategories$, this.showEmployeeConsumer$]).pipe(
      map(([isLast, showEmployeeConsumer]) => isLast && !showEmployeeConsumer)
    );
  };

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

  readonly nextStep = () => {
    this.reportStorageService.changeReportInProgressFromStep(this.draftReport, this.step);
    this.reportRouterService.routeForward(this.step);
  };

  ngOnInit() {
  }
}

