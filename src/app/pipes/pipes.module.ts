import { NgModule } from '@angular/core';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { PrecedeByPipe } from './precede-by.pipe';
import { MiddleCropPipe } from './middlecrop.pipe';
import { IsForeignPipe } from './company.pipe';

@NgModule({
  declarations: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
    IsForeignPipe,
  ],
  imports: [
  ],
  exports: [
    PrecedeByPipe,
    TruncatePipe,
    MiddleCropPipe,
    IsForeignPipe,
  ],
  providers: [
  ]
})
export class PipesModule { }


