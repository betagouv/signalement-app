import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HowComponent } from './how/how.component';
import { AboutComponent } from './about/about.component';
import { ProComponent } from './pro/pro.component';
import { RetractationComponent } from './retractation/retractation.component';
import { CguComponent } from './cgu/cgu.component';
import { BlogComponent } from './blog/blog.component';
import { MarkdownModule } from 'ngx-markdown';

const routes: Routes = [
  { path: 'comment-ça-marche', component: HowComponent },
  { path: 'qui-sommes-nous', component: AboutComponent },
  { path: 'vous-êtes-un-professionnel', component: ProComponent },
  { path: 'delai-de-retractation', component: RetractationComponent },
  { path: 'conditions-generales-utilisation', redirectTo: 'conditions-generales-utilisation/consommateur' },
  { path: 'conditions-generales-utilisation/consommateur', component: CguComponent },
  { path: 'conditions-generales-utilisation/professionnel', component: CguComponent },
  { path: 'blog/:year/:month/:day/:article', component: BlogComponent }
];

@NgModule({
  declarations: [
    HowComponent,
    AboutComponent,
    ProComponent,
    CguComponent,
    BlogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MarkdownModule.forRoot(),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class StaticModule { }
