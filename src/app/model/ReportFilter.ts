import { Tag } from './Anomaly';

export interface ReportFilter {
  readonly departments?: string[];
  /**
   * @deprecated
   * This variable is supposed to contain 'start and 'end' variables.
   * It is used for convenience purpose in the view and could be remove soon.
   */
  readonly period?: string[];
  readonly tags?: Tag[];
  readonly countries?: string[];
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
