import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {

  @Input() placeholder: string;
  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild('fileInput') fileInput;
  file: File;

  constructor() { }

  ngOnInit() {
  }

  bringFileSelector() {
    this.fileInput.nativeElement.click();
  }

  selectFile() {
    this.file = this.fileInput.nativeElement.files[0];
    this.fileSelected.emit(this.file);
  }

}
