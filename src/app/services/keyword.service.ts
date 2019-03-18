import { Injectable } from '@angular/core';

import keywords from '../../assets/data/keywords.json';
import { deserialize } from 'json-typescript-mapper';
import { KeywordList, Keyword } from '../model/Keyword';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {

  keywords: Keyword[];

  constructor() {
    this.keywords = this.getKeywords();
  }

  getKeywords() {
    return deserialize(KeywordList, keywords).list;
  }

  search(text) {

    if (text) {
      for (let i = 0; i < this.keywords.length; i++) {
        const keyword = this.keywords[i];
        if (keyword.words.some(elt => new RegExp(elt).test(text))) {
          return keyword.category;
        }
      }
    }
    return null;
  }

}
