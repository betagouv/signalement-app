import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileOrigin, UploadedFile } from '../../model/UploadedFile';
import { FileUploaderService } from '../../services/file-uploader.service';
import Utils from '../../utils';
import { fileSizeMax } from '../../pages/report/details/details.component';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {

  @Input() label: string;
  @Input() uploadedFiles: UploadedFile[];
  @Input() origin: FileOrigin;

  @ViewChild('fileInput', {static: false}) fileInput;

  tooLargeFilename: string;
  invalidFileExtension = false;
  allowedExtensions = ['jpg', 'jpeg', 'pdf', 'png', 'gif', 'doc', 'docx', 'odt'];

  constructor(private fileUploaderService: FileUploaderService) { }

  ngOnInit() {

    if (!this.label) {
      this.label = 'Pièces jointes';
    }
    if (!this.uploadedFiles) {
      this.uploadedFiles = [];
    }
  }

  getInputAcceptExtensions() {
    return this.allowedExtensions.map(ext => `.${ext}`).join(',');
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  bringFileSelector() {
    this.fileInput.nativeElement.click();
  }

  checkExtension(filename: string) {
    return this.allowedExtensions.indexOf(filename.split('.').pop().toLowerCase()) != -1;
  }

  selectFile() {
    this.tooLargeFilename = undefined;
    this.invalidFileExtension = false;
    if (this.fileInput.nativeElement.files[0]) {
      if (this.fileInput.nativeElement.files[0].size > fileSizeMax) {
        this.tooLargeFilename = this.fileInput.nativeElement.files[0].name;
      } else if (!this.checkExtension(this.fileInput.nativeElement.files[0].name)) {
        this.invalidFileExtension = true;
      } else {
        const fileToUpload = new UploadedFile();
        fileToUpload.filename = this.fileInput.nativeElement.files[0].name;
        fileToUpload.loading = true;
        this.uploadedFiles.push(fileToUpload);
        this.fileUploaderService.uploadFile(this.fileInput.nativeElement.files[0], this.origin).subscribe(uploadedFile => {
          fileToUpload.loading = false;
          fileToUpload.id = uploadedFile.id;
          fileToUpload.origin = uploadedFile.origin;
        }, error => {
          fileToUpload.loading = false;
        });
      }
    }
  }

  getErrorFilename(filename: string) {
    return `Echec du téléchargement (${Utils.textOverflowMiddleCropping(filename, 10)})`.concat();
  }

  removeUploadedFile(uploadedFile: UploadedFile) {
    this.uploadedFiles.splice(
      this.uploadedFiles.findIndex(f => f.id === uploadedFile.id),
      1
    );
    if (uploadedFile.id) {
      this.fileUploaderService.deleteFile(uploadedFile).subscribe();
    }
  }

}
