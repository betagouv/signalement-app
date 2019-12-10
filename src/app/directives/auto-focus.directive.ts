import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

    @Input('appAutofocus') autofocus = true;

    public constructor(private el: ElementRef) {
    }

    public ngAfterViewInit() {
      if (this.autofocus) {
        setTimeout(() => {
          this.el.nativeElement.focus();
        });
      }
    }

}
