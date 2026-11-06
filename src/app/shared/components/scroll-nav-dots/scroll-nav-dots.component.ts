import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScrollStore } from '../../../core/store/scroll.store';

@Component({
  selector: 'app-scroll-nav-dots',
  standalone: true,
  templateUrl: './scroll-nav-dots.component.html',
  styleUrl: './scroll-nav-dots.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollNavDotsComponent {
  protected readonly scrollStore = inject(ScrollStore);

  onSelectSection(index: number): void {
    this.scrollStore.requestScrollToSection(index);
  }
}
