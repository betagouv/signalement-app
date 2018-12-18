import { Component } from '@angular/core';
import { Angulartics2Piwik } from 'angulartics2/piwik';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private angulartics2Piwik: Angulartics2Piwik) {
    angulartics2Piwik.startTracking();
  }

}
