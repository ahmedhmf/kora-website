import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-peak-performance-section',
  standalone: true,
  imports: [],
  templateUrl: './peak-performance-section.component.html',
  styleUrl: './peak-performance-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeakPerformanceSectionComponent {
  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly rightPortraitTransform = computed(() => {
    const p = this.progress();
    const scale = 1.07 - p * 0.07;
    const translateY = (1 - p) * 20;
    return `scale(${scale.toFixed(3)}) translate3d(0, ${translateY.toFixed(1)}px, 0)`;
  });
}
