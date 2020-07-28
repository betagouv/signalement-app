import { isPlatformBrowser } from '@angular/common';

export default class Utils {
  static textOverflowMiddleCropping(text: string, limit: number) {
    return text.length > limit ? `${text.substr(0, limit / 2)}...${text.substr(text.length - (limit / 2), text.length)}` : text;
  }

  static scrollToElement($element): void {
    $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  static isSmallerThanDesktop(platformId) {
    return isPlatformBrowser(platformId) && window && window.innerWidth < desktopMinWidth;
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

export const desktopMinWidth = 992;
