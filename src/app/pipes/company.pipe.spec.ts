import { IsForeignPipe } from './company.pipe';
import { genCompany } from '../../../test/fixtures.spec';

describe('CompanyPipe', () => {
  let pipe: IsForeignPipe;

  beforeEach(() => {
    pipe = new IsForeignPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should be false if company country is undefined', () => {
    expect(pipe.transform({ ...genCompany(), country: undefined })).toBeFalse();
  });

  it('should be false if company country is France', () => {
    expect(pipe.transform({ ...genCompany(), country: 'France' })).toBeFalse();
  });

  it('should be true if company country is not France', () => {
    expect(pipe.transform({ ...genCompany(), country: 'Italie' })).toBeTrue();
  });
});
