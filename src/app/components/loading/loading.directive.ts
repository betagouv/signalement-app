import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { LoadingComponent } from './loading.component';

@Directive({
  selector: '[appLoading]'
})
export class LoadingDirective implements OnChanges {

  @Input() appLoading = false;

  loaderRef?: ComponentRef<LoadingComponent>;

  constructor(private el: ElementRef,
    private cfResolver: ComponentFactoryResolver,
    private vcRef: ViewContainerRef,
    private renderer: Renderer2) {
  }

  ngOnChanges() {
    if (this.appLoading) {
      this.el.nativeElement.disabled = true;
      this.el.nativeElement.style.setProperty('color', 'transparent', 'important');
      this.el.nativeElement.style.setProperty('position', 'relative', 'important');
      this.showLoader();
    } else {
      this.el.nativeElement.style.color = '';
      this.el.nativeElement.disabled = false;
      this.hideLoader();
    }
  }

  showLoader(): void {
    if (!this.loaderRef) {
      const factory = this.cfResolver.resolveComponentFactory(LoadingComponent);
      this.loaderRef = this.vcRef.createComponent(factory);
      this.renderer.appendChild(this.vcRef.element.nativeElement, this.loaderRef.location.nativeElement);
    }
    this.loaderRef.location.nativeElement.style.visibility = 'visible';
  }

  hideLoader(): void {
    if (!this.loaderRef) {
      return;
    }
    this.loaderRef.location.nativeElement.style.visibility = 'hidden';
  }
}
