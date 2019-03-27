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
        "esclavage",
      ],
      "category": "Travail au noir",
      "categoryId": "TRAVAIL_AU_NOIR"
    }
  ]
};
/* tslint:enable:quotemark */

let service: KeywordService;

describe('KeywordServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(KeywordService);
    service.setKeywords(data);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should found a keyword', () => {

    const service: KeywordService = TestBed.get(KeywordService);

    const expected = JSON.stringify({
      categoryId: 'TRAVAIL_AU_NOIR',
      found: [{
        expression: "esclave",
        index: 31
      }]
    });

    const res = JSON.stringify(service.search('j\'ai été témoin d\'un travail d\'esclave'));

    expect(res).toBe(expected);
  });

  it('should found multiple keywords', () => {

    const service: KeywordService = TestBed.get(KeywordService);

    const expected = JSON.stringify({
      categoryId: 'TRAVAIL_AU_NOIR',
      found: [{
        expression: "immigré",
        index: 47
      }, {
        expression: "esclave",
        index: 31
      }]
    });

    const res = JSON.stringify(service.search('j\'ai été témoin d\'un travail d\'esclave avec un immigré qui travaillait là bas.'));

    expect(res).toBe(expected);
  });

  it('should not found a keyword', () => {

    const service: KeywordService = TestBed.get(KeywordService);
    service.setKeywords(data);

    expect(service.search('Je viens faire un signalement sur l\'hygiène d\'un restaurant')).toBeNull();
  });
});
