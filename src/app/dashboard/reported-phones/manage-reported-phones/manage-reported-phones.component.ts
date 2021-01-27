import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ReportedPhoneService } from '../../../services/reported-phone.service';
import { ApiReportedPhoneStatus, ApiReportedPhoneWithCompany } from '../../../api-sdk/model/ApiReportedPhone';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CompanySearchResult } from '../../../model/Company';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Id } from '../../../api-sdk/model/Common';
import { Index } from '../../../model/Common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm/confirm.component';
import pages from '../../../../assets/data/pages.json';
import { Meta, Title } from '@angular/platform-browser';

interface Form {
  phone?: string;
  status?: ApiReportedPhoneStatus[];
}

@Component({
  selector: 'app-manage-reported-phones',
  templateUrl: './manage-reported-phones.component.html',
  styleUrls: ['./manage-reported-phones.component.scss']
})
export class ManageReportedPhonesComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private meta: Meta,
    public reportedPhoneService: ReportedPhoneService,
    private dialog: MatDialog
  ) {
  }

  readonly columns = [
    'phone',
    'count',
    'creationDate',
    'company',
    'status',
  ];

  form!: FormGroup;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  readonly reportedPhonesStatus = ApiReportedPhoneStatus;

  dataSource?: MatTableDataSource<ApiReportedPhoneWithCompany>;

  reportedPhonesPhoneIndex: Index<ApiReportedPhoneWithCompany[]> = {};

  ngOnInit(): void {
    this.titleService.setTitle(pages.reportedPhones.manage.title);
    this.meta.updateTag({ name: 'description', content: pages.reportedPhones.manage.description });
    this.initForm();
    this.fetchReportedPhones();
  }

  private initForm = (): void => {
    this.form = this.fb.group({
      phone: '',
      status: [['']],
    });
  };

  private fetchReportedPhones = (): void => {
    combineLatest([
      this.reportedPhoneService.list({ clean: false }),
      this.form.valueChanges.pipe(startWith(undefined))
    ]).pipe(
      map(this.filterReportedPhones),
      map(this.initializeDatatable),
      map(this.initIndex),
    ).subscribe();
  };

  private filterReportedPhones = ([reportedPhones, dontUseBecauseUndefined]: [ApiReportedPhoneWithCompany[], Form | undefined]): ApiReportedPhoneWithCompany[] => {
    const form: Form = this.form.value;
    const isStatusSelected = (form?.status && form?.status.filter((_: string) => _ !== '').length > 0);
    const status = isStatusSelected ? form.status! : [ApiReportedPhoneStatus.PENDING, ApiReportedPhoneStatus.VALIDATED];
    return reportedPhones
      ?.filter(_ => status.includes(_.status))
      .filter(_ => !form?.phone || _.phone.includes(form.phone));
  };

  private initializeDatatable = (reportedPhones: ApiReportedPhoneWithCompany[]): ApiReportedPhoneWithCompany[] => {
    this.dataSource = new MatTableDataSource(reportedPhones);
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
    return reportedPhones;
  };

  private initIndex = (reportedPhones: ApiReportedPhoneWithCompany[]) => {
    this.reportedPhonesPhoneIndex = reportedPhones.reduce(
      (acc: Index<ApiReportedPhoneWithCompany[]>, reportedPhone) => ({
        ...acc,
        [reportedPhone.phone]: (acc[reportedPhone.phone] ? [...acc[reportedPhone.phone], reportedPhone] : [reportedPhone])
      }),
      {}
    );
    return reportedPhones;
  };

  getAlreadyValidatedReportedPhone = (phone: string): ApiReportedPhoneWithCompany | undefined => {
    return this.reportedPhonesPhoneIndex[phone]?.find(_ => _.status === ApiReportedPhoneStatus.VALIDATED);
  };

  toggleReportedPhoneStatus = (reportedPhone: ApiReportedPhoneWithCompany): void => {
    const toggle = () => {
      const toggledStatus = (reportedPhone.status === ApiReportedPhoneStatus.VALIDATED) ? ApiReportedPhoneStatus.PENDING : ApiReportedPhoneStatus.VALIDATED;
      this.reportedPhoneService.update(reportedPhone.id, { status: toggledStatus }).subscribe(this.fetchReportedPhones);
    };
    const alreadyValidated = this.getAlreadyValidatedReportedPhone(reportedPhone.phone);
    if (reportedPhone.status === ApiReportedPhoneStatus.PENDING && !!alreadyValidated) {
      this.openDialog(alreadyValidated, reportedPhone).subscribe(toggle);
    } else {
      toggle();
    }
  };

  private openDialog = (oldReportedPhone: ApiReportedPhoneWithCompany, newReportedPhone: ApiReportedPhoneWithCompany): Observable<void> => {
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '440px', }).componentInstance;
    ref.title = 'Remplacer le numéro de téléphone assigné ?';
    ref.content = `
      L'entreprise <b>${oldReportedPhone.company.name}</b> est déjà assignée au numéro de téléphone <b>${newReportedPhone.phone}</b>.<br/>
      L'entreprise <b>${newReportedPhone.company.name}</b> sera assignée à la place.
    `;
    ref.confirmed = new EventEmitter<void>();
    return ref.confirmed;
  };

  updateCompany = (reportedPhone: ApiReportedPhoneWithCompany, $event: CompanySearchResult): void => {
    if ($event.siret === reportedPhone.company.siret) {
      if (reportedPhone.status !== ApiReportedPhoneStatus.VALIDATED) {
        this.reportedPhoneService.update(reportedPhone.id, { status: ApiReportedPhoneStatus.VALIDATED }).subscribe(this.fetchReportedPhones);
      }
    } else {
      this.reportedPhoneService.updateCompany(reportedPhone.id, {
        companyName: $event.name!,
        companyAddress: $event.address,
        companyPostalCode: $event.postalCode,
        companySiret: $event.siret!,
        companyActivityCode: $event.activityCode,
      }).subscribe(this.fetchReportedPhones/* We want to refresh reports count */);
    }
  };

  remove = (id: Id) => this.reportedPhoneService.remove(id).subscribe();
}
