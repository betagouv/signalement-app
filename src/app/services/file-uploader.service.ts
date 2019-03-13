import { Injectable } from '@angular/core';
import { Api, ServiceUtils } from './service.utils';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UploadedFile } from '../model/UploadedFile';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private http: HttpClient,
              private serviceUtils: ServiceUtils) { }

  uploadFile(file: File) {
    const fileFormData: FormData = new FormData();
    fileFormData.append('reportFile', file, file.name);
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports', 'files']),
      fileFormData,
    ).pipe(
      map(result => Object.assign(new UploadedFile(), result))
    );
  }

}
