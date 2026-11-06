import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BrandStore } from '../../../../core/store/brand.store';
import { OptimizedImageComponent } from '../../../../shared/components/optimized-image/optimized-image.component';
import { PillButtonComponent } from '../../../../shared/components/pill-button/pill-button.component';
import { SectionMetaComponent } from '../../../../shared/components/section-meta/section-meta.component';

@Component({
  selector: 'app-beyond-limits-section',
  standalone: true,
  imports: [PillButtonComponent, SectionMetaComponent, OptimizedImageComponent],
  templateUrl: './beyond-limits-section.component.html',
  styleUrl: './beyond-limits-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeyondLimitsSectionComponent {
  private readonly brandStore = inject(BrandStore);

  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly content = this.brandStore.beyondLimits;

  protected readonly portraitOffset = computed(() => {
    const p = this.progress();
    const y = (1 - p) * 26;
    return `translate3d(0, ${y.toFixed(1)}px, 0)`;
  });

  onShopNow(): void {
    this.brandStore.triggerShopAction('Zero Gravity Tech');
  }
}
