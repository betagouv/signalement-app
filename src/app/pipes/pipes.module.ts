import { NgModule } from '@angular/core';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { PrecedeByPipe } from './precede-by.pipe';
import { MiddleCropPipe } from './middlecrop.pipe';
import { IsForeignPipe } from './company.pipe';
import { HostFromUrlPipe } from './host-from-url.pipe';

@NgModule({
  declarations: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
    IsForeignPipe,
    HostFromUrlPipe,
  ],
  imports: [
  ],
  exports: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
    IsForeignPipe,
    HostFromUrlPipe,
  ],
  providers: [
  ]
})
export class PipesModule { }


