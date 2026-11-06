import { computed, Injectable, Signal } from '@angular/core';
import { SectionDescriptor } from '../models/brand.models';
import { createSignalStore } from './signal-store';

export interface ScrollState {
  readonly sections: readonly SectionDescriptor[];
  readonly activeSectionIndex: number;
  readonly scrollProgress: number;
  readonly sectionProgressMap: Readonly<Record<number, number>>;
  readonly visitedIndices: readonly number[];
  readonly scrollDirection: 'up' | 'down';
  readonly isMobileMenuOpen: boolean;
  readonly pendingScrollTarget: number | null;
}

const INITIAL_SECTIONS: readonly SectionDescriptor[] = [
  { id: 'hero', index: 0, numberLabel: '00', codeLabel: 'OX — 00', title: 'Unstoppable' },
  { id: 'inner-power', index: 1, numberLabel: '01', codeLabel: '01 / 04', title: 'Inner Power' },
  { id: 'peak-performance', index: 2, numberLabel: '02', codeLabel: '02 / 04', title: 'Peak Performance' },
  { id: 'maximum-impact', index: 3, numberLabel: '03', codeLabel: '03 / 04', title: 'Maximum Impact' },
  { id: 'beyond-limits', index: 4, numberLabel: '04', codeLabel: '04 / 04', title: 'Beyond Limits' },
  { id: 'handball-products', index: 5, numberLabel: '05', codeLabel: '05 / 06', title: 'Handball Products' },
  { id: 'footer', index: 6, numberLabel: '06', codeLabel: 'KORA — END', title: 'Newsletter' },
];

const initialState: ScrollState = {
  sections: INITIAL_SECTIONS,
  activeSectionIndex: 0,
  scrollProgress: 0,
  sectionProgressMap: { 0: 1, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  visitedIndices: [0],
  scrollDirection: 'down',
  isMobileMenuOpen: false,
  pendingScrollTarget: null,
};

@Injectable({ providedIn: 'root' })
export class ScrollStore {
  private readonly store = createSignalStore<ScrollState>(initialState);

  readonly sections = this.store.signals.sections;
  readonly activeSectionIndex = this.store.signals.activeSectionIndex;
  readonly scrollProgress = this.store.signals.scrollProgress;
  readonly sectionProgressMap = this.store.signals.sectionProgressMap;
  readonly visitedIndices = this.store.signals.visitedIndices;
  readonly scrollDirection = this.store.signals.scrollDirection;
  readonly isMobileMenuOpen = this.store.signals.isMobileMenuOpen;
  readonly pendingScrollTarget = this.store.signals.pendingScrollTarget;

  readonly activeSection: Signal<SectionDescriptor> = computed(() => {
    const list = this.sections();
    const idx = this.activeSectionIndex();
    return list[idx] ?? list[0];
  });

  readonly isNavbarCompact: Signal<boolean> = computed(() => this.activeSectionIndex() > 0);

  isSectionActive(index: number): Signal<boolean> {
    return computed(() => this.activeSectionIndex() === index);
  }

  isSectionVisited(index: number): Signal<boolean> {
    return computed(() => this.visitedIndices().includes(index));
  }

  getSectionProgress(index: number): Signal<number> {
    return computed(() => this.sectionProgressMap()[index] ?? 0);
  }

  setActiveSection(index: number): void {
    const current = this.activeSectionIndex();
    const visited = this.visitedIndices();
    const nextVisited = visited.includes(index) ? visited : [...visited, index];

    this.store.patchState({
      activeSectionIndex: index,
      scrollDirection: index >= current ? 'down' : 'up',
      visitedIndices: nextVisited,
    });
  }

  updateScrollMetrics(overallProgress: number, perSectionProgress: Readonly<Record<number, number>>): void {
    const prev = this.scrollProgress();
    const clamped = Math.max(0, Math.min(1, overallProgress));
    this.store.patchState({
      scrollProgress: clamped,
      sectionProgressMap: perSectionProgress,
      scrollDirection: clamped >= prev ? 'down' : 'up',
    });
  }

  requestScrollToSection(index: number): void {
    const maxIndex = this.sections().length - 1;
    const target = Math.max(0, Math.min(maxIndex, index));
    this.store.patchState({
      pendingScrollTarget: target,
      isMobileMenuOpen: false,
    });
  }

  clearPendingScrollTarget(): void {
    this.store.patchState({ pendingScrollTarget: null });
  }

  toggleMobileMenu(): void {
    this.store.patchState((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen }));
  }

  closeMobileMenu(): void {
    this.store.patchState({ isMobileMenuOpen: false });
  }
}
