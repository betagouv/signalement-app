export const ReportingDateLabel = 'Date du constat';
export const ReportingTimeslotLabel = 'Heure du constat';
export const DescriptionLabel = 'Description';

export class Action {
  question: string;
  example?: string;
  answer: string;
}

export class Information {
  title?: string;
  content?: string;
  actions?: Action[];
  reference?: string;
  outOfScope?: boolean;
}

export class DetailInput {
  label: string;
  rank: number;
  type: string;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  example?: string;
  optionnal?: boolean;
}

export class Subcategory {
  title: string;
  description?: string;
  example?: string;
  subcategoriesTitle?: string;
  subcategories?: Subcategory[];
  detailTitle?: string;
  detailInputs?: DetailInput[];
  fileLabel?: string;
  information?: Information;
  consumerActions?: Information[];
  companyKind?: string;
}

export class Anomaly {
  category: string;
  categoryId: string;
  path: string;
  hidden?: boolean;
  description?: string;
  rank?: number;
  withInternetPurchase?: boolean;
  icon?: string;
  information?: Information;
  breadcrumbTitle?: string;
  subcategoriesTitle?: string;
  subcategories?: Subcategory[];
}

export enum InputType {
  Text = 'TEXT',
  Radio = 'RADIO',
  Checkbox = 'CHECKBOX',
  Textarea = 'TEXTAREA',
  Timeslot = 'TIMESLOT',
  Date = 'DATE'
}

export enum CompanyKinds {
  SIRET = 'SIRET', WEBSITE = 'WEBSITE'
}
