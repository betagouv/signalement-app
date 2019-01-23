import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecisionComponent } from './precision.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Precision } from '../../../model/Anomaly';
import { deserialize } from 'json-typescript-mapper';

describe('PrecisionComponent', () => {
  let component: PrecisionComponent;
  let fixture: ComponentFixture<PrecisionComponent>;

  const precisionListFixture = [
    deserialize(Precision, { title: 'title1', description: 'description1' }),
    deserialize(Precision, { title: 'title2', description: 'description2' }),
    deserialize(Precision, { title: 'title3', description: 'description3' }),
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrecisionComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit function', () => {

    it('should initially display the form with precisions as radio buttons list and no errors message', () => {
      component.anomalyPrecisionList = precisionListFixture;

      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(nativeElement.querySelectorAll('input[type="radio"]').length).toEqual(precisionListFixture.length);
      expect(nativeElement.querySelector('.notification.error')).toBeNull();
    });

    it('should define all form controls', () => {
      component.ngOnInit();

      expect(component.precisionForm.controls['anomalyPrecision']).toEqual(component.anomalyPrecisionCtrl);
    });

  });

  describe('submitPrecisionForm function', () => {

    it('should display errors when occurs', () => {
      component.anomalyPrecisionCtrl.setValue('');

      component.submitPrecisionForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
    });

    it('should emit and event with a precision when no errors', (done) => {
      component.anomalyPrecisionList = precisionListFixture;
      component.anomalyPrecisionCtrl.setValue('title2');

      const precisionExpected = new Precision();
      precisionExpected.title = 'title2';
      precisionExpected.description = 'description2';

      component.validate.subscribe(result => {
        expect(result).toEqual(precisionExpected);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button[type="submit"]').click();
      fixture.detectChanges();
    });
  });
});
