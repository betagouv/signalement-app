import { deserialize, JsonProperty, serialize } from 'json-typescript-mapper';
import { Department, Region } from './Region';

export class ReportFilter {
  @JsonProperty({customConverter: {
      fromJson(data) {
        if (data) {
          return data.departments ? deserialize(Region, data) : deserialize(Department, data);
        }
      },
      toJson(data: Region | Department) {
        return serialize(data);
      }
    }})
  area?: Region | Department;
  period?: Date[];
  siret?: string;
  category?: string;
  statusPro?: string;
  statusConso?: string;
  details?: string;

  constructor() {
    this.area = undefined;
    this.period = undefined;
    this.siret = undefined;
    this.category = '';
    this.statusPro = '';
    this.statusConso = '';
    this.details = undefined;
  }
}
