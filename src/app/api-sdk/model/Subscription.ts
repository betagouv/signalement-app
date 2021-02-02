import { Department } from '../../model/Region';

export interface Subscription {
  id: string;
  userId: string;
  departments: Department[];
  categories: string[];
  sirets: string[];
  frequency: string;
}
