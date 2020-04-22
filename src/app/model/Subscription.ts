import { Department } from './Region';

export class Subscription {
  id: string;
  userId: string;
  departments: Department[] = [];
  categories: string[] = [];
  sirets: string[] = [];
  frequency: string;
}
