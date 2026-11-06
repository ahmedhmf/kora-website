import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { BrandStore } from '../../../../core/store/brand.store';
import { OptimizedImageComponent } from '../../../../shared/components/optimized-image/optimized-image.component';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [OptimizedImageComponent],
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSectionComponent {
  private readonly brandStore = inject(BrandStore);

  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly content = this.brandStore.footer;
  protected readonly email = signal('');
  protected readonly consented = signal(false);
  protected readonly message = signal('');

  onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
    this.message.set('');
  }

  onConsentChange(event: Event): void {
    this.consented.set((event.target as HTMLInputElement).checked);
    this.message.set('');
  }

  onSubscribe(event: Event): void {
    event.preventDefault();
    if (!this.consented() || !this.email().trim()) return;
    this.message.set('Newsletter subscriptions are not connected yet. Please check back soon.');
  }
}
