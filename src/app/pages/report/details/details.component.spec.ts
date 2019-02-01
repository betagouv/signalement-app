import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponent } from './details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, defineLocale, frLocale } from 'ngx-bootstrap';
import { FileInputComponent } from '../../../components/file-input/file-input.component';
import { ReportDetails } from '../../../model/Report';
import { Precision, SubcategoryDetails } from '../../../model/Anomaly';
import { CollapsableTextComponent } from '../../../components/collapsable-text/collapsable-text.component';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { Angulartics2RouterlessModule } from 'angulartics2/routerlessmodule';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const anomalyDateFixture = new Date(2018, 1, 2);
  const anomalyFileFixture = new File([], 'anomaly.jpg');
  const reportDetailsFixture = new ReportDetails();
  reportDetailsFixture.description = 'Description';
  reportDetailsFixture.anomalyDate = anomalyDateFixture;
  reportDetailsFixture.anomalyTimeSlot = 5;
  reportDetailsFixture.ticketFile = undefined;
  reportDetailsFixture.anomalyFile = anomalyFileFixture;

  beforeEach(async(() => {
    defineLocale('fr', frLocale);
    TestBed.configureTestingModule({
      declarations: [
        DetailsComponent,
        FileInputComponent,
        CollapsableTextComponent,
        TruncatePipe,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        Angulartics2RouterlessModule.forRoot(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit function', () => {

    it('should initially display the form and no errors message', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(nativeElement.querySelector('.notification.error')).toBeNull();
    });

    it('should initialize the details inputs with empty values and current date when there is no initial value', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('textarea[formControlName="description"]').value).toEqual('');
      expect(nativeElement.querySelector('input[formControlName="anomalyDate"]').value).toEqual((new Date()).toLocaleDateString('fr'));
      expect(nativeElement.querySelector('select').value).toEqual('');
    });

    it('should initialize the details inputs with initial value when it exists', () => {
      component.initialValue = reportDetailsFixture;
      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('textarea[formControlName="description"]').value).toEqual(reportDetailsFixture.description);
      expect(nativeElement.querySelector('input[formControlName="anomalyDate"]').value)
        .toEqual(reportDetailsFixture.anomalyDate.toLocaleDateString('fr'));
      expect(nativeElement.querySelector('select').value).toEqual(reportDetailsFixture.anomalyTimeSlot.toString());
    });

    it ('should define the plageHoraireList to display', () => {
      component.ngOnInit();

      expect(component.plageHoraireList).toBeDefined();
      expect(component.plageHoraireList.length).toBe(24);
    });

    it('sould display an input to select precision when a precision list is attached to the subcategory', () => {
      const precision = new Precision();
      precision.title = 'titre precision';
      precision.options = [ {title: 'option 1'}, { title: 'option 2'}];
      const subcategoryDetails = new SubcategoryDetails();
      subcategoryDetails.precision = precision;
      component.subcategoryDetails = subcategoryDetails;

      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('input[formControlName="precision"]').length).toEqual(precision.options.length);
    });

  });

  describe('submitDetailsForm function', () => {

    it('should display errors when occurs', () => {
      component.anomalyDateCtrl.setValue('');

      component.submitDetailsForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it ('should emit and event with a company which contains form inputs when no errors', (done) => {

      component.descriptionCtrl.setValue('Description');
      component.precisionCtrl.setValue('precision');
      component.anomalyDateCtrl.setValue(anomalyDateFixture);
      component.anomalyTimeSlotCtrl.setValue(5);
      component.anomalyFile = anomalyFileFixture;

      const detailsExpected = new ReportDetails();
      detailsExpected.description = 'Description';
      detailsExpected.precision = 'precision';
      detailsExpected.anomalyDate = anomalyDateFixture;
      detailsExpected.anomalyTimeSlot = 5;
      detailsExpected.ticketFile = undefined;
      detailsExpected.anomalyFile = anomalyFileFixture;

      component.validate.subscribe(details => {
        expect(details).toEqual(detailsExpected);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();

    });
  });
});
