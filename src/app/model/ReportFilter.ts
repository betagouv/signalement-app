import { Tag } from './Anomaly';
import Utils from '../utils';

export interface ReportFilter {
  readonly departments?: string[];
  /**
   * @deprecated
   * This variable is supposed to contain 'start and 'end' variables.
   * It is used for convenience purpose in the view and could be remove soon.
   */
  readonly period?: string[];
  readonly tags?: Tag[];
  readonly companyCountries?: string[];
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

export interface ReportFilterQuerystring {
  readonly departments?: string;
  readonly tags?: string | string[];
  readonly companyCountries?: string;
  start?: string;
  end?: string;
  email?: string;
  siret?: string;
  category?: string;
  status?: string;
  details?: string;
  hasCompany?: string;
  offset?: string;
  limit?: string;
}

export const reportFilter2QueryString = (report: ReportFilter): ReportFilterQuerystring => {
  try {
    const { period, companyCountries, departments, hasCompany, offset, limit, ...r } = report;
    return {
      ...r,
      offset: offset ? offset + '' : undefined,
      limit: limit ? limit + '' : undefined,
      ...(hasCompany !== undefined &&  {hasCompany: '' + hasCompany}),
      ...(companyCountries ? { companyCountries: companyCountries.join(',') } : {}),
      ...(departments ? { departments: departments.join(',') } : {}),
      ...((period && period[0]) ? { start: Utils.mapDate(period[0]) } : {}),
      ...((period && period[1]) ? { end: Utils.mapDate(period[1]) } : {}),
    };
  } catch (e) {
    console.error('Caught error on "reportFilter2QueryString"', report, e);
    return {};
  }
};

