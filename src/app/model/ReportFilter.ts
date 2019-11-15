import { Department } from './Region';

export class ReportFilter {
  departments?: Department[];
  areaLabel?: string;
  period?: Date[];
  siret?: string;
  category?: string;
  status?: string;
  details?: string;
}
