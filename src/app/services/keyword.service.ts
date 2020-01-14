import { Injectable } from '@angular/core';

import keywords from '../../assets/data/keywords.json';
import { Keyword } from '../model/Keyword';

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
      this.keywords = keywords.list;
    }
    return this.keywords;
  }

  // injection de dépendances (pour les tests uniquement)
  setKeywords(words) {
    this.keywords = words.list;
  }

  search(text: string, activeCategoryId: string) {

    if (text) {
      const keywordsToSearch = this.keywords
        .filter(keyword => keyword.filteredCategories && keyword.filteredCategories.includes(activeCategoryId));
      for (let i = 0; i < keywordsToSearch.length; i++) {
        const keyword = this.keywords[i];
        const found = keyword.words
          .map(word => ({
            word,
            result: new RegExp(word).exec(text)
          }))
          .filter(elt => elt.result && elt.result.length > 0)
          .map(elt => ({
            expression: elt.result[0],
            index: elt.result.index
          }));

        if (found && found.length > 0) {
          return {
            keyword ,
            found
          };
        }
      }
    }
    return null;
  }

}
