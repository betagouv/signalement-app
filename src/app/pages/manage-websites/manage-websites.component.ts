import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from '../../services/website.service';
import { ApiWebsite, ApiWebsiteKind, ApiWebsiteWithCompany } from '../../api-sdk/model/ApiWebsite';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BtnState } from '../../components/btn/btn.component';
import { MatSelectChange } from '@angular/material/select';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Index } from '../../model/Common';

export interface WebsiteWithCompanies {
  host: string;
  companies: ApiWebsiteWithCompany[];
}

const groupByHost = (websites: ApiWebsiteWithCompany[]): Index<ApiWebsiteWithCompany[]> => websites
  .filter(_ => [ApiWebsiteKind.PENDING, ApiWebsiteKind.DEFAULT].includes(_.kind))
  .reduce((acc: any, _) => ({ ...acc, [_.host]: acc[_.host] ? [_, ...acc[_.host]] : [_] }), {});

const indexToArray = (websitesIndex: Index<ApiWebsiteWithCompany[]>): WebsiteWithCompanies[] => {
  return Object.entries(websitesIndex).map(([_, companies]: any) => ({ host: _, companies }));
};

@Component({
  selector: 'app-manage-websites',
  template: `
    <app-banner title="Modération des site webs"></app-banner>

    <button mat-stroked-button></button>
    <app-page>
      <app-panel [loading]="websiteService.fetching">
        <div *ngIf="fetchWebsites | async; let websites" class="card-container">
          <app-manage-websites-card *ngFor="let _ of websites" [website]="_"></app-manage-websites-card>
        </div>
      </app-panel>

      <!--      <app-panel [loading]="websiteService.fetching">-->
      <!--        <app-panel-header>-->
      <!--          <mat-select placeholder="Statut" class="select-status form-control form-control-material" multiple-->
      <!--                      (selectionChange)="applyFilter($event)">-->
      <!--            <mat-option [value]="websitesKind.DEFAULT">Validé</mat-option>-->
      <!--            <mat-option [value]="websitesKind.PENDING">Non Validé</mat-option>-->
      <!--          </mat-select>-->
      <!--        </app-panel-header>-->


      <!--        <table mat-table [dataSource]="dataSource" class="fullwidth" matSort matSortActive="host" matSortDirection="desc">-->
      <!--          <ng-container matColumnDef="creationDate">-->
      <!--            <th mat-sort-header mat-header-cell *matHeaderCellDef>Date</th>-->
      <!--            <td mat-cell *matCellDef="let _">-->
      <!--              {{_.creationDate | date}}-->
      <!--            </td>-->
      <!--          </ng-container>-->

      <!--          <ng-container matColumnDef="host">-->
      <!--            <th mat-sort-header mat-header-cell *matHeaderCellDef>Host</th>-->
      <!--            <td mat-cell *matCellDef="let _">-->
      <!--              <a target="_blank" href="http://{{_.host}}">{{_.host}}</a>-->
      <!--            </td>-->
      <!--          </ng-container>-->

      <!--          <ng-container matColumnDef="kind">-->
      <!--            <th mat-sort-header mat-header-cell *matHeaderCellDef></th>-->
      <!--            <td mat-cell *matCellDef="let _" class="text-right">-->
      <!--              <button app-btn [state]="getButtonState(_)" icon="check_circle_outline" (click)="toggleWebsiteKind(_.id, _.kind)">-->
      <!--                {{_.kind === websitesKind.DEFAULT ? 'Validé' : 'Valider'}}-->
      <!--              </button>-->
      <!--            </td>-->
      <!--          </ng-container>-->

      <!--          <ng-container matColumnDef="company">-->
      <!--            <th mat-sort-header mat-header-cell *matHeaderCellDef>Entreprise</th>-->
      <!--            <td mat-cell *matCellDef="let _">-->
      <!--              <button app-btn icon="edit" appCompanySearchDialog>-->
      <!--                <span class="font-weight-bold">{{_.company?.name}}</span>-->
      <!--                &nbsp;-->
      <!--                <span class="siret">{{_.company?.siret}}</span>-->
      <!--              </button>-->
      <!--            </td>-->
      <!--          </ng-container>-->

      <!--          <tr mat-header-row *matHeaderRowDef="columns"></tr>-->
      <!--          <tr mat-row *matRowDef="let row; columns: columns;"></tr>-->
      <!--        </table>-->
      <!--        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" pageSize="25"></mat-paginator>-->
      <!--      </app-panel>-->
    </app-page>
  `,
  styleUrls: ['./manage-websites.component.scss']
})
export class ManageWebsitesComponent implements OnInit {

  constructor(
    public websiteService: WebsiteService,
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

  readonly websitesKind = ApiWebsiteKind;

  dataSource: MatTableDataSource<ApiWebsiteWithCompany>;

  ngOnInit(): void {
    // this.fetchWebsites().subscribe(console.log);
  }

  fetchWebsites: Observable<WebsiteWithCompanies[]> = this.websiteService.list().pipe(
    map(groupByHost),
    map(indexToArray),
  );

  private fetchWebsites2 = (): void => {
    this.websiteService.list().subscribe(websites => {
      this.dataSource = new MatTableDataSource(websites.filter(_ => [ApiWebsiteKind.PENDING, ApiWebsiteKind.DEFAULT].includes(_.kind)));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // @ts-ignore Typing issue from Angular that do not expect filter to be different than a string
      this.dataSource.filterPredicate = (data: ApiWebsiteWithCompany, filter: ApiWebsiteKind[]) => filter.includes(data.kind);
    }, err => {
      console.error(err);
    });
  };

  applyFilter = (event: MatSelectChange): void => {
    this.dataSource.filter = event.value;
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
  };
}
