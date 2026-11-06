import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BrandStore } from '../../../../core/store/brand.store';
import { OptimizedImageComponent } from '../../../../shared/components/optimized-image/optimized-image.component';
import { OrbitalGraphicComponent } from '../../../../shared/components/orbital-graphic/orbital-graphic.component';
import { SectionMetaComponent } from '../../../../shared/components/section-meta/section-meta.component';

@Component({
  selector: 'app-peak-performance-section',
  standalone: true,
  imports: [OrbitalGraphicComponent, SectionMetaComponent, OptimizedImageComponent],
  templateUrl: './peak-performance-section.component.html',
  styleUrl: './peak-performance-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeakPerformanceSectionComponent {
  private readonly brandStore = inject(BrandStore);

  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly content = this.brandStore.peakPerformance;
  protected readonly isLowBandwidth = this.brandStore.isLowBandwidth;

  protected readonly rightPortraitTransform = computed(() => {
    const p = this.progress();
    const scale = 1.07 - p * 0.07;
    const translateY = (1 - p) * 20;
    return `scale(${scale.toFixed(3)}) translate3d(0, ${translateY.toFixed(1)}px, 0)`;
  });
}
