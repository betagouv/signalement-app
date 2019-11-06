import Utils from '../utils';

export enum FileOrigin {
  Consumer = 'consumer', Professional = 'professional'
}

export class UploadedFile {
  id: string;
  filename: string;
  creationDate: Date;
  loading: boolean;
  origin: FileOrigin;

  get displayedFilename() {
    return Utils.textOverflowMiddleCropping(this.filename, 32);
  }

  get displayedFilenameSmall() {
    return Utils.textOverflowMiddleCropping(this.filename, 12);
  }
}
