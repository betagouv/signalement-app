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

  static cleanObject = <T extends object>(obj: T): Partial<T> => {
    return Object.entries(obj)
      .filter(([, _]) =>
        _ !== undefined &&
        _ !== null &&
        _ !== '' &&
        (!Array.isArray(_) || !!_.filter(v => v !== undefined).length)
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  };

  static readonly dateToApi = (date?: Date): string | undefined => date ? format(parseJSON(date), 'yyyy-MM-dd') : undefined;

  static readonly apiToDate = (date?: string): Date | undefined => {
    if (date) {
      const [year, month, day] = date.split('-');
      return new Date(+year, +month - 1, +day);
    }
  };

  static uniqueValues = <T>(array: T[]): T[] => Array.from(new Set(array));

  static getHostFromUrl = (url?: string) => {
    return url
      ?.replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .split(/[/?#]/)[0];
  }

  static sanitizePhoneNumber = (phoneNumber?: string): string => phoneNumber?.replace(/[^\+0-9]/g, '');
}

export const desktopMinWidth = 992;
