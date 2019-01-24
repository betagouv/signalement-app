import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerComponent } from './consumer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Consumer } from '../../../model/Consumer';

describe('ConsumerComponent', () => {
  let component: ConsumerComponent;
  let fixture: ComponentFixture<ConsumerComponent>;

  const consumerFixture = new Consumer();
  consumerFixture.firstName = 'Prénom';
  consumerFixture.lastName = 'Nom';
  consumerFixture.email = 'test@gmail.com';

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

    it('should initially display the form and no errors message', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('form')).not.toBeNull();
      expect(nativeElement.querySelector('.notification.error')).toBeNull();
    });

    it('should define all form controls', () => {
      component.ngOnInit();

      expect(component.consumerForm.controls['firstName']).toEqual(component.firstNameCtrl);
      expect(component.consumerForm.controls['lastName']).toEqual(component.lastNameCtrl);
      expect(component.consumerForm.controls['email']).toEqual(component.emailCtrl);
    });

    it('should initialize the inputs with empty values when there is no initial value', () => {
      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('input[formControlName="firstName"]').value).toEqual('');
      expect(nativeElement.querySelector('input[formControlName="lastName"]').value).toEqual('');
      expect(nativeElement.querySelector('input[formControlName="email"]').value).toEqual('');
    });

    it('should initialize the details inputs with initial value when it exists', () => {
      component.initialValue = consumerFixture;
      component.ngOnInit();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelector('input[formControlName="firstName"]').value).toEqual(consumerFixture.firstName);
      expect(nativeElement.querySelector('input[formControlName="lastName"]').value).toEqual(consumerFixture.lastName);
      expect(nativeElement.querySelector('input[formControlName="email"]').value).toEqual(consumerFixture.email);
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
      expect(nativeElement.querySelector('.notification.error')).not.toBeNull();
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

      component.validate.subscribe(consumer => {
        expect(consumer).toEqual(consumerExpected);
        done();
      });

      const nativeElement = fixture.nativeElement;
      nativeElement.querySelector('button#submitConsumerForm').click();
      fixture.detectChanges();

    });
  });
});
