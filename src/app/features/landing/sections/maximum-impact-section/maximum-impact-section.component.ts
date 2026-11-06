import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BrandStore } from '../../../../core/store/brand.store';
import { OptimizedImageComponent } from '../../../../shared/components/optimized-image/optimized-image.component';
import { PillButtonComponent } from '../../../../shared/components/pill-button/pill-button.component';
import { SectionMetaComponent } from '../../../../shared/components/section-meta/section-meta.component';

@Component({
  selector: 'app-maximum-impact-section',
  standalone: true,
  imports: [PillButtonComponent, SectionMetaComponent, OptimizedImageComponent],
  templateUrl: './maximum-impact-section.component.html',
  styleUrl: './maximum-impact-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaximumImpactSectionComponent {
  private readonly brandStore = inject(BrandStore);

  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly content = this.brandStore.maximumImpact;

  protected readonly frameTransform = computed(() => {
    const p = this.progress();
    const scale = 0.94 + p * 0.06;
    return `scale(${scale.toFixed(3)})`;
  });

  onShopNow(): void {
    this.brandStore.triggerShopAction('Maximum Impact');
  }
}
