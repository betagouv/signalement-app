import { deserialize, JsonProperty, serialize } from 'json-typescript-mapper';

export class Department {
  code: string;
  label: string;

  constructor() {
    this.code = undefined;
    this.label = undefined;
  }
}

export class Region {
  label: string;
  departments: Department[];

  constructor() {
    this.label = undefined;
    this.departments = undefined;
  }
}

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

  constructor() {
    this.area = undefined;
    this.period = undefined;
  }
}

export const Regions = [
  Object.assign(new Region(), {
    label: 'Auvergne-Rhône-Alpes',
    departments: [
      Object.assign(new Department(), { code: '01', label: 'Ain' }),
      Object.assign(new Department(), { code: '03', label: 'Allier' }),
      Object.assign(new Department(), { code: '07', label: 'Ardèche' }),
      Object.assign(new Department(), { code: '15', label: 'Cantal' }),
      Object.assign(new Department(), { code: '26', label: 'Drôme' }),
      Object.assign(new Department(), { code: '38', label: 'Isère' }),
      Object.assign(new Department(), { code: '42', label: 'Loire' }),
      Object.assign(new Department(), { code: '43', label: 'Haute-Loire' }),
      Object.assign(new Department(), { code: '63', label: 'Puy-de-Dôme' }),
      Object.assign(new Department(), { code: '69', label: 'Rhône' }),
      Object.assign(new Department(), { code: '73', label: 'Savoie' }),
      Object.assign(new Department(), { code: '74', label: 'Haute-Savoie' })
    ]
  }),
  Object.assign(new Region(), {
    label: 'Centre-Val de Loire',
    departments: [
      Object.assign(new Department(), { code: '18', label: 'Cher' }),
      Object.assign(new Department(), { code: '28', label: 'Eure-et-Loir' }),
      Object.assign(new Department(), { code: '36', label: 'Indre' }),
      Object.assign(new Department(), { code: '37', label: 'Indre-et-Loire' }),
      Object.assign(new Department(), { code: '41', label: 'Loir-et-Cher' }),
      Object.assign(new Department(), { code: '45', label: 'Loiret' }),
    ]
  }),
  Object.assign(new Region(), {
    label: 'Occitanie',
    departments: [
      Object.assign(new Department(), { code: '09', label: 'Ariège' }),
      Object.assign(new Department(), { code: '11', label: 'Aude' }),
      Object.assign(new Department(), { code: '12', label: 'Aveyron' }),
      Object.assign(new Department(), { code: '30', label: 'Gard' }),
      Object.assign(new Department(), { code: '31', label: 'Haute-Garonne' }),
      Object.assign(new Department(), { code: '32', label: 'Gers' }),
      Object.assign(new Department(), { code: '34', label: 'Hérault' }),
      Object.assign(new Department(), { code: '46', label: 'Lot' }),
      Object.assign(new Department(), { code: '48', label: 'Lozère' }),
      Object.assign(new Department(), { code: '65', label: 'Hautes-Pyrénées' }),
      Object.assign(new Department(), { code: '66', label: 'Pyrénées-Orientales' }),
      Object.assign(new Department(), { code: '81', label: 'Tarn' }),
      Object.assign(new Department(), { code: '82', label: 'Tarn-et-Garonne' }),
    ]
  })
];
