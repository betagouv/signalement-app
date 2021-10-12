import { CompanySearchResult as ApiCompanySearchResult } from '@signal-conso/signalconso-api-sdk-js';

export interface CompanySearchResult extends ApiCompanySearchResult {
  highlight?: string;
}
