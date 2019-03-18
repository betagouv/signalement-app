import { JsonProperty } from 'json-typescript-mapper';

export class Keyword {
  @JsonProperty('category')
  category: string;
  @JsonProperty({ name: 'words'})
  words?: string[];

  constructor() {
    this.category = undefined;
    this.words = undefined;
  }
}

export class KeywordList {
  @JsonProperty({ name: 'list', clazz: Keyword })
  list: Keyword[];

  constructor() {
    this.list = undefined;
  }
}
