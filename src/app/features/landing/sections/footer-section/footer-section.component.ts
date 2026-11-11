import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, input, signal } from '@angular/core';

interface TurnstileApi {
  render(container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void }): string;
  reset(widgetId: string): void;
}

@Component({
  selector: 'app-footer-section',
  standalone: true,
  templateUrl: './footer-section.component.html',
  styleUrl: './footer-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSectionComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private turnstileWidgetId = '';
  private turnstileApi?: TurnstileApi;
  readonly isActive = input(false);
  readonly progress = input(0);
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly contactMessage = signal('');
  protected readonly status = signal('');
  protected readonly contactSending = signal(false);
  protected readonly turnstileToken = signal('');
  protected readonly verificationStatus = signal('Loading spam protection…');
  protected readonly honeypot = signal('');
  protected readonly newsletterEmail = signal('');
  protected readonly consented = signal(false);
  protected readonly newsletterStatus = signal('');

  constructor() {
    afterNextRender(() => { void this.initializeTurnstile(); });
  }

  private async initializeTurnstile(): Promise<void> {
    try {
      const response = await fetch('/turnstile-sitekey.php', { cache: 'no-store' });
      if (!response.ok) throw new Error('Turnstile not configured');
      const config = await response.json() as { siteKey?: string };
      if (!config.siteKey) throw new Error('Turnstile not configured');

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Turnstile unavailable'));
        document.head.appendChild(script);
      });

      const api = (window as Window & { turnstile?: TurnstileApi }).turnstile;
      const container = this.host.nativeElement.querySelector('#kora-contact-turnstile') as HTMLElement | null;
      if (!api || !container) throw new Error('Turnstile unavailable');
      this.turnstileApi = api;
      this.turnstileWidgetId = api.render(container, {
        sitekey: config.siteKey,
        callback: token => { this.turnstileToken.set(token); this.verificationStatus.set(''); },
        'expired-callback': () => { this.turnstileToken.set(''); this.verificationStatus.set('Verification expired. Please verify again.'); },
        'error-callback': () => { this.turnstileToken.set(''); this.verificationStatus.set('Verification could not load. Please try again.'); },
      });
      this.verificationStatus.set('');
    } catch {
      this.verificationStatus.set('Spam protection is unavailable. Please email info@korafc.com directly.');
    }
  }

  protected onHoneypotInput(event: Event): void {
    this.honeypot.set((event.target as HTMLInputElement).value);
  }

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
    if (!this.turnstileToken()) {
      this.status.set('Please complete the spam verification before sending.');
      return;
    }
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
          website: this.honeypot(),
          turnstileToken: this.turnstileToken(),
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
      this.turnstileToken.set('');
      if (this.turnstileWidgetId) this.turnstileApi?.reset(this.turnstileWidgetId);
      this.contactSending.set(false);
    }
  }
}
