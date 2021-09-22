import Utils from '../utils/utils';

export enum FileOrigin {
  Consumer = 'consumer', Professional = 'professional'
}

export class UploadedFile {
  id: string;
  filename: string;
  loading: boolean;
  origin: FileOrigin;

  get displayedFilename() {
    return Utils.textOverflowMiddleCropping(this.filename, 32);
  }

  get displayedFilenameSmall() {
    return Utils.textOverflowMiddleCropping(this.filename, 12);
  }
}
