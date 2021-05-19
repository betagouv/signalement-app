import { ApiClientApi } from '../ApiClient';
import { EnterpriseImporterInfos } from '../model/EnterpriseImporter';

export class EnterpriseImporter {

  constructor(private client: ApiClientApi) {
  }

  readonly startEtablissementFile = () => this.client.post<void>(`enterprises-sync/start-etablissement`);

  readonly startUniteLegaleFile = () => this.client.post<void>(`enterprises-sync/start-unitelegale`);

  readonly cancelAllFiles = () => this.client.post<void>(`enterprises-sync/cancel`);

  readonly cancelEtablissementFile = () => this.client.post<void>(`enterprises-sync/cancel-etablissement`);

  readonly cancelUniteLegaleFile = () => this.client.post<void>(`enterprises-sync/cancel-unitelegale`);

  readonly getInfo = () => this.client.get<EnterpriseImporterInfos>(`enterprises-sync/info`)
}
