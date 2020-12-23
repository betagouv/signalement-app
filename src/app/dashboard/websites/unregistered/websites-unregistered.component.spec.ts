import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitesUnregisteredComponent } from './websites-unregistered.component';
import { ComponentsModule } from '../../../components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { WebsiteService } from '../../../services/website.service';
import { addMonths } from 'date-fns';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, frLocale } from 'ngx-bootstrap/chronos';

describe('UnregisteredComponent', () => {

  let component: WebsitesUnregisteredComponent;
  let fixture: ComponentFixture<WebsitesUnregisteredComponent>;
  let websiteService: WebsiteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsitesUnregisteredComponent ],
      imports: [
        ComponentsModule,
        SharedModule,
        RouterTestingModule,
        NoopAnimationsModule,
        BsDatepickerModule.forRoot(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    defineLocale('fr', frLocale);
    websiteService = TestBed.inject(WebsiteService);
    fixture = TestBed.createComponent(WebsitesUnregisteredComponent);
    component = fixture.componentInstance;
  });

  it('should list unregistered websites in a datatable', () => {

    spyOn(websiteService, 'listUnregistered').and.callFake(() => of([{ host: 'host1.fr', count: 1}, { host: 'host2.fr', count: 2}]));

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;
    expect(nativeElement.querySelector('tbody')).not.toBeNull();
    expect(nativeElement.querySelectorAll('tbody > tr').length).toBe(2);

  });

  it('should request the API on filtering', () => {

    const websiteServiceSpy = spyOn(websiteService, 'listUnregistered').and.callFake(() => of([{ host: 'host1.fr', count: 1}, { host: 'host2.fr', count: 2}]));

    const q = 'host';
    const start = addMonths(new Date(), -1);
    const end = new Date();

    component.hostFilter = q;
    component.periodFilter = [start, end];
    fixture.detectChanges();

    expect(websiteServiceSpy).toHaveBeenCalledWith('host', start, end);

  });
});
