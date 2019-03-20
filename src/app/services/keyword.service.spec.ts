import { TestBed } from '@angular/core/testing';

import { KeywordService } from './keyword.service';

/* tslint:disable:quotemark */
const data = {
  "list": [
    {
      "words": [
        "au noir",
        "au black",
        "sans papier",
        "immigré",
        "immigre",
        "travail dissimulé",
        "travail dissimule",
        "esclave",
        "esclavage"
      ],
      "category": "Travail au noir"
    }
  ]
};
/* tslint:enable:quotemark */

describe('KeywordServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeywordService = TestBed.get(KeywordService);
    expect(service).toBeTruthy();
  });

  it('should found a keyword', () => {

    const service: KeywordService = TestBed.get(KeywordService);
    service.setKeywords(data);
    expect(service.search('j\'ai été témoin d\'un travail d\'esclave')).toBe('Travail au noir');
  });

  it('should not found a keyword', () => {

    const service: KeywordService = TestBed.get(KeywordService);
    service.setKeywords(data);
    expect(service.search('Je viens faire un signalement sur l\'hygiène d\'un restaurant')).toBeNull();
  });
});
