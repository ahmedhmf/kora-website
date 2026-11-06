import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { BrandStore } from '../../../../core/store/brand.store';
import { ScrollStore } from '../../../../core/store/scroll.store';
import { BrandLogoComponent } from '../../../../shared/components/brand-logo/brand-logo.component';
import { OptimizedImageComponent } from '../../../../shared/components/optimized-image/optimized-image.component';
import { SpotlightCardComponent } from '../../../../shared/components/spotlight-card/spotlight-card.component';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [BrandLogoComponent, SpotlightCardComponent, OptimizedImageComponent],
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSectionComponent {
  private readonly brandStore = inject(BrandStore);
  private readonly scrollStore = inject(ScrollStore);

  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly content = this.brandStore.footer;
  protected readonly isLowBandwidth = this.brandStore.isLowBandwidth;

  onNavigate(sectionIndex?: number): void {
    if (sectionIndex !== undefined) {
      this.scrollStore.requestScrollToSection(sectionIndex);
    }
  }

  onExploreSeries(): void {
    this.brandStore.triggerShopAction('Aero-Zero Lookbook');
  }
}
