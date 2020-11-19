import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUploaderService } from '../../../../services/file-uploader.service';
import { UploadedFile } from '../../../../model/UploadedFile';
import { DetailInputValue, Report } from '../../../../model/Report';
import { Roles } from '../../../../model/AuthUser';
import { ReportingDateLabel } from '../../../../model/Anomaly';
import { PageEvent } from '@angular/material/paginator';
import { PaginatedData } from '../../../../model/PaginatedData';

@Component({
  selector: 'app-report-list-datatable',
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="reports.entities">

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Entreprise</th>
          <td mat-cell *matCellDef="let _" [matTooltip]="_.company.address" class="pt-0 pb-0">
            <span class="td-name_label">{{_.company.name}}</span><br/>
            <span *ngIf="_.website" class="td-name_website">{{_.website.hostname}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="postalCode">
          <th mat-header-cell *matHeaderCellDef>CP</th>
          <td mat-cell *matCellDef="let _">
            <span>{{_.company.postalCode | slice : 0 : 2}}</span><!--
            --><span class="txt-disabled">{{_.company.postalCode | slice : 2 : 5}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="siret">
          <th mat-header-cell *matHeaderCellDef>SIRET</th>
          <td mat-cell *matCellDef="let _">{{_.company.siret}}</td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef>Problème</th>
          <td mat-cell *matCellDef="let _">
            <div [tooltip]="subcategoriesTooltip" class="text-truncate td-category">
              {{_.category}}
            </div>
            <ng-template #subcategoriesTooltip>
              {{_.category}}
              <br/>
              <span *ngFor="let subcategory of _.subcategories">
                {{subcategory}}
                <br/>
              </span>
            </ng-template>
          </td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let _" class="pt-0 pb-0">
            <span [tooltip]="detailsTooltip">
              <ng-container *ngIf="getDetailContent(_.detailInputValues); let detail">
                {{detail.firstLine}}...<br/>
                {{detail.secondLine}}
              </ng-container>
            </span>
            <ng-template #detailsTooltip>
              <ng-container *ngFor="let detailInputValue of _.detailInputValues">
                <span class="font-weight-bold" [innerHTML]="detailInputValue.label"></span>
                &nbsp;
                <span class="mb-2" [innerHTML]="detailInputValue.value"></span>
                <br/>
              </ng-container>
            </ng-template>
          </td>
        </ng-container>

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date du constat</th>
          <td mat-cell *matCellDef="let _">{{getReportingDate(_)}}</td>
        </ng-container>

        <ng-container matColumnDef="createdDate">
          <th mat-header-cell *matHeaderCellDef>Date de création</th>
          <td mat-cell *matCellDef="let _">{{_.creationDate  | date : 'dd/MM/yyyy'}}</td>
        </ng-container>

        <ng-container matColumnDef="consumer">
          <th mat-header-cell *matHeaderCellDef>Consommateur</th>
          <td mat-cell *matCellDef="let _">
            <span [ngClass]="_.contactAgreement ? 'txt-success' : 'txt-error'"
                  [matTooltip]="'Accord pour contact:' + (_.contactAgreement ? 'oui' : 'non')">
              {{_.consumer.email | middleCrop: 25 }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="files">
          <th mat-header-cell *matHeaderCellDef>Pièces jointes</th>
          <td mat-cell *matCellDef="let _">
            <a *ngFor="let f of _.consumerUploadedFiles"
               [href]="getFileUrl(f)" target="_blank"
               (click)="$event.stopPropagation()"
               [matTooltip]="f.filename"
               class="txt-secondary">
              <mat-icon>insert_drive_file</mat-icon>
            </a>
            &nbsp;
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let _">
            <app-label-status [status]="_.status"></app-label-status>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions" stickyEnd>
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let _" class="text-right">
            <a mat-icon-button color="primary" [routerLink]="['/suivi-des-signalements', 'report', _.id]" target="_blank"
               (click)="$event.stopPropagation()">
              <mat-icon>open_in_new</mat-icon>
            </a>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr class="tr" mat-row *matRowDef="let _; columns: displayedColumns;" [routerLink]="['/suivi-des-signalements', 'report', _.id]"></tr>
      </table>
    </div>
    <mat-paginator (page)="onChange($event)"
                   [length]="reports.totalCount"
                   [pageSize]="pageSize"
                   [pageSizeOptions]="[5, 10, 25, 100]"></mat-paginator>
  `,
  styleUrls: ['./report-list-datatable.component.scss'],
})
export class ReportListDatatableComponent implements OnInit {

  constructor(
    private fileUploaderService: FileUploaderService,
  ) {
  }

  @Input() reports: PaginatedData<Report>;

  @Input() pageSize: number;

  @Input() userRole: Roles;

  @Output() paginationChanged: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  readonly roles = Roles;

  displayedColumns = [];

  ngOnInit() {
    this.displayedColumns = this.getRoleColumns();
  }

  private getRoleColumns = (): string[] => {
    switch (this.userRole) {
      case Roles.DGCCRF:
        return [
          'postalCode',
          'name',
          'siret',
          'category',
          'createdDate',
          'description',
          'date',
          'status',
          'files',
          'actions',
        ];
      case Roles.Admin:
        return [
          'postalCode',
          'name',
          'category',
          'createdDate',
          'description',
          'consumer',
          'status',
          'files',
          'actions',
        ];
      default:
        return [];
    }
  };

  onChange($event: PageEvent) {
    this.paginationChanged.emit($event);
  }

  getFileUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  getDetailContent(detailInputValues: DetailInputValue[]) {
    const MAX_CHAR_DETAILS = 40;

    function getLines(str: String, maxLength: Number) {
      function helper(_strings, currentLine, _nbWords) {
        if (!_strings || !_strings.length) {
          return _nbWords;
        }
        if (_nbWords >= _strings.length) {
          return _nbWords;
        } else {
          const newLine = currentLine + ' ' + _strings[_nbWords];
          if (newLine.length > maxLength) {
            return _nbWords;
          } else {
            return helper(_strings, newLine, _nbWords + 1);
          }
        }
      }

      const strings = str.split(' ');
      const nbWords = helper(str.split(' '), '', 0);

      const lines = strings.reduce((prev, curr, index) => index < nbWords
        ? { ...prev, line: prev.line + curr + ' ' }
        : { ...prev, rest: prev.rest + curr + ' ' }
        , { line: '', rest: '' });

      return { line: lines.line.trim(), rest: lines.rest.trim() };
    }

    let firstLine = '';
    let secondLine = '';
    let hasNext = false;

    if (detailInputValues && detailInputValues.length) {
      if (detailInputValues.length > 2) {
        hasNext = true;
      }

      let lines = getLines(detailInputValues[0].label + ' ' + detailInputValues[0].value, MAX_CHAR_DETAILS);
      firstLine = lines.line;

      if (lines.rest) {
        lines = getLines(lines.rest, MAX_CHAR_DETAILS);
        secondLine = lines.rest ? lines.line.slice(0, -3) + '...' : lines.line;

      } else if (detailInputValues.length > 1) {
        lines = getLines(detailInputValues[1].label + ' ' + detailInputValues[1].value, MAX_CHAR_DETAILS);
        secondLine = lines.rest ? lines.line.slice(0, -3) + '...' : lines.line;
      }

      return { firstLine, secondLine, hasNext };
    }
  }

  getReportingDate(report: Report) {
    return report.detailInputValues.filter(d => d.label.indexOf(ReportingDateLabel) !== -1).map(d => d.value);
  }
}
