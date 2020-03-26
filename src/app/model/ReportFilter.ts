import { Department } from './Region';

export class ReportFilter {
  departments?: Department[];
  areaLabel?: string;
  period?: Date[];
  email?: string;
  siret?: string;
  category?: string;
  status?: string;
  details?: string;
}
