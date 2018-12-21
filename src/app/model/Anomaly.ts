import { JsonProperty } from 'json-typescript-mapper';

export class AnomalyType {
  @JsonProperty('category')
  category: string;
  @JsonProperty('precisionList')
  precisionList: string[];

  constructor() {
    this.category = undefined;
    this.precisionList = undefined;
  }
}

export class Anomaly {
  @JsonProperty('companyType')
  companyType: string;
  @JsonProperty({ name: 'anomalyTypeList', clazz: AnomalyType })
  anomalyTypeList: AnomalyType[];

  constructor() {
    this.companyType = undefined;
    this.anomalyTypeList = undefined;
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
  @JsonProperty('info')
  info: string;

  constructor() {
    this.key = undefined;
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
