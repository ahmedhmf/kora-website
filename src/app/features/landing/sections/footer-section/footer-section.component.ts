import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-footer-section',
  standalone: true,
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSectionComponent {
  readonly isActive = input(false);
  readonly progress = input(0);
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly contactMessage = signal('');
  protected readonly status = signal('');
  protected readonly contactSending = signal(false);
  protected readonly newsletterEmail = signal('');
  protected readonly consented = signal(false);
  protected readonly newsletterStatus = signal('');

  protected onNewsletterEmailInput(event: Event): void {
    this.newsletterEmail.set((event.target as HTMLInputElement).value);
    this.newsletterStatus.set('');
  }

  protected onConsentChange(event: Event): void {
    this.consented.set((event.target as HTMLInputElement).checked);
    this.newsletterStatus.set('');
  }

  protected onSubscribe(event: Event): void {
    event.preventDefault();
    if (!this.consented() || !this.newsletterEmail().trim()) return;
    this.newsletterStatus.set('Newsletter subscriptions are not connected yet. Please check back soon.');
  }

  protected onFieldInput(event: Event, field: 'name' | 'email' | 'message'): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (field === 'name') this.name.set(value);
    if (field === 'email') this.email.set(value);
    if (field === 'message') this.contactMessage.set(value);
    this.status.set('');
  }

  protected async onContact(event: Event): Promise<void> {
    event.preventDefault();
    if (this.contactSending()) return;
    this.contactSending.set(true);
    this.status.set('Sending your message…');
    try {
      const response = await fetch('/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name().trim(),
          email: this.email().trim(),
          message: this.contactMessage().trim(),
        }),
      });
      if (!response.ok) throw new Error('Unable to send');
      this.name.set('');
      this.email.set('');
      this.contactMessage.set('');
      this.status.set('Thank you! Your message has been sent.');
    } catch {
      this.status.set('We could not send your message. Please email info@korafc.com directly.');
    } finally {
      this.contactSending.set(false);
    }
  }
}
