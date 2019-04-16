import Utils from '../utils';

export class UploadedFile {
  id: string;
  filename: string;
  creationDate: Date;
  loading: boolean;

  get displayedFilename() {
    return Utils.textOverflowMiddleCropping(this.filename, 32);
  }
}
