import { TestBed } from '@angular/core/testing';

import { KeywordService } from './keyword.service';

const data = {
  'list': [
    {
      'words': [
        'au noir',
        'au black',
        'sans papier',
        'immigré',
        'immigre',
        'travail dissimulé',
        'travail dissimule',
        'esclave',
        'esclavage',
      ],
      'redirectCategory': 'TNOIR',
      'filteredCategories': [
        'CR',
        'MAG'
      ],
      'message': 'Vous pensez que l\'entreprise emploie des gens au noir?'
    }
  ]
};

let service: KeywordService;

describe('KeywordServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeywordService);
    service.setKeywords(data);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should found a keyword on a category to be filtered', () => {

    const keywordService: KeywordService = TestBed.inject(KeywordService);

    const expected = {
      keyword: data.list[0],
      found: [{
        expression: 'esclave',
        index: 31
      }]
    };

    const res = keywordService.search('j\'ai été témoin d\'un travail d\'esclave', 'CR');

    expect(res).toEqual(expected);
  });

  it('should not found a keyword on a category not to be filtered', () => {

    const keywordService: KeywordService = TestBed.inject(KeywordService);

    const res = keywordService.search('j\'ai été témoin d\'un travail d\'esclave', 'TEL');

    expect(res).toBeNull();
  });

  it('should found multiple keywords', () => {

    const keywordService: KeywordService = TestBed.inject(KeywordService);

    const expected = {
      keyword: data.list[0],
      found: [{
        expression: 'immigré',
        index: 47
      }, {
        expression: 'esclave',
        index: 31
      }]
    };

    const res = keywordService.search('j\'ai été témoin d\'un travail d\'esclave avec un immigré qui travaillait là bas.', 'CR');

    expect(res).toEqual(expected);
  });

  it('should not found a keyword', () => {

    const keywordService: KeywordService = TestBed.inject(KeywordService);
    keywordService.setKeywords(data);

    expect(keywordService.search('Je viens faire un signalement sur l\'hygiène d\'un restaurant', 'CR')).toBeNull();
  });
});
