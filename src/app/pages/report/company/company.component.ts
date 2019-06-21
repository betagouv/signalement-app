import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Company, Feature } from '../../../model/Company';
import { CompanyService, UNTAKE_NATURE_ACTIVITE_LIST, UNTAKE_POI_LIST } from '../../../services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../../../services/address.service';
import { CompleterItem, RemoteData } from 'ng2-completer';
import {
  AnalyticsService,
  CompanyEventActions,
  CompanySearchEventNames,
  EventCategories,
  ReportEventActions,
} from '../../../services/analytics.service';
import { Report, Step } from '../../../model/Report';
import { ReportRouterService } from '../../../services/report-router.service';
import { ReportStorageService } from '../../../services/report-storage.service';
import { combineLatest, of } from 'rxjs';
import * as L from 'leaflet';
import { Map } from 'leaflet';
import { isPlatformBrowser } from '@angular/common';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  step: Step;
  report: Report;

  around: boolean;

  searchForm: FormGroup;
  searchCtrl: FormControl;
  searchPostalCodeCtrl: FormControl;

  companyForm: FormGroup;
  nameCtrl: FormControl;
  addressCtrl: FormControl;
  addressCtrlPostalCode: string;

  companies: Company[];
  loading: boolean;
  searchWarning: string;
  searchError: string;

  showErrors: boolean;

  addressData: RemoteData;
  companiesMap: Map;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              public formBuilder: FormBuilder,
              private reportStorageService: ReportStorageService,
              private reportRouterService: ReportRouterService,
              private companyService: CompanyService,
              private addressService: AddressService,
              private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.step = Step.Company;
    this.reportStorageService.reportInProgess.subscribe(report => {
      if (report) {
        this.report = report;
        this.initSearchForm();
      } else {
        this.reportRouterService.routeToFirstStep();
      }
    });
  }

  initSearchForm() {
    this.around = false;
    this.searchCtrl = this.formBuilder.control('', Validators.required);
    this.searchPostalCodeCtrl = this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[0-9]{5}')]));
    this.searchForm = this.formBuilder.group({
      search: this.searchCtrl,
      //searchPostalCode: this.searchPostalCodeCtrl
    });
  }

  editCompany() {
    this.showErrors = false;
    this.nameCtrl = this.formBuilder.control('', Validators.required);
    this.addressCtrl = this.formBuilder.control('', Validators.required);
    this.addressCtrlPostalCode = '';
    this.companyForm = this.formBuilder.group({
      name: this.nameCtrl,
      address: this.addressCtrl,
    });
    this.addressData = this.addressService.addressData;
  }

  initSearch() {
    this.companyForm = null;
    this.companies = [];
    this.searchWarning = '';
    this.searchError = '';
  }

  isAround() {
    this.around = true;
    this.showErrors = false;
    this.initSearch();

  }

  isNotAround() {
    this.around = false;
    this.showErrors = false;
    this.initSearch();
  }

  searchCompany() {
    if (this.around) {
      this.showErrors = false;
      this.initSearch();
      this.loading = true;
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.around);
          this.companyService.getNearbyCompanies(lat, long).subscribe(
            companySearchResult => {
              this.loading = false;
              if (companySearchResult.total === 0) {
                this.treatCaseNoResult();
              } else if (companySearchResult.total === 1) {
                this.treatCaseSingleResult(companySearchResult.companies);
              } else {
                this.treatCaseSeveralResults(companySearchResult.companies);
              }
            },
            error => {
              this.loading = false;
              this.treatCaseError();
            }
          );
        }, (error) => {
           this.loading = false;
           this.showErrors = true;
        }, options);
      } else {
        this.loading = false;
        this.showErrors = true;
      }
    } else {
      if (!this.searchForm.valid) {
        this.showErrors = true;
      } else {
        this.initSearch();
        this.loading = true;
        let companiesFound: Company[] = [];
        this.analyticsService.trackEvent(
          EventCategories.company,
          CompanyEventActions.search,
          this.searchCtrl.value + ' ' + this.searchPostalCodeCtrl.value
        );
        this.companyService.searchCompanies(this.searchCtrl.value, this.searchPostalCodeCtrl.value)
          .pipe(
            switchMap( companySearchResult => {
              if (companySearchResult.total > 0) {
                companiesFound = companySearchResult.companies;
              }
              return this.companyService.searchCompaniesFromAddok(this.searchCtrl.value);
            })
          )
          .subscribe(
          companySearchResult => {

            const features = companySearchResult.features.filter(feature => {
              return feature.properties && ! UNTAKE_POI_LIST.includes(feature.properties.poi) && feature.properties.score >= 0.66;
            });

            if (features.length) {
              this.addNearbyCompaniesFromFeatures(companiesFound, features, 0.015)
                .subscribe(
                  companies => {
                  this.loading = false;

                    if (!companies.length) {
                      this.treatCaseNoResult();
                    } else if (companies.length === 1) {
                      this.treatCaseSingleResult(companies);
                    } else {
                      this.treatCaseSeveralResults(companies);
                    }
                  },
                  error => {
                    this.loading = false;
                    this.treatCaseError();
                  }
                );
            } else {
              this.loading = false;
              if (!companiesFound.length) {
                this.treatCaseNoResult();
              } else if (companiesFound.length === 1) {
                this.treatCaseSingleResult(companiesFound);
              } else {
                this.treatCaseSeveralResults(companiesFound);
              }
            }
          },
          error => {
            this.loading = false;
            this.treatCaseError();
          }
        );
       }
    }
  }

  addNearbyCompaniesFromFeatures(companies: Company[], features: Feature[], radius: number) {
    return combineLatest(
      features.map(feature => {
        return this.companyService.getNearbyCompanies(feature.geometry.coordinates[1], feature.geometry.coordinates[0], radius);
      })
    ).pipe(
      switchMap(
        companySearchResults => {
          companies = [...companies, ...companySearchResults
            .reduce((acc, curr) => curr.companies ? [...acc, ...curr.companies.filter(company => !acc.find(c1 => c1.siret === company.siret))] : acc, [])
            .filter((c: Company) => !UNTAKE_NATURE_ACTIVITE_LIST.includes(c.natureActivite))
            .filter((c: Company) => !companies.find(c1 => c1.siret === c.siret))];

          if (companies.length < 10) {
            return this.addNearbyCompaniesFromFeatures(companies, features, radius * 2);
          } else {
            return of(companies);
          }
        }
      )
    );
  }

  treatCaseNoResult() {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.noResult);
    this.searchWarning = 'Aucun établissement ne correspond à la recherche.';
  }

  treatCaseSingleResult(companies: Company[]) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.singleResult);
    this.companies = companies;
  }

  treatCaseTooManyResults() {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.tooManyResults);
    this.searchWarning = 'Il y a trop d\'établissement correspondant à la recherche.';
  }

  treatCaseSeveralResults(companies: Company[]) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.severalResult);
    this.companies = companies;
  }

  displayCompaniesMap() {

    if (isPlatformBrowser(this.platformId)) {
      if (this.companiesMap) {
        this.companiesMap.remove();
      }
      if (this.companies) {
        this.companiesMap = L.map('companiesMap').setView([this.companies[0].latitude, this.companies[0].longitude], 20);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: 'Carte des entreprises'
        }).addTo(this.companiesMap);
        const myIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png'
        });
        this.companies.forEach(company => {
          L.marker([company.latitude, company.longitude], { icon: myIcon }).addTo(this.companiesMap).bindPopup(company.name);
        });
      }
    }

  }

  treatCaseError() {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.search, CompanySearchEventNames.noResult);
    this.searchError = 'Une erreur technique s\'est produite.';
  }

  selectCompanyFromResults(company: Company) {
    this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.select);
    this.selectCompany(company);
  }

  selectCompany(company: Company) {
    this.analyticsService.trackEvent(EventCategories.report, ReportEventActions.validateCompany);
    this.report.company = company;
    this.reportStorageService.changeReportInProgressFromStep(this.report, this.step);
    this.reportRouterService.routeForward(this.step);
  }

  submitCompanyForm() {
    if (!this.companyForm.valid) {
      this.showErrors = true;
    } else {
      this.analyticsService.trackEvent(EventCategories.company, CompanyEventActions.manualEntry);
      this.selectCompany(
        Object.assign(
          new Company(),
          {
            name: this.nameCtrl.value,
            line1: this.nameCtrl.value,
            line2: this.addressCtrl.value,
            postalCode: this.addressCtrlPostalCode
          }
        )
      );
    }
  }

  selectAddress(selected: CompleterItem) {
    this.addressCtrlPostalCode = '';
    if (selected) {
      this.addressCtrlPostalCode = selected.originalObject.postcode;
    }
  }

  changeCompany() {
    this.report.company = undefined;
  }

  hasError(formControl: FormControl) {
    return this.showErrors && formControl.errors;
  }
}
