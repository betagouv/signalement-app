import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Angulartics2Module } from 'angulartics2';
import { RouterTestingModule } from '@angular/router/testing';
import { AtInternetService } from './services/at-internet.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        Angulartics2Module.forRoot(),
        RouterTestingModule
      ],
      providers: [
        {
          provide: AtInternetService, useClass: class MockAtInternetService {
            send = (pageInfo: any) => {};
          }
        }
      ]
    });
    TestBed.overrideTemplate(AppComponent, '<h1>Signalement</h1>');
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
