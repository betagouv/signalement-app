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
    if (!this.keywords) {
      this.keywords = deserialize(KeywordList, keywords).list;
    }
    return this.keywords;
  }

  // injection de dépendances (pour les tests uniquement)
  setKeywords(words) {
    this.keywords = deserialize(KeywordList, words).list;
  }

  search(text) {

    if (text) {
      for (let i = 0; i < this.keywords.length; i++) {
        const keywordsCategory = this.keywords[i];
        const found = keywordsCategory.words.map(word => ({
          word,
          result: new RegExp(word).exec(text)
        })).filter(elt => elt.result && elt.result.length > 0)
          .map(elt => ({
            expression: elt.result[0],
            index: elt.result.index
          }));

        if (found && found.length > 0) {
          return {
            categoryId: keywordsCategory.categoryId,
            found
          }
        }
      }
    }

    return null;
    
  }

}
