import { Injectable } from '@angular/core';
import { FetchService } from './helper/FetchService';
import { ApiSdkService } from './core/api-sdk.service';
import { EnterpriseImporterInfos } from '../api-sdk/model/EnterpriseImporter';

@Injectable({ providedIn: 'root' })
export class StartEtablissementFileService extends FetchService<void> {
  constructor(protected api: ApiSdkService) {
    super(api, api.secured.enterpriseImporter.startEtablissementFile);
  }
}

@Injectable({ providedIn: 'root' })
export class CancelEtablissementFileService extends FetchService<void> {
  constructor(protected api: ApiSdkService) {
    super(api, api.secured.enterpriseImporter.cancelEtablissementFile);
  }
}
@Injectable({ providedIn: 'root' })
export class StartUniteLegaleFileService extends FetchService<void> {
  constructor(protected api: ApiSdkService) {
    super(api, api.secured.enterpriseImporter.startUniteLegaleFile);
  }
}

@Injectable({ providedIn: 'root' })
export class CancelUniteLegaleFileService extends FetchService<void> {
  constructor(protected api: ApiSdkService) {
    super(api, api.secured.enterpriseImporter.cancelUniteLegaleFile);
  }
}

@Injectable({ providedIn: 'root' })
export class EnterpriseImporterServiceInfoService extends FetchService<EnterpriseImporterInfos> {
  constructor(protected api: ApiSdkService) {
    super(api, api.secured.enterpriseImporter.getInfo);
  }
}
