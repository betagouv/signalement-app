import { Component } from '@angular/core';
import { Illustrations } from '../../report/category/category.component';

@Component({
  selector: 'app-how',
  templateUrl: './how.component.html',
  styleUrls: ['./how.component.scss']
})
export class HowComponent {

  illustrations = Illustrations;
  }
