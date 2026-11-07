import { Injectable } from '@angular/core';
import { createSignalStore } from './signal-store';

export interface SectionDescriptor {
  readonly id: string;
  readonly index: number;
  readonly title: string;
}

export interface ScrollState {
  readonly sections: readonly SectionDescriptor[];
  readonly activeSectionIndex: number;
  readonly scrollProgress: number;
  readonly sectionProgressMap: Readonly<Record<number, number>>;
  readonly visitedIndices: readonly number[];
  readonly pendingScrollTarget: number | null;
}

const INITIAL_SECTIONS: readonly SectionDescriptor[] = [
  { id: 'hero', index: 0, title: 'Hero' },
  { id: 'dna', index: 1, title: 'DNA' },
  { id: 'identity', index: 2, title: 'Identity' },
  { id: 'footballs', index: 3, title: 'Footballs' },
  { id: 'handball', index: 4, title: 'Handball' },
  { id: 'handball-technology', index: 5, title: 'Handball Technology' },
  { id: 'handball-balls', index: 6, title: 'Handball Balls' },
  { id: 'footer', index: 7, title: 'Contact' },
];

const initialState: ScrollState = {
  sections: INITIAL_SECTIONS,
  activeSectionIndex: 0,
  scrollProgress: 0,
  sectionProgressMap: { 0: 1, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
  visitedIndices: [0],
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
  readonly pendingScrollTarget = this.store.signals.pendingScrollTarget;

  setActiveSection(index: number): void {
    const visited = this.visitedIndices();
    const nextVisited = visited.includes(index) ? visited : [...visited, index];

    this.store.patchState({
      activeSectionIndex: index,
      visitedIndices: nextVisited,
    });
  }

  updateScrollMetrics(overallProgress: number, perSectionProgress: Readonly<Record<number, number>>): void {
    const clamped = Math.max(0, Math.min(1, overallProgress));
    this.store.patchState({
      scrollProgress: clamped,
      sectionProgressMap: perSectionProgress,
    });
  }

  requestScrollToSection(index: number): void {
    const maxIndex = this.sections().length - 1;
    const target = Math.max(0, Math.min(maxIndex, index));
    this.store.patchState({
      pendingScrollTarget: target,
    });
  }

  clearPendingScrollTarget(): void {
    this.store.patchState({ pendingScrollTarget: null });
  }

}
