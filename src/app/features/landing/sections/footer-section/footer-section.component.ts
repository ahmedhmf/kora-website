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
  private newsletterWidgetId = '';
  private turnstileApi?: TurnstileApi;
  readonly isActive = input(false);
  readonly progress = input(0);
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly contactMessage = signal('');
  protected readonly status = signal('');
  protected readonly contactSending = signal(false);
  protected readonly turnstileToken = signal('');
  protected readonly newsletterToken = signal('');
  protected readonly verificationStatus = signal('Loading spam protection…');
  protected readonly newsletterVerificationStatus = signal('Loading spam protection…');
  protected readonly honeypot = signal('');
  protected readonly newsletterHoneypot = signal('');
  protected readonly newsletterSending = signal(false);
  protected readonly newsletterEmail = signal('');
  protected readonly consented = signal(false);
  protected readonly newsletterStatus = signal('');

  constructor() {
    afterNextRender(() => {
      if (new URLSearchParams(window.location.search).get('newsletter') === 'confirmed') {
        this.newsletterStatus.set('Your email has been confirmed. Welcome to KORA!');
      }
      void this.initializeTurnstile();
    });
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
      const newsletterContainer = this.host.nativeElement.querySelector('#kora-newsletter-turnstile') as HTMLElement | null;
      if (newsletterContainer) {
        this.newsletterWidgetId = api.render(newsletterContainer, {
          sitekey: config.siteKey,
          callback: token => { this.newsletterToken.set(token); this.newsletterVerificationStatus.set(''); },
          'expired-callback': () => { this.newsletterToken.set(''); this.newsletterVerificationStatus.set('Verification expired. Please verify again.'); },
          'error-callback': () => { this.newsletterToken.set(''); this.newsletterVerificationStatus.set('Verification could not load. Please try again.'); },
        });
        this.newsletterVerificationStatus.set('');
      }
    } catch {
      this.verificationStatus.set('Spam protection is unavailable. Please email info@korafc.com directly.');
      this.newsletterVerificationStatus.set('Spam protection is unavailable. Please try again later.');
    }
  }

  protected onHoneypotInput(event: Event): void {
    this.honeypot.set((event.target as HTMLInputElement).value);
  }

  protected onNewsletterHoneypotInput(event: Event): void {
    this.newsletterHoneypot.set((event.target as HTMLInputElement).value);
  }

  protected onNewsletterEmailInput(event: Event): void {
    this.newsletterEmail.set((event.target as HTMLInputElement).value);
    this.newsletterStatus.set('');
  }

  protected onConsentChange(event: Event): void {
    this.consented.set((event.target as HTMLInputElement).checked);
    this.newsletterStatus.set('');
  }

  protected async onSubscribe(event: Event): Promise<void> {
    event.preventDefault();
    if (this.newsletterSending()) return;
    if (!this.consented() || !this.newsletterEmail().trim() || !this.newsletterToken()) {
      this.newsletterStatus.set('Please accept the privacy policy and complete verification.');
      return;
    }
    this.newsletterSending.set(true);
    this.newsletterStatus.set('Sending your confirmation email…');
    try {
      const response = await fetch('/subscribe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.newsletterEmail().trim(),
          consent: this.consented(),
          website: this.newsletterHoneypot(),
          turnstileToken: this.newsletterToken(),
        }),
      });
      if (!response.ok) throw new Error('Subscription unavailable');
      this.newsletterEmail.set('');
      this.consented.set(false);
      this.newsletterStatus.set('Please check your inbox and confirm your subscription.');
    } catch {
      this.newsletterStatus.set('Subscription could not be completed. Please try again later.');
    } finally {
      this.newsletterToken.set('');
      if (this.newsletterWidgetId) this.turnstileApi?.reset(this.newsletterWidgetId);
      this.newsletterSending.set(false);
    }
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
