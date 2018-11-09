import { JsonProperty } from 'json-typescript-mapper';

export class TypeAnomalie {
  @JsonProperty('categorie')
  categorie: string;
  @JsonProperty('precisionList')
  precisionList: string[];

  constructor() {
    this.categorie = undefined;
    this.precisionList = undefined;
  }
}

export class Anomalie {
  @JsonProperty('typeEtablissement')
  typeEtablissement: string;
  @JsonProperty({ name: 'typeAnomalieList', clazz: TypeAnomalie })
  typeAnomalieList: TypeAnomalie[];

  constructor() {
    this.typeEtablissement = undefined;
    this.typeAnomalieList = undefined;
  }
}

export class AnomalieList {
  @JsonProperty({ name: 'list', clazz: Anomalie })
  list: Anomalie[];

  constructor() {
    this.list = undefined;
  }
}
