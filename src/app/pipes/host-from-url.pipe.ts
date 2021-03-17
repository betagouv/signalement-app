import { Pipe, PipeTransform } from '@angular/core';
import Utils from '../utils';

@Pipe({
  name: 'hostFromUrl'
})
export class HostFromUrlPipe implements PipeTransform {

  transform = Utils.getHostFromUrl;
}
