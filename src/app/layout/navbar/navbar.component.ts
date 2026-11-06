import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BrandStore } from '../../core/store/brand.store';
import { ScrollStore } from '../../core/store/scroll.store';
import { BrandLogoComponent } from '../../shared/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [BrandLogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly brandStore = inject(BrandStore);
  protected readonly scrollStore = inject(ScrollStore);

  onLogoClick(): void {
    this.scrollStore.requestScrollToSection(0);
  }

  onNavClick(itemId: string, targetIndex: number): void {
    this.brandStore.selectCategory(itemId);
    this.scrollStore.requestScrollToSection(targetIndex);
  }

  onToggleMenu(): void {
    this.scrollStore.toggleMobileMenu();
  }
}
