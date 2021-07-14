import { IsForeignPipe } from './company.pipe';
import { genCompany } from '../../../test/fixtures.spec';
import { Company } from '../model/Company';

describe('CompanyPipe', () => {
  let pipe: IsForeignPipe;

  beforeEach(() => {
    pipe = new IsForeignPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should be false if company country is undefined', () => {
    const company: Company = { ...genCompany(), address: {country: undefined }};
    expect(pipe.transform(company)).toBeFalse();
  });

  it('should be false if company country is France', () => {
    const company: Company = { ...genCompany(), address: {country: 'France' }};
    expect(pipe.transform(company)).toBeFalse();
  });

  it('should be true if company country is not France', () => {
    const company: Company = { ...genCompany(), address: {country: 'Italie' }};
    expect(pipe.transform(company)).toBeTrue();
  });
});
