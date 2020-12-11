import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Utils from '../utils';

declare var jQuery: any;

@Injectable({
  providedIn: 'root'
})
export class RendererService {

  private renderer: Renderer2;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  scrollToElement($element) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const rect = $element.getBoundingClientRect();
        if (Utils.isSmallerThanDesktop(this.platformId) && rect.height < window.innerHeight) {
          this.renderer.setStyle($element, 'margin-bottom', `${window.innerHeight - rect.height - 110}px`);
        }
        jQuery('html, body').animate({
          scrollTop: this.offsetTop($element) - 50
        }, 1000, 'linear');
      }, 500);
    }
  }

  offsetTop($element) {
    return $element.offsetTop + ($element.offsetParent ? this.offsetTop($element.offsetParent) : 0);
  }

  scrollToElementEnd($element) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const rect = $element.getBoundingClientRect();
        if (rect.bottom + 110 > window.innerHeight) {
          jQuery('html, body').animate({
            scrollTop: this.offsetTop($element) + rect.height + 110 - window.innerHeight
          }, 1000, 'linear');
        }
      }, 500);
    }
  }

  getRadioContainerClass(input: any, value: any) {
    return input === value ? 'selected' : '';
  }
}
