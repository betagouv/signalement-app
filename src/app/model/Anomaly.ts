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
  @JsonProperty({ name: 'details', clazz: SubcategoryDetails })
  details?: SubcategoryDetails;
  @JsonProperty('information')
  information?: Information;

  constructor() {
    this.title = undefined;
    this.description = undefined;
    this.information = undefined;
    this.details = undefined;
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
  @JsonProperty('subcategoryTitle')
  subcategoryTitle?: string;
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
    this.subcategoryTitle = undefined;
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
