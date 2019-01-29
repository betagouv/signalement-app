import { JsonProperty } from 'json-typescript-mapper';

export class Precision {
  @JsonProperty('title')
  title: string;
  @JsonProperty('options')
  options: string[];

  constructor() {
    this.title = undefined;
    this.options = undefined;
  }
}

export class Information {
  @JsonProperty('title')
  title: string;
  @JsonProperty('content')
  content?: string;

  constructor() {
    this.title = undefined;
    this.content = undefined;
  }
}

export class Subcategory {
  @JsonProperty('title')
  title: string;
  @JsonProperty('description')
  description?: string;
  fullDescriptionDisplayed?: boolean;
  @JsonProperty('information')
  information?: Information;
  @JsonProperty({ name: 'precision', clazz: Precision })
  precision?: Precision;

  constructor() {
    this.title = undefined;
    this.description = undefined;
    this.information = undefined;
    this.precision = undefined;
  }
}

export class Anomaly {
  @JsonProperty('category')
  category: string;
  @JsonProperty('description')
  description: string;
  @JsonProperty('rank')
  rank?: number;
  @JsonProperty('icon')
  icon?: string;
  @JsonProperty({ name: 'information', clazz: Information })
  information?: Information;
  @JsonProperty({ name: 'subcategories', clazz: Subcategory })
  subcategories?: Subcategory[];

  constructor() {
    this.category = undefined;
    this.description = undefined;
    this.rank = undefined;
    this.icon = undefined;
    this.information = undefined;
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
