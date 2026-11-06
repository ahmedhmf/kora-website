import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BrandStore } from '../../../../core/store/brand.store';
import { OptimizedImageComponent } from '../../../../shared/components/optimized-image/optimized-image.component';
import { OrbitalGraphicComponent } from '../../../../shared/components/orbital-graphic/orbital-graphic.component';
import { SectionMetaComponent } from '../../../../shared/components/section-meta/section-meta.component';

@Component({
  selector: 'app-inner-power-section',
  standalone: true,
  imports: [OrbitalGraphicComponent, SectionMetaComponent, OptimizedImageComponent],
  templateUrl: './inner-power-section.component.html',
  styleUrl: './inner-power-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InnerPowerSectionComponent {
  private readonly brandStore = inject(BrandStore);

  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly content = this.brandStore.innerPower;
  protected readonly isLowBandwidth = this.brandStore.isLowBandwidth;

  protected readonly imageTransform = computed(() => {
    const p = this.progress();
    const scale = 1.08 - p * 0.08;
    const shiftX = (1 - p) * -18;
    return `scale(${scale.toFixed(3)}) translate3d(${shiftX.toFixed(1)}px, 0, 0)`;
  });
}
