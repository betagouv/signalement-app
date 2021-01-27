import { Tag } from './Anomaly';
import Utils from '../utils';

export interface ReportFilter {
  readonly departments?: string[];
  readonly tags?: Tag[];
  readonly companyCountries?: string[];
  start?: Date;
  end?: Date;
  email?: string;
  websiteURL?: string;
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
  websiteURL?: string;
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
    const { start, end, companyCountries, departments, hasCompany, offset, limit, ...r } = report;
    return {
      ...r,
      offset: offset ? offset + '' : '0',
      limit: limit ? limit + '' : '10',
      ...(hasCompany !== undefined && { hasCompany: '' + hasCompany }),
      ...(companyCountries ? { companyCountries: companyCountries.join(',') } : {}),
      ...(departments ? { departments: departments.join(',') } : {}),
      ...((start) ? { start: Utils.dateToApi(start) } : {}),
      ...((end) ? { end: Utils.dateToApi(end) } : {}),
    };
  } catch (e) {
    console.error('[SignalConso] Caught error on "reportFilter2QueryString"', report, e);
    return {};
  }
};

export const reportFilterFromQueryString = (report: ReportFilterQuerystring): ReportFilter => {
  try {
    const { start, end, companyCountries, departments, hasCompany, offset, limit, tags, ...r } = report;
    const parseBooleanOption = (_: string): boolean | undefined => ({ 'true': true, 'false': false, })[_];
    return {
      ...r,
      offset: +offset,
      limit: +limit,
      hasCompany: parseBooleanOption(hasCompany),
      tags: Array.isArray(tags) ? tags : (tags !== undefined ? [tags] : undefined),
      companyCountries: companyCountries?.split(','),
      departments: departments?.split(','),
      start: Utils.apiToDate(start),
      end: Utils.apiToDate(end),
    };
  } catch (e) {
    console.error('[SignalConso] Caught error on "reportFilter2QueryString"', report, e);
    return {};
  }
};

