import { JsonProperty } from 'json-typescript-mapper';


export class Action {
  @JsonProperty('question')
  question: string;
  @JsonProperty('example')
  example: string;
  @JsonProperty('answer')
  answer: string;

  constructor() {
    this.question = undefined;
    this.example = undefined;
    this.answer = undefined;
  }
}

export class Information {
  @JsonProperty('title')
  title: string;
  @JsonProperty('subTitle')
  subTitle?: string;
  @JsonProperty('content')
  content?: string;
  @JsonProperty({ name: 'actions', clazz: Action})
  actions?: Action[];
  @JsonProperty('reference')
  reference?: string;

  constructor() {
    this.title = undefined;
    this.subTitle = undefined;
    this.content = undefined;
    this.actions = undefined;
    this.reference = undefined;
  }
}

export class Precision {
  @JsonProperty('title')
  title: string;
  @JsonProperty('severalOptionsAllowed')
  severalOptionsAllowed: boolean;
  @JsonProperty({ name: 'options', clazz: Information })
  options: Information[];

  constructor() {
    this.title = undefined;
    this.severalOptionsAllowed = false;
    this.options = undefined;
  }
}

export class DetailInput {
  @JsonProperty('label')
  label: string;
  @JsonProperty('rank')
  rank: number;
  @JsonProperty('type')
  type: string;
  @JsonProperty('placeholder')
  placeholder?: string;
  @JsonProperty('options')
  options?: string[];
  @JsonProperty('defaultValue')
  defaultValue: string;
  @JsonProperty('samples')
  samples?: string;

  constructor() {
    this.label = undefined;
    this.rank = undefined;
    this.type = undefined;
    this.placeholder = undefined;
    this.options = undefined;
    this.defaultValue = undefined;
    this.samples = undefined;
  }
}

export class SubcategoryDetails {
  @JsonProperty('descriptionTips')
  descriptionTips?: string;
  @JsonProperty({ name: 'precision', clazz: Precision })
  precision?: Precision;

  constructor() {
    this.descriptionTips = undefined;
    this.precision = undefined;
  }
}

export class Subcategory {
  @JsonProperty('title')
  title: string;
  @JsonProperty('description')
  description?: string;
  @JsonProperty('samples')
  samples?: string;
  @JsonProperty('subcategoriesTitle')
  subcategoriesTitle?: string;
  @JsonProperty({ name: 'subcategories', clazz: Subcategory })
  subcategories?: Subcategory[];
  @JsonProperty({ name: 'details', clazz: SubcategoryDetails })
  details?: SubcategoryDetails;
  @JsonProperty({ name: 'detailInputs', clazz: DetailInput })
  detailInputs?: DetailInput[];
  @JsonProperty('fileLabel')
  fileLabel?: string;
  @JsonProperty('information')
  information?: Information;

  constructor() {
    this.title = undefined;
    this.description = undefined;
    this.samples = undefined;
    this.subcategoriesTitle = undefined;
    this.subcategories = undefined;
    this.details = undefined;
    this.detailInputs = undefined;
    this.fileLabel = undefined;
    this.information = undefined;
  }
}

export class Anomaly {
  @JsonProperty('category')
  category: string;
  @JsonProperty('categoryId')
  categoryId: string;
  @JsonProperty('hidden')
  hidden?: boolean;
  @JsonProperty('description')
  description: string;
  @JsonProperty('rank')
  rank?: number;
  @JsonProperty('withInternetPurchase')
  withInternetPurchase?: boolean;
  @JsonProperty('icon')
  icon?: string;
  @JsonProperty({ name: 'information', clazz: Information })
  information?: Information;
  @JsonProperty('breadcrumbTitle')
  breadcrumbTitle?: string;
  @JsonProperty('subcategoriesTitle')
  subcategoriesTitle?: string;
  @JsonProperty({ name: 'subcategories', clazz: Subcategory })
  subcategories?: Subcategory[];

  constructor() {
    this.category = undefined;
    this.categoryId = undefined;
    this.hidden = false;
    this.description = undefined;
    this.rank = undefined;
    this.withInternetPurchase = undefined;
    this.icon = undefined;
    this.information = undefined;
    this.breadcrumbTitle = undefined;
    this.subcategoriesTitle = undefined;
    this.subcategories = undefined;
  }
}

export class AnomalyList {
  @JsonProperty({ name: 'list', clazz: Anomaly })
  list: Anomaly[];

  constructor() {
    this.list = undefined;
  }
}

export enum InputType {
  Text = 'TEXT',
  Radio = 'RADIO',
  Checkbox = 'CHECKBOX',
  Textarea = 'TEXTAREA',
  Timeslot = 'TIMESLOT',
  Date = 'DATE'
}
