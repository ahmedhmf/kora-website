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

  protected onFieldInput(event: Event, field: 'name' | 'email' | 'message'): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (field === 'name') this.name.set(value);
    if (field === 'email') this.email.set(value);
    if (field === 'message') this.contactMessage.set(value);
    this.status.set('');
  }

  protected onContact(event: Event): void {
    event.preventDefault();
    const subject = encodeURIComponent(`KORA website enquiry from ${this.name().trim()}`);
    const body = encodeURIComponent(`Name: ${this.name().trim()}\nEmail: ${this.email().trim()}\n\n${this.contactMessage().trim()}`);
    this.status.set('Opening your email app to send the message.');
    window.location.href = `mailto:info@korafc.com?subject=${subject}&body=${body}`;
  }
}
