import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from '../../services/website.service';
import { ApiWebsite, ApiWebsiteKind, ApiWebsiteWithCompany } from '../../api-sdk/model/ApiWebsite';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BtnState } from '../../components/btn/btn.component';
import { CompanySearchResult } from '../../model/Company';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Id } from '../../api-sdk/model/Common';

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
            <th mat-sort-header mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let _">
              {{_.creationDate | date}}
            </td>
          </ng-container>

          <ng-container matColumnDef="host">
            <th mat-sort-header mat-header-cell *matHeaderCellDef>Host</th>
            <td mat-cell *matCellDef="let _">
              <a target="_blank" href="http://{{_.host}}">{{_.host}}</a>
            </td>
          </ng-container>

          <ng-container matColumnDef="kind">
            <th mat-sort-header mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let _" class="text-right">
              <button app-btn [state]="getButtonState(_)" icon="check_circle_outline" (click)="toggleWebsiteKind(_.id, _.kind)">
                {{_.kind === websitesKind.DEFAULT ? 'Validé' : 'Valider'}}
              </button>

              <button mat-icon-button color="primary"
                      (click)="remove(_.id)"
                      [appLoading]="websiteService.removing(_.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="company">
            <th mat-sort-header mat-header-cell *matHeaderCellDef>Entreprise</th>
            <td mat-cell *matCellDef="let _">
              <button app-btn icon="edit" appCompanySearchDialog (companySelected)="updateCompany(_, $event)">
                <span class="font-weight-bold">{{_.company?.name}}</span>
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
      this.websiteService.list(),
      this.form.valueChanges.pipe(startWith(undefined)),
    ]).pipe(
      map(this.filterWebsites),
      map(this.initializeDatatable)
    ).subscribe();
  };

  private filterWebsites = ([websites, form]: [ApiWebsiteWithCompany[], Form]): ApiWebsiteWithCompany[] => {
    const isKindSelected = (form?.kind && form?.kind.filter((_: string) => _ !== '').length > 0);
    const kinds = isKindSelected ? form.kind! : [ApiWebsiteKind.PENDING, ApiWebsiteKind.DEFAULT];
    return websites
      .filter(_ => kinds.includes(_.kind))
      .filter(_ => !form?.host || _.host.includes(form.host));
  }

  private initializeDatatable = (websites: ApiWebsiteWithCompany[]): void => {
    this.dataSource = new MatTableDataSource(websites);
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  };

  toggleWebsiteKind = (id: string, kind: ApiWebsiteKind): void => {
    const toggledKind = (kind === ApiWebsiteKind.DEFAULT) ? ApiWebsiteKind.PENDING : ApiWebsiteKind.DEFAULT;
    this.websiteService.update(id, { kind: toggledKind }).subscribe();
  };

  getButtonState = (website: ApiWebsite): BtnState => {
    if (this.websiteService.updating(website.id)) {
      return 'loading';
    }
    if (this.websiteService.updateError(website.id)) {
      return 'error';
    }
    if (website.kind === ApiWebsiteKind.DEFAULT) {
      return 'success';
    }
    return 'default';
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
