import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ScrollStore } from '../../../core/store/scroll.store';
import { NavbarComponent } from '../../../layout/navbar/navbar.component';
import { ScrollNavDotsComponent } from '../../../shared/components/scroll-nav-dots/scroll-nav-dots.component';
import { BeyondLimitsSectionComponent } from '../sections/beyond-limits-section/beyond-limits-section.component';
import { FooterSectionComponent } from '../sections/footer-section/footer-section.component';
import { HeroSectionComponent } from '../sections/hero-section/hero-section.component';
import { InnerPowerSectionComponent } from '../sections/inner-power-section/inner-power-section.component';
import { MaximumImpactSectionComponent } from '../sections/maximum-impact-section/maximum-impact-section.component';
import { PeakPerformanceSectionComponent } from '../sections/peak-performance-section/peak-performance-section.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    NavbarComponent,
    ScrollNavDotsComponent,
    HeroSectionComponent,
    InnerPowerSectionComponent,
    PeakPerformanceSectionComponent,
    MaximumImpactSectionComponent,
    BeyondLimitsSectionComponent,
    FooterSectionComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  protected readonly scrollStore = inject(ScrollStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly scrollContainerRef = viewChild<ElementRef<HTMLElement>>('scrollContainer');
  private readonly sectionRefs = viewChildren<ElementRef<HTMLElement>>('sectionSlot');

  constructor() {
    effect(() => {
      const targetIndex = this.scrollStore.pendingScrollTarget();
      if (targetIndex === null) {
        return;
      }

      const slots = this.sectionRefs();
      const targetEl = slots[targetIndex]?.nativeElement;
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.scrollStore.setActiveSection(targetIndex);
      }
      this.scrollStore.clearPendingScrollTarget();
    });

    afterNextRender(() => {
      this.setupIntersectionObserver();
    });
  }

  protected isSectionRevealed(index: number): boolean {
    return (
      this.scrollStore.activeSectionIndex() === index ||
      this.scrollStore.visitedIndices().includes(index)
    );
  }

  protected getSectionProgress(index: number): number {
    return this.scrollStore.sectionProgressMap()[index] ?? 0;
  }

  protected onContainerScroll(): void {
    const container = this.scrollContainerRef()?.nativeElement;
    if (!container) {
      return;
    }

    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight || 1;
    const maxScroll = Math.max(1, container.scrollHeight - viewportHeight);
    const overallProgress = scrollTop / maxScroll;

    const slots = this.sectionRefs();
    const progressMap: Record<number, number> = {};
    let mostVisibleIndex = this.scrollStore.activeSectionIndex();
    let bestVisibility = -1;

    slots.forEach((slotRef, idx) => {
      const rect = slotRef.nativeElement.getBoundingClientRect();
      const visibleHeight =
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const ratio = Math.max(0, Math.min(1, visibleHeight / viewportHeight));
      progressMap[idx] = Number(ratio.toFixed(3));

      if (ratio > bestVisibility) {
        bestVisibility = ratio;
        mostVisibleIndex = idx;
      }
    });

    this.scrollStore.updateScrollMetrics(overallProgress, progressMap);
    if (bestVisibility >= 0.42 && mostVisibleIndex !== this.scrollStore.activeSectionIndex()) {
      this.scrollStore.setActiveSection(mostVisibleIndex);
    }
  }

  @HostListener('window:keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      this.scrollStore.requestScrollToSection(this.scrollStore.activeSectionIndex() + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      this.scrollStore.requestScrollToSection(this.scrollStore.activeSectionIndex() - 1);
    }
  }

  private setupIntersectionObserver(): void {
    const container = this.scrollContainerRef()?.nativeElement;
    const slots = this.sectionRefs();
    if (!container || slots.length === 0 || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const indexAttr = (entry.target as HTMLElement).dataset['sectionIndex'];
          const index = indexAttr ? Number(indexAttr) : -1;
          if (index >= 0 && entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            this.scrollStore.setActiveSection(index);
          }
        }
      },
      {
        root: container,
        threshold: [0.15, 0.35, 0.45, 0.65, 0.85],
      }
    );

    for (const slot of slots) {
      observer.observe(slot.nativeElement);
    }

    this.destroyRef.onDestroy(() => {
      observer.disconnect();
    });
  }
}
