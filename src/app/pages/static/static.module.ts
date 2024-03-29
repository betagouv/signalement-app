import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowComponent } from './how/how.component';
import { AboutComponent } from './about/about.component';
import { RetractationComponent } from './retractation/retractation.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { CguComponent } from './cgu/cgu.component';
import { BlogComponent } from './blog/blog.component';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { ContactComponent } from './contact/contact.component';
import { ComponentsModule } from '../../components/components.module';
import { TrackingAndPrivacyComponent } from './tracking-and-privacy/tracking-and-privacy.component';
import { FaqComponent } from './faq/faq.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UnavailableComponent } from './unavailable/unavailable.component';
import { MemberComponent } from './about/member.component';
import { PageModule } from '../../components/page/page.module';
import { PanelModule } from '../../components/panel/panel.module';
import { FenderModule } from '../../components/fender/fender';
import {CookiesComponent} from "./cookies/cookies.component";

const routes: Routes = [
  { path: 'comment-ça-marche', component: HowComponent },
  { path: 'comment-ça-marche/consommateur', component: FaqComponent },
  { path: 'comment-ça-marche/professionnel', component: FaqComponent },
  { path: 'centre-aide/consommateur', component: FaqComponent },
  { path: 'centre-aide/professionnel', component: FaqComponent },
  { path: 'qui-sommes-nous', component: AboutComponent },
  { path: 'delai-de-retractation', component: RetractationComponent },
  { path: 'accessibilite', component: AccessibilityComponent },
  { path: 'plan-du-site', component: SitemapComponent },
  { path: 'conditions-generales-utilisation', component: CguComponent },
  { path: 'conditions-generales-utilisation/consommateur', component: CguComponent },
  { path: 'conditions-generales-utilisation/professionnel', component: CguComponent },
  { path: 'blog/:year/:month/:day/:article', component: BlogComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'suivi-et-vie-privee', component: TrackingAndPrivacyComponent },
  { path: 'cookies', component: CookiesComponent },
];

@NgModule({
  declarations: [
    MemberComponent,
    HowComponent,
    AboutComponent,
    FaqComponent,
    AccessibilityComponent,
    SitemapComponent,
    CguComponent,
    BlogComponent,
    RetractationComponent,
    ContactComponent,
    TrackingAndPrivacyComponent,
    CookiesComponent,
    UnavailableComponent
  ],
  imports: [
    FormsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(routes),
    MarkdownModule.forRoot(),
    ComponentsModule,
    PageModule,
    PanelModule,
    FenderModule,
  ],
  exports: [
  ],
  providers: [
  ]
})
export class StaticModule { }
