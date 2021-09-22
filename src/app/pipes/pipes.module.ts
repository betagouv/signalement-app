import { NgModule } from '@angular/core';
import { TruncatePipe } from './truncate.pipe';
import { PrecedeByPipe } from './precede-by.pipe';
import { MiddleCropPipe } from './middlecrop.pipe';
import { HostFromUrlPipe } from './host-from-url.pipe';

@NgModule({
  declarations: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
    HostFromUrlPipe,
  ],
  imports: [
  ],
  exports: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
    HostFromUrlPipe,
  ],
  providers: [
  ]
})
export class PipesModule { }


