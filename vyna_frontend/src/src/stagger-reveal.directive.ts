import {
  AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appStaggerReveal]'
})
export class StaggerRevealDirective implements AfterViewInit, OnChanges, OnDestroy {
  /** Delay between lines in ms */
  @Input() stagger = 120;
  /** Animation duration in ms (kept in CSS but used for replay timing if needed) */
  @Input() duration = 700;
  /** Intersection threshold (0..1) */
  @Input() threshold = 0.15;
  /** Change this value to retrigger animation after content updates */
  @Input() animKey: any;

  private io?: IntersectionObserver;
  private hasRevealed = false;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.setup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('animKey' in changes && !changes['animKey'].firstChange) {
      // content changed -> reset + re-setup
      this.reset();
      this.teardown();
      this.setup();
    }
  }

  private setup() {
    const el = this.host.nativeElement;
    const children = Array.from(el.children) as HTMLElement[];

    // Initial hidden state (in case of dynamic additions)
    children.forEach((c) => {
      c.classList.remove('reveal-line');
      c.style.opacity = '0';
      c.style.transform = 'translateY(14px)';
    });

    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasRevealed) {
            this.hasRevealed = true;
            // Stagger apply
            children.forEach((child, i) => {
              // set animation delay individually
              child.style.animationDelay = `${i * this.stagger}ms`;
              child.classList.add('reveal-line');
            });
            this.io?.disconnect();
          }
        });
      },
      { threshold: this.threshold }
    );

    this.io.observe(el);
  }

  private reset() {
    this.hasRevealed = false;
    const el = this.host.nativeElement;
    const children = Array.from(el.children) as HTMLElement[];
    children.forEach((c) => {
      c.classList.remove('reveal-line');
      c.style.removeProperty('animation-delay');
      c.style.opacity = '0';
      c.style.transform = 'translateY(14px)';
    });
  }

  private teardown() {
    this.io?.disconnect();
    this.io = undefined;
  }

  ngOnDestroy(): void {
    this.teardown();
  }
}
