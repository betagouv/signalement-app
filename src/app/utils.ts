export default class Utils {
  static textOverflowMiddleCropping(text: string, limit: number) {
    return text.length > limit ? `${text.substr(0, limit / 2)}...${text.substr(text.length - (limit / 2), text.length)}` : text;
  }

  static scrollToElement($element): void {
    $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

}

export const SVETestingScope = 'TestSVE';
export enum SVETestingVersions {
  NoTest = 'NoTest',
  Test3_Sentence1 = 'Test3_Sentence1',
  Test3_Sentence2 = 'Test3_Sentence2',
  Test3_Sentence3 = 'Test3_Sentence3',
  Test3_Sentence4 = 'Test3_Sentence4',
  Test3_Sentence5 = 'Test3_Sentence5'
}

export const mobileHeaderHeight = 156;
export const mobileFooterHeight = 208;
export const mobileMaxWidth = 575;
