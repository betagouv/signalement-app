import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponent } from './details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { FileInputComponent } from '../../../components/file-input/file-input.component';
import { ReportDetails } from '../../../model/Report';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DetailsComponent,
        FileInputComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
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

    it('should initially display the form', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
    });

    it('should define all form controls', () => {
      component.ngOnInit();

      expect(component.detailsForm.controls['anomalyDate']).toEqual(component.anomalyDateCtrl);
      expect(component.detailsForm.controls['anomalyTimeSlot']).toEqual(component.anomalyTimeSlotCtrl);
      expect(component.detailsForm.controls['description']).toEqual(component.descriptionCtrl);
    });

    it('should not display form errors', () => {
      component.ngOnInit();

      expect(component.showErrors).toBeFalsy();
    });

    it ('should define the plageHoraireList to display', () => {
      component.ngOnInit();

      expect(component.plageHoraireList).toBeDefined();
      expect(component.plageHoraireList.length).toBe(24);
    });

  });

  describe('submitDetailsForm function', () => {

    it('should display errors when occurs', () => {
      component.anomalyDateCtrl.setValue('');

      component.submitDetailsForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelectorAll('.invalid').length).toEqual(1);
    });

    it ('should emit and event with a company which contains form inputs when no errors', (done) => {

      const anomalyDate = new Date();
      component.descriptionCtrl.setValue('Description');
      component.anomalyDateCtrl.setValue(anomalyDate);
      component.anomalyTimeSlotCtrl.setValue(5);
      fixture.detectChanges();

      const detailsExpected = new ReportDetails();
      detailsExpected.description = 'Description';
      detailsExpected.anomalyDate = anomalyDate;
      detailsExpected.anomalyTimeSlot = 5;

      component.submit.subscribe(details => {
        expect(details).toEqual(detailsExpected);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitDetailsForm').click();
      fixture.detectChanges();

    });
  });
});
