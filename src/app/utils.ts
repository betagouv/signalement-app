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
  Test1 = 'Test1'
}
