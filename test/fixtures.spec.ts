import { DraftReport, ReportStatus, Step } from '../src/app/model/Report';
import { Consumer } from '../src/app/model/Consumer';
import { Information, Subcategory } from '../src/app/model/Anomaly';
import { Company, CompanySearchResult, ViewableCompany } from '../src/app/model/Company';
import anomalies from '../src/assets/data/anomalies.json';

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

export function genPhone() {
  return randomstring.generate({
    length: 10,
    charset: 'numeric'
  });
}

export function genEmail() {
  return randomstring.generate({
    length: 10,
    charset: 'alphabetic'
  }) + '@' + randomstring.generate({
    length: 10,
    charset: 'alphabetic'
  }) ;
}

export const lastNames = ['Doe', 'Durand', 'Dupont'];
export const firstNames = ['Alice', 'Bob', 'Charles', 'Danièle', 'Émilien', 'Fanny', 'Gérard'];
export const status = [ReportStatus.InProgress, ReportStatus.ClosedForPro];

export const genViewableCompany = (): ViewableCompany => ({
  siret: genSiret(),
  postalCode: randomstring.generate(),
  closed: false,
});

export function genCompanyAccessLevel(siret?: string) {
  return {
    ...genCompany(),
    ...(siret ? {siret} : {}),
    level: oneOf(['admin', 'member'])
  };
}

export function genDraftReport(lastStep: Step) {
  const stepOrder = [
    Step.Category,
    Step.Problem,
    Step.Information,
    Step.Details,
    Step.Company,
    Step.Consumer,
    Step.Confirmation,
    Step.Acknowledgment
  ];
  const draftReport = new DraftReport();
  if (stepOrder.indexOf(lastStep) >= stepOrder.indexOf(Step.Category)) {
    draftReport.category = oneOf(anomalies.list.filter(anomaly => !anomaly.information).map(anomaly => anomaly.category));
  }
  if (stepOrder.indexOf(lastStep) >= stepOrder.indexOf(Step.Problem)) {
    draftReport.subcategories = [genSubcategory()];
  }
  if (stepOrder.indexOf(lastStep) >= stepOrder.indexOf(Step.Details)) {
    draftReport.employeeConsumer = oneBoolean();
    draftReport.detailInputValues = [];
    draftReport.uploadedFiles = [];
  }
  if (stepOrder.indexOf(lastStep) >= stepOrder.indexOf(Step.Company)) {
    draftReport.draftCompany = genCompanySearchResult();
  }
  if (stepOrder.indexOf(lastStep) >= stepOrder.indexOf(Step.Consumer)) {
    draftReport.consumer = genConsumer();
    draftReport.contactAgreement = oneBoolean();
  }
  return draftReport;
}

export function genConsumer() {
  return Object.assign(new Consumer(), {
    firstName: oneOf(firstNames),
    lastName: oneOf(lastNames),
    email: genEmail()
  });
}

export function genCompanySearchResult() {
  return <CompanySearchResult>{
    name: randomstring.generate(),
    address: {
      number: randomstring.generate(),
      street: randomstring.generate(),
      city: randomstring.generate(),
      postalCode: randomstring.generate({
        length: 5,
        charset: 'numeric'
      })
    },
  };
}

export function genCompany() {
  return <Company>{
    id: randomstring.generate(),
    name: randomstring.generate(),
    siret: genSiret()
  };
}

export function genSubcategory() {
  return <Subcategory>{
    title: randomstring.generate(),
    tags: oneOf([null, [randomstring.generate()], [randomstring.generate(), randomstring.generate()]])
  };
}

export function genInformation() {
  return <Information>{
    title: randomstring.generate()
  };
}
