import { CompanySearchResult as ApiCompanySearchResult } from '@betagouv/signalconso-api-sdk-js';

export interface CompanySearchResult extends ApiCompanySearchResult {
  highlight?: string;
}
