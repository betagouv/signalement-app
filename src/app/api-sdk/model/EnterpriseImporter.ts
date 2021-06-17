import { Id } from './Common';

export interface EnterpriseImporterInfo {
  id: Id;
  fileName: string;
  fileUrl: string;
  linesCount: number;
  linesDone: number;
  startedAt: Date;
  endedAt?: Date;
  errors?: string;
}

export interface EnterpriseImporterInfos {
  etablissementImportInfo: EnterpriseImporterInfo;
  uniteLegaleInfo: EnterpriseImporterInfo;
}

export const mapEnterpriseImporterInfo = (_?: { [key in keyof EnterpriseImporterInfo]: any }): EnterpriseImporterInfo => _
  ? ({
    ..._,
    startedAt: new Date(_.startedAt),
    ...(_.endedAt ? { endedAt: new Date(_.endedAt) } : {}),
  })
  : undefined;
