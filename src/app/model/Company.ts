import { JsonProperty } from 'json-typescript-mapper';

export class Company {

  @JsonProperty('nom_raison_sociale')
  name: string;
  @JsonProperty('enseigne')
  sign: string;
  @JsonProperty('l1_normalisee')
  line1: string;
  @JsonProperty('l2_normalisee')
  line2: string;
  @JsonProperty('l3_normalisee')
  line3: string;
  @JsonProperty('l4_normalisee')
  line4: string;
  @JsonProperty('l5_normalisee')
  line5: string;
  @JsonProperty('l6_normalisee')
  line6: string;
  @JsonProperty('l7_normalisee')
  line7: string;
  @JsonProperty('siret')
  siret: string;
  @JsonProperty('siren')
  siren: string;
  @JsonProperty('code_postal')
  postalCode: string;
  @JsonProperty('libelle_activite_principale')
  libActivite: string;
  @JsonProperty('activite_principale_entreprise')
  codeActivite: string;
  @JsonProperty('nature_activite')
  natureActivite: string;

  constructor() {
    this.name = undefined;
    this.sign = undefined;
    this.line1 = undefined;
    this.line2 = undefined;
    this.line3 = undefined;
    this.line4 = undefined;
    this.line5 = undefined;
    this.line6 = undefined;
    this.line7 = undefined;
    this.siret = undefined;
    this.siren = undefined;
    this.postalCode = undefined;
    this.libActivite = undefined;
    this.codeActivite = undefined;
    this.natureActivite = undefined;
  }
}

export class CompanySearchResult {
  @JsonProperty('total_results')
  total: number;
  @JsonProperty({ name: 'etablissement', clazz: Company })
  companies: Company[];

  constructor() {
    this.total = undefined;
    this.companies = undefined;
  }

}

export class Properties {
  @JsonProperty('name')
  name: string;

  @JsonProperty('score')
  score: number;

  @JsonProperty('label')
  label: string

  @JsonProperty('poi')
  poi: string

  @JsonProperty('id')
  idOSM: string

  @JsonProperty('city')
  city: string

  @JsonProperty('citycode')
  cityCode: string

  @JsonProperty('type')
  type: string

  @JsonProperty('importance')
  importance: number

  constructor() {
    this.name = undefined;
    this.score = undefined;
    this.label = undefined;
    this.poi = undefined;
    this.idOSM = undefined;
    this.city = undefined;
    this.cityCode = undefined;
    this.type = undefined;
    this.importance = undefined;
  }
}

export class Geometry {
  @JsonProperty('coordinates')
  coordinates: number[];

  constructor() {
    this.coordinates = undefined;
  }
}

export class Feature {
  @JsonProperty({name: 'geometry', clazz: Geometry})
  geometry: Geometry;
  @JsonProperty({name: 'properties', clazz: Properties})
  properties: Properties;

  constructor() {
    this.geometry = undefined;
    this.properties = undefined;
  }
}

export class CompanyFromAddok {
  @JsonProperty({name: 'features', clazz: Feature})
  features: Feature[];

  constructor() {
    this.features = undefined;
  }

}
