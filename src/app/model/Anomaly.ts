import { JsonProperty } from 'json-typescript-mapper';

export class Precision {
  @JsonProperty('title')
  title: string;
  @JsonProperty('description')
  description?: string;

  constructor() {
    this.title = undefined;
    this.description = undefined;
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



export class Anomaly {
  @JsonProperty('category')
  category: string;
  @JsonProperty('description')
  description: string;
  @JsonProperty('rank')
  rank?: string;
  @JsonProperty('icon')
  icon?: string;
  @JsonProperty({ name: 'information', clazz: Information })
  information?: Information;
  @JsonProperty({ name: 'precisionList', clazz: Precision })
  precisionList?: Precision[];

  constructor() {
    this.category = undefined;
    this.description = undefined;
    this.rank = undefined;
    this.icon = undefined;
    this.information = undefined;
    this.precisionList = undefined;
  }
}

export class AnomalyList {
  @JsonProperty({ name: 'list', clazz: Anomaly })
  list: Anomaly[];

  constructor() {
    this.list = undefined;
  }
}

export class AnomalyInfo {
  @JsonProperty('key')
  key: string;
  @JsonProperty('title')
  title: string;
  @JsonProperty('info')
  info: string;

  constructor() {
    this.key = undefined;
    this.title = undefined;
    this.info = undefined;
  }
}

export class AnomalyInfoList {
  @JsonProperty({ name: 'list', clazz: AnomalyInfo })
  list: AnomalyInfo[];

  constructor() {
    this.list = undefined;
  }
}
