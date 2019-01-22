import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerComponent } from './consumer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';

describe('ConsumerComponent', () => {
  let component: ConsumerComponent;
  let fixture: ComponentFixture<ConsumerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConsumerComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerComponent);
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

      expect(component.consumerForm.controls['firstName']).toEqual(component.firstNameCtrl);
      expect(component.consumerForm.controls['lastName']).toEqual(component.lastNameCtrl);
      expect(component.consumerForm.controls['email']).toEqual(component.emailCtrl);
    });

    it('should not display form errors', () => {
      component.ngOnInit();

      expect(component.showErrors).toBeFalsy();
    });
  });

  describe('submitConsumerForm function', () => {

    it('should display errors when occurs', () => {
      component.firstNameCtrl.setValue('');
      component.lastNameCtrl.setValue('');
      component.emailCtrl.setValue('');

      component.submitConsumerForm();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(component.showErrors).toBeTruthy();
      expect(nativeElement.querySelectorAll('.invalid').length).toEqual(3);
    });

    it ('should emit and event with a company which contains form inputs when no errors', (done) => {

      const anomalyDate = new Date();
      component.firstNameCtrl.setValue('Prénom');
      component.lastNameCtrl.setValue('Nom');
      component.emailCtrl.setValue('test@gmail.com');
      fixture.detectChanges();

      const consumerExpected = new Consumer();
      consumerExpected.firstName = 'Prénom';
      consumerExpected.lastName = 'Nom';
      consumerExpected.email = 'test@gmail.com';

      component.submit.subscribe(consumer => {
        expect(consumer).toEqual(consumerExpected);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitConsumerForm').click();
      fixture.detectChanges();

    });
  });
});
