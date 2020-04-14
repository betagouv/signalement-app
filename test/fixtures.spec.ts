import { Roles, User } from '../src/app/model/AuthUser';
import { DraftReport, Report, ReportStatus } from '../src/app/model/Report';
import { Consumer } from '../src/app/model/Consumer';
import { CompanySearchResult } from '../src/app/model/CompanySearchResult';
import { Subcategory } from '../src/app/model/Anomaly';
import { Company } from '../src/app/model/Company';

const randomstring = require('randomstring');

export function oneOf(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function oneBoolean() {
  return oneOf([false, true]);
}

export function genSiret() {
  return randomstring.generate({
    length: 14,
    charset: 'numeric'
  });
}

export const lastNames = ['Doe', 'Durand', 'Dupont'];
export const firstNames = ['Alice', 'Bob', 'Charles', 'Danièle', 'Émilien', 'Fanny', 'Gérard'];
export const roles = [Roles.Admin, Roles.Pro, Roles.DGCCRF];
export const status = [ReportStatus.ToProcess, ReportStatus.ClosedForPro];

export function genUserAccess() {
  return {
    companySiret: genSiret(),
    companyName: randomstring.generate(),
    companyAddress: randomstring.generate(),
    level: oneOf(['admin', 'member'])
  };
}

export function genUser(role: Roles) {
  return Object.assign(new User(), {
    id: randomstring.generate(),
    login: randomstring.generate(),
    email: randomstring.generate(),
    password: randomstring.generate(),
    firstName: oneOf(firstNames),
    lastName: oneOf(lastNames),
    role,
    permissions: []
  });
}

export function genDraftReport() {
  return Object.assign(new DraftReport(), {
    category: randomstring.generate(),
    subcategories: [genSubcategory()],
    detailInputValues: [],
    company: genCompanySearchResult(),
    uploadedFiles: [],
    consumer: genConsumer(),
    employeeConsumer: false,
    contactAgreement: oneBoolean
  });
}

export function genReport() {
  return Object.assign(new Report(), {
    id: randomstring.generate(),
    category: randomstring.generate(),
    subcategories: [genSubcategory()],
    detailInputValues: [],
    company: genCompany(),
    uploadedFiles: [],
    consumer: genConsumer(),
    employeeConsumer: false,
    contactAgreement: oneBoolean,
    creationDate: new Date(),
    status: oneOf(status)
  });
}

export function genConsumer() {
  return Object.assign(new Consumer(), {
    firstName: oneOf(firstNames),
    lastName: oneOf(lastNames),
    email: randomstring.generate()
  });
}

export function genCompanySearchResult() {
  return Object.assign(new CompanySearchResult(), {
    name: randomstring.generate(),
    postalCode: randomstring.generate({
      length: 5,
      charset: 'numeric'
    })
  });
}

export function genCompany() {
  return <Company>{
    id: randomstring.generate(),
    name: randomstring.generate(),
    siret: genSiret()
  };
}

export function genSubcategory() {
  return Object.assign(new Subcategory(), {
    title: randomstring.generate()
  });
}
