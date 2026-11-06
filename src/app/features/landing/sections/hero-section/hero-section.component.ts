import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BrandStore } from '../../../../core/store/brand.store';
import { OptimizedImageComponent } from '../../../../shared/components/optimized-image/optimized-image.component';
import { OrbitalGraphicComponent } from '../../../../shared/components/orbital-graphic/orbital-graphic.component';
import { PillButtonComponent } from '../../../../shared/components/pill-button/pill-button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [OrbitalGraphicComponent, PillButtonComponent, OptimizedImageComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {
  private readonly brandStore = inject(BrandStore);

  readonly isActive = input<boolean>(true);
  readonly progress = input<number>(1);

  protected readonly content = this.brandStore.hero;

  protected readonly parallaxTransform = computed(() => {
    const p = this.progress();
    const offset = (1 - p) * 28;
    const scale = 1 + (1 - p) * 0.05;
    return `translate3d(0, ${offset.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
  });

  onShopNow(): void {
    this.brandStore.triggerShopAction('Unstoppable Hero');
  }
}
