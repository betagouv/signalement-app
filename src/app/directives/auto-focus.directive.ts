import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

    public constructor(private el: ElementRef) {
    }

    public ngAfterViewInit() {
        window.setTimeout(() => {
            this.el.nativeElement.focus();
        });

    }

}
