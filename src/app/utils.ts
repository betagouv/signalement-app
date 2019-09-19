export default class Utils {
  static textOverflowMiddleCropping(text: string, limit: number) {
    return text.length > limit ? `${text.substr(0, limit / 2)}...${text.substr(text.length - (limit / 2), text.length)}` : text;
  }

  static scrollToElement($element): void {
    $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  static focusAndBlurOnTop() {
    setTimeout(() => {
      const firstElement = document.querySelector('#banner') as HTMLElement;
      if (firstElement) {
        firstElement.focus();
        firstElement.blur();
      }
    });
  }
  static focusAndBlurOnBackButton() {
    setTimeout(() => {
      const backButton: HTMLElement = document.querySelector('#back-button');

      if (backButton) {
        backButton.focus();
        backButton.blur();
      }
    });
  }

}

export const CategoryScope = 'categories';
export enum CategoryVersions {
  V1 = 'V1',
  V2 = 'V2',
}
