import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  imports: [],
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSectionComponent {

  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

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
