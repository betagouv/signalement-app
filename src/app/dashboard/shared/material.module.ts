import { Injectable, NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatPseudoCheckboxModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Injectable()
export class MatPaginatorIntlFr extends MatPaginatorIntl {
  itemsPerPageLabel = 'Lignes par page';
  nextPageLabel = 'Suivant';
  previousPageLabel = 'Précédent';
  getRangeLabel = (pageIndex: number, pageSize: number, length: number) => `${pageIndex * pageSize} - ${(pageIndex + 1) * pageSize} sur ${length}`;
}

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatPseudoCheckboxModule,
    MatRippleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSortModule,
    MatDialogModule,
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlFr },
  ],
  entryComponents: []
})
export class MaterialModule {
}

