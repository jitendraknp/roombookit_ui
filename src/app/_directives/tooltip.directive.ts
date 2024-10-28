import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive( {
  selector: '[bTooltip]',
  standalone: true
} )
export class TooltipDirective implements AfterViewInit, OnDestroy {

  private tooltip: any;

  constructor( private elementRef: ElementRef, private renderer: Renderer2 ) { }
  @Input() placement = 'top';
  @Input() appTooltip = '';

  ngAfterViewInit (): void {
    const domElement: HTMLElement = this.elementRef.nativeElement;
    domElement.setAttribute( 'title', this.appTooltip );
    domElement.setAttribute( 'data-bs-placement', this.placement );
    // this.tooltip = new bootstrap.Tooltip(domElement);
    // this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-toggle', 'tooltip');
    // this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-placement', this.placement);
    // this.renderer.setAttribute(this.elementRef.nativeElement, 'title', this.appTooltip);
    // new bootstrap.Tooltip(this.elementRef.nativeElement);
  }

  ngOnDestroy (): void {
    this.tooltip.dispose();
  }

}
