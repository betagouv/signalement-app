export class Company {

  name: string;
  sign: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  line5: string;
  line6: string;
  line7: string;
  siret: string;
  postalCode: string;
  activityLabel: string;

  set nom_raison_sociale(value) {
    this.name = value;
  }
  set enseigne(value) {
    this.sign = value;
  }
  set l1_normalisee(value) {
    this.line1 = value;
  }
  set l2_normalisee(value) {
    this.line2 = value;
  }
  set l3_normalisee(value) {
    this.line3 = value;
  }
  set l4_normalisee(value) {
    this.line4 = value;
  }
  set l5_normalisee(value) {
    this.line5 = value;
  }
  set l6_normalisee(value) {
    this.line6 = value;
  }
  set l7_normalisee(value) {
    this.line7 = value;
  }
  set code_postal(value) {
    this.postalCode = value;
  }
  set libelle_activite_principale(value) {
    this.activityLabel = value;
  }
}

export class CompanySearchResult {
  total: number;
  companies: Company[];

  set total_results(value) {
    this.total = value;
  }
  set etablissement(values: []) {
    this.companies = values.map(value => Object.assign(new Company(), value));
  }

}
