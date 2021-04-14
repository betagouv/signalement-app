import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DraftReport, isContractualDispute, Step } from '../../../model/Report';
import { distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { AnalyticsService, EventCategories, ReportEventActions } from '../../../services/analytics.service';
import { AnomalyService } from '../../../services/anomaly.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { ReportRouterService } from '../../../services/report-router.service';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { instanceOfSubcategoryInformation, Subcategory, SubcategoryBase } from '../../../model/Anomaly';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { ProblemStep } from './problem-step.component';

const buildSteps = (categories: SubcategoryBase[], selected: string[]): SubcategoryBase[][] => {
  const [choice, ...nextChoices] = selected;
  const selectedSubcategories = categories.find(_ => _.title === choice?.trim())?.subcategories;
  const currentCategories = categories.map(_ => {
    return _;
    // const { subcategories, ...category } = _;
    // return category;
  });
  if (selectedSubcategories) {
    return [currentCategories, ...buildSteps(selectedSubcategories, nextChoices)];
  }
  return [currentCategories];
};

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
          <button type="button" class="btn btn-lg btn-primary">
            Continuer
          </button>
        </ng-container>
      </section>
    </main>
  `,
  styleUrls: ['./problem2.component.scss']
})
export class Problem2Component implements OnInit {

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

  // (): Observable<boolean> => {
  //   if (this.draftReport.forwardToReponseConso !== undefined) {
  //     return of(true);
  //   }
  //   if (this.draftReport.employeeConsumer === true) {
  //     return of(true);
  //   }
  // };

  readonly step = Step.Problem;

  draftReport?: DraftReport;

  readonly selectedSubject = new BehaviorSubject<Subcategory[]>([]);

  readonly selected$ = this.selectedSubject.asObservable().pipe(distinctUntilChanged());
  readonly selectedTitles$ = this.selected$.pipe(map(subcategories => subcategories.map(_ => _.title)));
  readonly lastSelectedSubcategories: Observable<Subcategory | undefined> = this.selected$.pipe(map(_ => _[_.length - 1]));
  readonly isLastSubcategories$ = this.lastSelectedSubcategories.pipe(map(_ => _ && !_.subcategories));
  readonly showEmployeeConsumer$ = this.lastSelectedSubcategories.pipe(map(_ => {
    console.log(instanceOfSubcategoryInformation(_), _);
    return _ && !_.subcategories && !instanceOfSubcategoryInformation(_);
  }));
  // readonly isLastSubcategories$ = this.selected$.pipe(map(_ => _.length > 0 && !_[_.length - 1]?.subcategories));

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
    return combineLatest([this.isLastSubcategories$, this.showEmployeeConsumer$]).pipe(
      map(([isLast, showEmployeeConsumer]) => isLast && !showEmployeeConsumer)
    );
  };

  readonly onChange = (subcategories: Subcategory[], index: number, selectedValue: string) => {
    const selected = [...this.selectedSubject.value];
    selected.length = index + 1;
    selected[index] = subcategories.find(_ => _.title === selectedValue)!;
    this.selectedSubject.next([...selected]);
  };

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
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  ngOnInit() {
  }
}

