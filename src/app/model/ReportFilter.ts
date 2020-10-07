import { Department } from './Region';
import { Tag } from './Anomaly';

export class ReportFilter {
  departments?: Department[];
  areaLabel?: string;
  period?: Date[];
  email?: string;
  siret?: string;
  category?: string;
  status?: string;
  details?: string;
  hasCompany?: boolean;
  tags: Tag[] = [];

  set hasCompanyStr(value: string) {
    this.hasCompany = value ? value === 'true' : undefined;
  }

  get hasCompanyStr() {
    return this.hasCompany !== undefined ? this.hasCompany.toString() : undefined;
  }
}
