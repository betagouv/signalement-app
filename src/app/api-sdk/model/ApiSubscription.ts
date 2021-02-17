import { Department } from '../../model/Region';

export type ApiSubscriptionFrequency = 'P7D' | 'P1D';

export interface ApiSubscription {
  id: string;
  departments: Department[];
  categories: string[];
  sirets: string[];
  frequency: ApiSubscriptionFrequency;
  countries: string[];
  tags: string[];
}

export interface ApiSubscriptionCreate {
  departments: Department[];
  categories: string[];
  sirets: string[];
  frequency: ApiSubscriptionFrequency;
  countries: string[];
  tags: string[];
}
