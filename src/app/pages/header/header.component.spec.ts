import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));


  describe('for a not authenticated user', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display 2 menu items and an authentication button when no user is authenticated', () => {
      const nativeElement = fixture.nativeElement;
      expect(nativeElement.querySelectorAll('.nav-item > .nav-link').length).toBe(3);
      expect(nativeElement.querySelector('.nav-item > button').textContent.trim()).toContain('Espace pro');
    });
  });
});
