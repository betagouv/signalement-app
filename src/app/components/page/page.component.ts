import { Component, HostBinding, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { pageDefinitions, PageDefinitions } from '../../../assets/data/pages';
import { Meta, Title } from '@angular/platform-browser';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Animations } from '../../utils/animations';

@Component({
  selector: 'app-page',
  template: `
    <main role="main" class="container -{{size}}">
      <ngx-loading [show]="loading"></ngx-loading>
      <ng-content></ng-content>
    </main>
  `,
  host: {
    '[class]': '"-" + size',
  },
  styleUrls: ['./page.component.scss'],
  animations: [Animations.appear()]
})
export class PageComponent {

  constructor(
    private titleService: Title,
    private localeService: BsLocaleService,
    private meta: Meta,
  ) {
    this.localeService.use('fr');
  }


  private _pageDefinitionKey?: keyof PageDefinitions;
  get pageDefinitionKey(): keyof PageDefinitions {
    return this._pageDefinitionKey;
  }

  @Input()
  set pageDefinitionKey(value: keyof PageDefinitions) {
    this._pageDefinitionKey = value;
    const pageDefinition = pageDefinitions[this._pageDefinitionKey];
    this.titleService.setTitle(pageDefinition.title);
    this.meta.updateTag({ name: 'description', content: pageDefinition.description });
  }

  @HostBinding('@animation')
  get animation() {
    return this.animated;
  }

  @Input() size: 'large' | 'normal' | 'small' = 'normal';

  private _animated = false;

  @Input()
  get animated() {
    return this._animated;
  }

  set animated(value: boolean) {
    this._animated = coerceBooleanProperty(value);
  }

  private _loading = false;

  @Input()
  get loading() {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = coerceBooleanProperty(value);
  }
}
