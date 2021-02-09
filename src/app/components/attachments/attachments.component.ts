import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FileOrigin, UploadedFile } from '../../model/UploadedFile';
import { FileUploaderService } from '../../services/file-uploader.service';
import Utils from '../../utils';
import { fileSizeMax } from '../../pages/report/details/details.component';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent {

  private _label?: string;
  private _uploadedFiles?: UploadedFile[];

  @Input() note?: string;
  @Input() origin?: FileOrigin;
  @ViewChild('fileInput') fileInput?: ElementRef;

  @Input()
  set uploadedFiles(value: UploadedFile[]) {
    this._uploadedFiles = value;
  }

  @Input()
  set label(value: string) {
    this._label = value;
  }

  get label(): string {
    return this._label || 'Pièces jointes';
  }

  get uploadedFiles(): UploadedFile[] {
    return this._uploadedFiles || [];
  }

  tooLargeFilename?: string;
  invalidFileExtension = false;
  readonly allowedExtensions = ['jpg', 'jpeg', 'pdf', 'png', 'gif', 'docx', 'odt'];

  constructor(private fileUploaderService: FileUploaderService) {
  }

  getInputAcceptExtensions() {
    return this.allowedExtensions.map(ext => `.${ext}`).join(',');
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  bringFileSelector() {
    this.fileInput?.nativeElement.click();
  }

  checkExtension(filename: string) {
    const extension = filename.split('.').pop();
    return extension ? this.allowedExtensions.indexOf(extension.toLowerCase()) !== -1 : false;
  }

  selectFile() {
    this.tooLargeFilename = undefined;
    this.invalidFileExtension = false;
    if (this.fileInput?.nativeElement.files[0]) {
      if (this.fileInput.nativeElement.files[0].size > fileSizeMax) {
        this.tooLargeFilename = this.fileInput.nativeElement.files[0].name;
      } else if (!this.checkExtension(this.fileInput.nativeElement.files[0].name)) {
        this.invalidFileExtension = true;
      } else {
        const fileToUpload = new UploadedFile();
        fileToUpload.filename = this.fileInput.nativeElement.files[0].name;
        fileToUpload.loading = true;
        this.uploadedFiles.push(fileToUpload);
        this.fileUploaderService.uploadFile(this.fileInput.nativeElement.files[0], this.origin!).subscribe(uploadedFile => {
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
