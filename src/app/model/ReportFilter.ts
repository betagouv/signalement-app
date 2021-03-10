import { Tag } from './Anomaly';
import Utils from '../utils';

export interface ReportFilter {
  readonly departments?: string[];
  readonly tags?: Tag[];
  readonly companyCountries?: string[];
  readonly siretSirenList?: string[];
  start?: Date;
  end?: Date;
  email?: string;
  websiteURL?: string;
  phone?: string;
  websiteExists?: boolean;
  phoneExists?: boolean;
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
  readonly siretSirenList?: string[];
  start?: string;
  end?: string;
  email?: string;
  websiteURL?: string;
  phone?: string;
  websiteExists?: 'true' | 'false';
  phoneExists?: 'true' | 'false';
  category?: string;
  status?: string;
  details?: string;
  hasCompany?: 'true' | 'false';
  offset?: string;
  limit?: string;
}

export const reportFilter2QueryString = (report: ReportFilter): ReportFilterQuerystring => {
  try {
    const { offset, limit, hasCompany, websiteExists, phoneExists, companyCountries, departments, start, end, ...r } = report;

    const parseBoolean = (_: keyof Pick<ReportFilter, 'websiteExists' | 'phoneExists' | 'hasCompany'>) => (report[_] !== undefined && { [_]: '' + report[_] as 'true' | 'false' });
    const parseDate = (_: keyof Pick<ReportFilter, 'start' | 'end'>) => ((report[_]) ? { [_]: Utils.dateToApi(report[_]) } : {});
    const parseArray = (_: keyof Pick<ReportFilter, 'companyCountries' | 'departments'>) => (report[_] ? { [_]: report[_].join(',') } : {});

    return {
      ...r,
      offset: offset !== undefined ? offset + '' : undefined,
      limit: limit !== undefined ? limit + '' : undefined,
      ...parseBoolean('hasCompany'),
      ...parseBoolean('websiteExists'),
      ...parseBoolean('phoneExists'),
      ...parseArray('companyCountries'),
      ...parseArray('departments'),
      ...parseDate('start'),
      ...parseDate('end'),
    };
  } catch (e) {
    console.error('[SignalConso] Caught error on "reportFilter2QueryString"', report, e);
    return {};
  }
};

export const reportFilterFromQueryString = (report: ReportFilterQuerystring): ReportFilter => {
  try {
    const { start, end, companyCountries, departments, hasCompany, offset, limit, tags, websiteExists, phoneExists, ...r } = report;
    const parseBooleanOption = (_?: 'true' | 'false'): boolean | undefined => ({ 'true': true, 'false': false, })[_!];
    return {
      ...r,
      offset: +(offset || '0'),
      limit: limit ? +limit : undefined,
      hasCompany: parseBooleanOption(hasCompany),
      websiteExists: parseBooleanOption(websiteExists),
      phoneExists: parseBooleanOption(phoneExists),
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

export const reportFilter2Body = (report: ReportFilter): { [key in keyof ReportFilter]: any } => {
  const { start, end, offset, departments, tags, limit, siretSirenList, ...rest } = report;
  return {
    ...rest,
    siretSirenList: Array.isArray(siretSirenList) ? siretSirenList : (siretSirenList !== undefined ? [siretSirenList] : undefined),
    departments: departments || [],
    tags: tags || [],
    start: Utils.dateToApi(start),
    end: Utils.dateToApi(end),
  };
};

export const cleanReportFilter = (filter: ReportFilter): ReportFilter => {
  if (filter.websiteExists === false) {
    delete filter.websiteExists;
    delete filter.websiteURL;
  }
  if (filter.phoneExists === false) {
    delete filter.phoneExists;
    delete filter.phone;
  }
  return filter;
};
