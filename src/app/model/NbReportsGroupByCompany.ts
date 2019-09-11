import { JsonProperty } from 'json-typescript-mapper';

export class NbReportsGroupByCompany {
  @JsonProperty('companyPostalCode')
  companyPostalCode: string;
  @JsonProperty('companySiret')
  companySiret: string;
  @JsonProperty({ name: 'companyName'})
  companyName: string;
  @JsonProperty({ name: 'companyAddress'})
  companyAddress: string;
  @JsonProperty({ name: 'count'})
  count: number;

  constructor() {
    this.companyPostalCode = undefined;
    this.companySiret = undefined;
    this.companyName = undefined;
    this.companyAddress = undefined;
    this.count = undefined;
  }
}
