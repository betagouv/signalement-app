import { isPlatformBrowser } from '@angular/common';
import format from 'date-fns/format';
import parseJSON from 'date-fns/parseJSON';

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

  static cleanObject = <T extends object>(obj: T): Partial<T> | undefined => {
    const cleanedObj = Object.entries(obj)
      .filter(([, _]) => _ !== undefined && _ !== null && _ !== '' && (!Array.isArray(_) || !!_.filter(v => v !== undefined).length))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
  };

  static mapDate = (date: string): string => format(parseJSON(date), 'yyyy-MM-dd');

  static uniqueValues = <T>(array: T[]): T[] => Array.from(new Set(array));

  static sanitizePhoneNumber = (phoneNumber?: string): string => phoneNumber?.replace(/[^\+0-9]/g, '');
}

export const desktopMinWidth = 992;
