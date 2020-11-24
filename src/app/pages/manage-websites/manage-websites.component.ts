import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from '../../services/website.service';
import { Website, WebsiteKind, WebsiteWithCompany } from '../../model/Website';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BtnState } from '../../components/btn/btn.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-manage-websites',
  template: `
    <app-banner title="Modération des site webs"></app-banner>

    <app-page>
      <app-panel [loading]="fetching">
        <app-panel-header>
          <mat-select placeholder="Statut" class="select-status form-control form-control-material" multiple
                      (selectionChange)="applyFilter($event)">
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
            </td>
          </ng-container>

          <ng-container matColumnDef="company">
            <th mat-sort-header mat-header-cell *matHeaderCellDef>Entreprise</th>
            <td mat-cell *matCellDef="let _">
              <button app-btn icon="edit" appCompanySearchDialog>
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
    private websiteService: WebsiteService,
  ) {
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  readonly columns = [
    'host',
    'creationDate',
    'company',
    'kind',
  ];

  readonly websitesKind = WebsiteKind;

  dataSource: MatTableDataSource<WebsiteWithCompany>;

  fetching = false;

  readonly updading = new Set<string>();
  readonly errors = new Set<string>();

  ngOnInit(): void {
    this.fetchWebsites();
  }

  private fetchWebsites = (): void => {
    this.fetching = true;
    this.websiteService.list().subscribe(websites => {
      this.dataSource = new MatTableDataSource(websites.filter(_ => [WebsiteKind.PENDING, WebsiteKind.DEFAULT].includes(_.kind)));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // @ts-ignore Typing issue from Angular that do not expect filter to be different than a string
      this.dataSource.filterPredicate = (data: WebsiteWithCompany, filter: WebsiteKind[]) => filter.includes(data.kind);
    }, err => {
      console.error(err);
    }, () => {
      this.fetching = false;
    });
  };

  applyFilter = (event: MatSelectChange): void => {
    this.dataSource.filter = event.value;
  };

  toggleWebsiteKind = (id: string, kind: WebsiteKind): void => {
    this.updading.delete(id);
    this.errors.delete(id);
    this.updading.add(id);
    this.websiteService.update(id, { kind: (kind === WebsiteKind.DEFAULT) ? WebsiteKind.PENDING : WebsiteKind.DEFAULT }).subscribe(
      updatedWebsite => {
        // TODO(Alex) Should use a state manager like ngrx to handle it globally
        this.dataSource.data = this.dataSource.data.map((_: WebsiteWithCompany) => _.id === id ? updatedWebsite : _);
      },
      error => {
        console.error(error);
      },
      () => {
        this.updading.delete(id);
      });
  };

  getButtonState = (website: Website): BtnState => {
    if (this.updading.has(website.id)) {
      return 'loading';
    }
    if (this.errors.has(website.id)) {
      return 'error';
    }
    if (website.kind === WebsiteKind.DEFAULT) {
      return 'success';
    }
  };
}
