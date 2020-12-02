import { NgModule } from '@angular/core';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { PrecedeByPipe } from './precede-by.pipe';
import { MiddleCropPipe } from './middlecrop.pipe';
import { DraftCompanyPipe } from './company.pipe';

@NgModule({
  declarations: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
    DraftCompanyPipe,
  ],
  imports: [
  ],
  exports: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
    DraftCompanyPipe,
  ],
  providers: [
  ]
})
export class PipesModule { }


