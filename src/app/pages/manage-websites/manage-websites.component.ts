import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from '../../services/website.service';
import { ApiWebsiteKind, ApiWebsiteWithCompany } from '../../api-sdk/model/ApiWebsite';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CompanySearchResult } from '../../model/Company';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Id } from '../../api-sdk/model/Common';
import { Index } from '../../model/Common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm/confirm.component';

interface Form {
  host?: string;
  kind?: ApiWebsiteKind[];
}

@Component({
  selector: 'app-manage-websites',
  template: `
    <app-banner title="Modération des site webs"></app-banner>

    <app-page>
      <app-panel [loading]="websiteService.fetching" [formGroup]="form">
        <app-panel-header>
          <input
            class="form-control form-control-material"
            formControlName="host"
            placeholder="Host"
          />
          &nbsp;&nbsp;
          <mat-select placeholder="Statut" class="select-status form-control form-control-material" multiple
                      formControlName="kind">
            <mat-option [value]="websitesKind.DEFAULT">Validé</mat-option>
            <mat-option [value]="websitesKind.PENDING">Non Validé</mat-option>
          </mat-select>
        </app-panel-header>


        <table mat-table [dataSource]="dataSource" class="fullwidth" matSort matSortActive="creationDate" matSortDirection="desc">
          <ng-container matColumnDef="creationDate">
            <th mat-sort-header mat-header-cell *matHeaderCellDef class="td-date">Date</th>
            <td mat-cell *matCellDef="let _" class="td-date">
              {{_.creationDate | date}}
            </td>
          </ng-container>

          <ng-container matColumnDef="host">
            <th class="td-host" mat-sort-header mat-header-cell *matHeaderCellDef>Host</th>
            <td class="td-host" mat-cell *matCellDef="let _">
              <a target="_blank" href="http://{{_.host}}">{{_.host}}</a>
            </td>
          </ng-container>

          <ng-container matColumnDef="kind">
            <th mat-sort-header mat-header-cell *matHeaderCellDef class="td-actions"></th>
            <td mat-cell *matCellDef="let _" class="td-actions">
              <button
                class="align-middle"
                app-btn icon="check_circle_outline"
                [loading]="this.websiteService.updating(_.id)"
                [error]="this.websiteService.updateError(_.id)"
                [success]="_.kind === websitesKind.DEFAULT"
                (click)="toggleWebsiteKind(_)">
                {{_.kind === websitesKind.DEFAULT ? 'Validé' : 'Valider'}}
              </button>

              <button mat-icon-button color="primary" class="align-middle"
                      (click)="remove(_.id)"
                      [appLoading]="websiteService.removing(_.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="company">
            <th mat-sort-header mat-header-cell *matHeaderCellDef>Entreprise</th>
            <td mat-cell *matCellDef="let _">
              <button
                app-btn icon="edit"
                [loading]="websiteService.updatingCompany(_.id)"
                [error]="!!websiteService.updateCompanyError(_.id)"
                [matTooltip]="websiteService.updateCompanyError(_.id) && 'L\\'entreprise est déjà associée à cette URL'"
                appCompanySearchDialog (companySelected)="updateCompany(_, $event)"
              >
                <span class="company-name">{{_.company?.name}}</span>
                &nbsp;
                <span class="siret">{{_.company?.siret}}</span>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" pageSize="25"></mat-paginator>
      </app-panel>
    </app-page>
  `,
  styleUrls: ['./manage-websites.component.scss']
})
export class ManageWebsitesComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public websiteService: WebsiteService,
    private dialog: MatDialog
  ) {
  }

  readonly columns = [
    'host',
    'creationDate',
    'company',
    'kind',
  ];

  form!: FormGroup;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  readonly websitesKind = ApiWebsiteKind;

  dataSource?: MatTableDataSource<ApiWebsiteWithCompany>;

  websitesHostIndex: Index<ApiWebsiteWithCompany[]> = {};

  ngOnInit(): void {
    this.initForm();
    this.fetchWebsites();
  }

  private initForm = (): void => {
    this.form = this.fb.group({
      host: '',
      kind: [['']],
    });
  };

  private fetchWebsites = (): void => {
    combineLatest([
      this.websiteService.list({ clean: false }),
      this.form.valueChanges.pipe(startWith(undefined)),
    ]).pipe(
      map(this.filterWebsites),
      map(this.initializeDatatable),
      map(this.initIndex),
    ).subscribe();
  };

  private filterWebsites = ([websites, form]: [ApiWebsiteWithCompany[], Form]): ApiWebsiteWithCompany[] => {
    const isKindSelected = (form?.kind && form?.kind.filter((_: string) => _ !== '').length > 0);
    const kinds = isKindSelected ? form.kind! : [ApiWebsiteKind.PENDING, ApiWebsiteKind.DEFAULT];
    return websites
      ?.filter(_ => kinds.includes(_.kind))
      .filter(_ => !form?.host || _.host.includes(form.host));
  }

  private initializeDatatable = (websites: ApiWebsiteWithCompany[]): ApiWebsiteWithCompany[] => {
    this.dataSource = new MatTableDataSource(websites);
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
    return websites;
  };

  private initIndex = (websites: ApiWebsiteWithCompany[]) => {
    this.websitesHostIndex = websites.reduce(
      (acc: Index<ApiWebsiteWithCompany[]>, website) => ({
        ...acc,
        [website.host]: (acc[website.host] ? [...acc[website.host], website] : [website])
      }),
      {}
    );
  };

  getAlreadyValidatedWebsite = (host: string): ApiWebsiteWithCompany | undefined => {
    return this.websitesHostIndex[host]?.find(_ => _.kind === ApiWebsiteKind.DEFAULT);
  };

  toggleWebsiteKind = (website: ApiWebsiteWithCompany): void => {
    const toggle = () => {
      const toggledKind = (website.kind === ApiWebsiteKind.DEFAULT) ? ApiWebsiteKind.PENDING : ApiWebsiteKind.DEFAULT;
      this.websiteService.update(website.id, { kind: toggledKind }).subscribe(this.fetchWebsites);
    };
    const alreadyValidated = this.getAlreadyValidatedWebsite(website.host);
    if (website.kind === ApiWebsiteKind.PENDING && !!alreadyValidated) {
      this.openDialog(alreadyValidated, website).subscribe(toggle);
    } else {
      toggle();
    }
  };

  private openDialog = (oldWebsite: ApiWebsiteWithCompany, newWebsite: ApiWebsiteWithCompany): Observable<void> => {
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '440px', }).componentInstance;
    ref.title = 'Remplacer le site web assigné ?';
    ref.content = `
      L'entreprise <b>${oldWebsite.company.name}</b> est déjà assginée au site <b>${newWebsite.host}</b>.<br/>
      L'entreprise <b>${newWebsite.company.name}</b> sera assignée à la place.
    `;
    ref.confirmed = new EventEmitter<void>();
    return ref.confirmed;
  };

  updateCompany = (website: ApiWebsiteWithCompany, $event: CompanySearchResult): void => {
    this.websiteService.updateCompany(website.id, {
      companyName: $event.name!,
      companyAddress: $event.address,
      companyPostalCode: $event.postalCode,
      companySiret: $event.siret!,
      companyActivityCode: $event.activityCode,
    }).subscribe();
  };

  remove = (id: Id) => this.websiteService.remove(id).subscribe();
}
