import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';

type LegalPageKey = 'privacy' | 'legal';
interface LegalSection { heading: string; paragraphs: string[]; }

const privacySections: LegalSection[] = [
  {
    heading: 'Who operates this website?',
    paragraphs: [
      'KORA is a brand owned by Talha Store (شركة طلحة ستور للتوريدات الرياضية), an Egyptian single-person limited liability company. Registered business address: 111 Haroun Street, off Midan El-Mesaha, Room 11, Dokki, Giza, Egypt.',
      'For privacy questions, requests to access or correct personal information, or to withdraw newsletter consent, please email info@korafc.com.',
    ],
  },
  {
    heading: 'Information we collect',
    paragraphs: [
      'When you send a contact enquiry, we process the name, email address, and message you submit so we can respond.',
      'When you request the KORA newsletter, we process your email address and your choice to subscribe. Our mailing service may also record subscription confirmations, delivery information, and unsubscribes.',
      'As with most websites, technical service providers may process IP addresses, browser details, request times, security-verification information, and server logs needed to operate and protect the website.',
    ],
  },
  {
    heading: 'Why we use your information',
    paragraphs: [
      'We use contact details to answer enquiries and communicate about requests you send us. We use email addresses for marketing only when you actively opt in to the newsletter.',
      'We use security-related technical information to keep the site available, prevent abuse, and verify that form submissions are legitimate. We do not use the contact form as an automatic newsletter signup.',
    ],
  },
  {
    heading: 'Newsletter and your choices',
    paragraphs: [
      'KORA uses Brevo to manage newsletter subscriptions and send emails about products, launches, and promotions. The signup uses a double opt-in process: you must confirm your email address before being added to the mailing list.',
      'You can withdraw your newsletter consent at any time using the unsubscribe link in a marketing email or by contacting info@korafc.com. Withdrawing consent does not affect processing that occurred before withdrawal.',
    ],
  },
  {
    heading: 'Service providers and international processing',
    paragraphs: [
      'Website hosting is provided through Hostinger. Cloudflare Turnstile helps detect automated submissions. Brevo processes newsletter subscription details and related email-delivery information. The website also requests the Chakra Petch font from Google Fonts.',
      'These providers may handle data in countries outside Egypt. Their applicable processing terms, safeguards, and locations should be considered as part of KORA’s privacy compliance review.',
    ],
  },
  {
    heading: 'Cookies and similar technologies',
    paragraphs: [
      'We do not currently use advertising pixels or analytics cookies on this website. Essential security and website technologies may still process technical information or use necessary session storage.',
      'If non-essential tracking is added in the future, this policy and any required consent choices will be updated before that tracking is enabled.',
    ],
  },
  {
    heading: 'How long information is kept',
    paragraphs: [
      'We retain enquiry information for as long as reasonably needed to handle correspondence and meet applicable legal obligations. Newsletter subscription data is retained while you remain subscribed, subject to necessary records of consent, unsubscribes, and applicable requirements.',
      'Hosting, security, and email-service providers may apply their own technical log retention periods. Exact retention schedules should be confirmed against KORA’s operational practices.',
    ],
  },
  {
    heading: 'Your privacy requests',
    paragraphs: [
      'You may contact us to ask what information we hold about you, request corrections or deletion where applicable, object to certain uses, or withdraw marketing consent. We will consider requests under the laws applicable to KORA and the specific processing.',
      'For requests or questions, email info@korafc.com. We may need to verify your identity before disclosing or changing information.',
    ],
  },
  {
    heading: 'Updates',
    paragraphs: [
      'We may update this notice if our services, data practices, or legal obligations change. The latest version will be available on this page.',
    ],
  },
];

const legalSections: LegalSection[] = [
  {
    heading: 'Brand and operating company',
    paragraphs: [
      'KORA is a brand owned by Talha Store (شركة طلحة ستور للتوريدات الرياضية), an Egyptian single-person limited liability company.',
      'KORA is a brand name, not a separate German-registered company.',
    ],
  },
  {
    heading: 'Business address',
    paragraphs: [
      '111 Haroun Street, off Midan El-Mesaha, Room 11, Dokki, Giza, Arab Republic of Egypt.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [
      'Email: info@korafc.com',
      'Egypt office telephone: +20 102 013 8899',
    ],
  },
  {
    heading: 'Business activity',
    paragraphs: [
      'Sports supplies and sporting-goods business. The supplied Egyptian Tax Authority document describes retail sale of sporting goods in specialized stores.',
    ],
  },
  {
    heading: 'Company records',
    paragraphs: [
      'Additional commercial registration and tax identifiers have not been displayed here pending verification of which details are required for public disclosure.',
    ],
  },
];

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './legal-page.component.html',
  styleUrl: './legal-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  readonly page: LegalPageKey = this.route.snapshot.data['page'] === 'privacy' ? 'privacy' : 'legal';
  readonly heading = this.page === 'privacy' ? 'Privacy Policy' : 'Legal Information';
  readonly sections = this.page === 'privacy' ? privacySections : legalSections;
  readonly description = this.page === 'privacy'
    ? 'How KORA, a brand owned by Talha Store in Egypt, handles website enquiries and newsletter data.'
    : 'Official company and contact information for the KORA brand, owned by Talha Store in Egypt.';

  ngOnInit(): void {
    this.title.setTitle(`${this.heading} | KORA®`);
    this.meta.updateTag({ name: 'description', content: this.description });
    this.meta.updateTag({ property: 'og:title', content: `${this.heading} | KORA®` });
  }
}
