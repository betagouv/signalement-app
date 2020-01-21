import { Roles, User } from '../src/app/model/AuthUser';

const randomstring = require('randomstring');

export function oneOf(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function genSiret() {
  return String(Math.floor(Math.random() * Math.floor(99999999999999)));
}

export const lastNames = ['Doe', 'Durand', 'Dupont'];
export const firstNames = ['Alice', 'Bob', 'Charles', 'Danièle', 'Émilien', 'Fanny', 'Gérard'];
export const roles = [Roles.Admin, Roles.Pro, Roles.DGCCRF];

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
