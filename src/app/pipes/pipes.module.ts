import { NgModule } from '@angular/core';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { PrecedeByPipe } from './precede-by.pipe';
import { MiddleCropPipe } from './middlecrop.pipe';

@NgModule({
  declarations: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
  ],
  imports: [
  ],
  exports: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
  ],
  providers: [
  ]
})
export class PipesModule { }


