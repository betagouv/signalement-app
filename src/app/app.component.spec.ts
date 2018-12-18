import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Angulartics2Module } from 'angulartics2';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        Angulartics2Module.forRoot(),
        RouterTestingModule
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
