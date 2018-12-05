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
