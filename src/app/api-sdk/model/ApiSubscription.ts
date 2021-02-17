import { Department } from '../../model/Region';
import { Country } from './Country';

export type ApiSubscriptionFrequency = 'P7D' | 'P1D';

export interface ApiSubscription {
  id: string;
  departments: Department[];
  categories: string[];
  sirets: string[];
  frequency: ApiSubscriptionFrequency;
  countries: Country[];
  tags: string[];
}

export interface ApiSubscriptionCreate {
  departments: Department[];
  categories: string[];
  sirets: string[];
  frequency: ApiSubscriptionFrequency;
  countries: Country[];
  tags: string[];
}
