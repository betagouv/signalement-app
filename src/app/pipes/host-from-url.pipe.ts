import { Pipe, PipeTransform } from '@angular/core';
import Utils from '../utils/utils';

@Pipe({
  name: 'hostFromUrl'
})
export class HostFromUrlPipe implements PipeTransform {

  transform = Utils.getHostFromUrl;
}
