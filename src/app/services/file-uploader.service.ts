import { Injectable } from '@angular/core';
import { Api, ServiceUtils } from './core/service.utils';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { FileOrigin, UploadedFile } from '../model/UploadedFile';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) { }

  uploadFile(file: File, origin: FileOrigin) {
    const fileFormData: FormData = new FormData();
    fileFormData.append('reportFile', file, file.name);
    fileFormData.append('reportFileOrigin', origin);
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports', 'files']),
      fileFormData,
    ).pipe(
      map(result => Object.assign(new UploadedFile(), result))
    );
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.serviceUtils.getUrl(Api.Report, ['api', 'reports', 'files', uploadedFile.id, uploadedFile.filename]);
  }

}
