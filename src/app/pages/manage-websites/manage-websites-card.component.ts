import { Component, Input } from '@angular/core';
import { WebsiteWithCompanies } from './manage-websites.component';
import { ApiWebsiteKind, ApiWebsiteWithCompany } from '../../api-sdk/model/ApiWebsite';
import { BtnState } from '../../components/btn/btn.component';
import { WebsiteService } from '../../services/website.service';
import { Id } from '../../api-sdk/model/Common';
import { CompanySearchResult } from '../../model/Company';

@Component({
  selector: 'app-manage-websites-card',
  template: `
    <a target="_blank" href="http://{{website.host}}" class="host">
      {{website.host}}
    </a>
    <div>
      <div class="validated-company">
        <button *ngFor="let _ of validatedCompanies()" app-btn dense [state]="getButtonState(_)" (click)="toggleWebsiteKind(_)">
          <span class="font-weight-bold">{{_.company.name}}</span>&nbsp;
          <span class="manage-websites_siret">{{_.company.siret}}</span>
        </button>
        <button app-btn dense icon="add"
                [appLoading]="websiteService.creating"
                appCompanySearchDialog
                (companySelected)="addCompany($event)"></button>
      </div>

      <div class="manage-websites_title">Suggérés</div>

      <div>
        <button *ngFor="let _ of pendingCompanies()" app-btn dense
                [state]="getButtonState(_)"
                (click)="toggleWebsiteKind(_)">
          <span class="font-weight-bold">{{_.company.name}}</span>&nbsp;
          <span class="manage-websites_siret">{{_.company.siret}}</span>

          <mat-icon appConfirm (confirmed)="delete(_.id)"
                    [appLoading]="websiteService.deleting(_.id)"
                    (click)="$event.stopPropagation()" class="delete-btn"
                    content="Supprimer l'association ?">
            cancel
          </mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./manage-websites-card.component.scss']
})
export class ManageWebsitesCardComponent {

  constructor(
    public websiteService: WebsiteService,
  ) {
  }

  @Input() website: WebsiteWithCompanies;

  readonly validatedCompanies = () => this.website.companies.filter(_ => _.kind === ApiWebsiteKind.DEFAULT);
  readonly pendingCompanies = () => this.website.companies.filter(_ => _.kind === ApiWebsiteKind.PENDING);

  getButtonState = (website: ApiWebsiteWithCompany): BtnState => {
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

  toggleWebsiteKind = (website: ApiWebsiteWithCompany): void => {
    const toggledKind = (website.kind === ApiWebsiteKind.DEFAULT) ? ApiWebsiteKind.PENDING : ApiWebsiteKind.DEFAULT;
    this.websiteService.update(website.id, { kind: toggledKind }).subscribe();
  };

  delete = (id: Id): void => {
    this.websiteService.remove(id).subscribe();
  };

  addCompany = ($event: CompanySearchResult): void => {
    this.websiteService.create({
      host: this.website.host,
      companyName: $event.name,
      companyAddress: $event.address,
      companyPostalCode: $event.postalCode,
      companySiret: $event.siret,
      companyActivityCode: $event.activityCode,
    }).subscribe();
  };
}
