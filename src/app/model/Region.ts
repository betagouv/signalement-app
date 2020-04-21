import departments from '../../assets/data/departments.json';
import regions from '../../assets/data/regions.json';

export class Department {
  code: string;
  label: string;

  constructor() {
    this.code = undefined;
    this.label = undefined;
  }

  static fromCode(code: string) {
    return Departments.find(dept => dept.code === code);
  }
}

export class Region {
  label: string;
  departments: Department[];

  constructor() {
    this.label = undefined;
    this.departments = [];
  }
}

export const Regions = regions.map(region => Object.assign(new Region(),
  {
    label: region.name,
    departments: departments
      .filter(department => department.region_code === region.code)
      .map(department => Object.assign(new Department(),
        {
          code: department.code,
          label: department.name
        }))
  })).sort((r1, r2) => r1.label.localeCompare(r2.label));

export const Departments = departments.map(department => Object.assign(new Department(),
  {
    code: department.code,
    label: department.name
  }));
