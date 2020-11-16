import { Tag } from './Anomaly';

export interface ReportFilter {
  readonly departments?: string[];
  readonly period?: string[];
  readonly tags?: Tag[];
  start?: string;
  end?: string;
  email?: string;
  siret?: string;
  category?: string;
  status?: string;
  details?: string;
  hasCompany?: boolean;
  offset?: number;
  limit?: number;
}
