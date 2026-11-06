import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';

type PageKey = 'about' | 'footballs' | 'handballs' | 'technology';

interface InformationPage {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  details: { heading: string; body: string }[];
  facts: string[];
}

const pages: Record<PageKey, InformationPage> = {
  about: {
    eyebrow: 'KORA / IDENTITY',
    title: 'A football creative lab',
    description: 'KORA® makes performance balls and cultural wear. Designed in Egypt and engineered in Germany, our work brings football culture, product design and performance together.',
    image: '/assets/kora/3rd.webp',
    imageAlt: 'Red and black KORA football culture artwork',
    details: [
      { heading: 'Culture', body: 'Football is more than an object or a score. KORA draws on raw football culture and independent creative expression.' },
      { heading: 'Performance', body: 'Our focus spans materials, construction, graphics, surface textures, manufacturing and testing.' },
      { heading: 'Expression', body: 'KORA combines considered product design with the energy and identity of the game.' },
    ],
    facts: ['Designed in Egypt', 'Engineered in Germany', 'Performance balls and cultural wear'],
  },
  footballs: {
    eyebrow: 'KORA / FOOTBALLS',
    title: 'Performance footballs',
    description: 'Explore the KORA approach to match balls: flight, touch and rebound shaped by material choices and construction.',
    image: '/assets/kora/4th.webp',
    imageAlt: 'Three KORA performance footballs in different colorways',
    details: [
      { heading: 'Flight', body: 'KORA football design focuses on reduced-drag flight and precision flight stability.' },
      { heading: 'Touch', body: 'Surface development prioritizes a haptic-responsive touch on the ball.' },
      { heading: 'Energy', body: 'Construction development focuses on optimized energy rebound and acceleration.' },
    ],
    facts: ['Reduced-drag flight', 'Precision flight stability', 'Haptic-responsive touch', 'Optimized energy rebound', 'Turbocharged acceleration'],
  },
  handballs: {
    eyebrow: 'KORA / HANDBALLS',
    title: 'Handballs made for the game',
    description: 'Handball demands grip, control and split-second response. KORA develops performance handballs with material and construction features designed around play.',
    image: '/assets/kora/6th.webp',
    imageAlt: 'Two KORA handballs in red-blue and green colorways',
    details: [
      { heading: 'Grip and control', body: 'An engineered non-slip surface is designed for grip and control.' },
      { heading: 'Softness and rebound', body: 'Multi-layer PULSEFOAM® is used for softness and rebound.' },
      { heading: 'Construction', body: 'A Zero-Wing latex bladder supports shape stability and air retention, alongside 32-panel hand-stitched construction.' },
    ],
    facts: ['Non-slip surface', 'Multi-layer PULSEFOAM®', 'Zero-Wing latex bladder', '32-panel hand-stitched construction', 'Resin compatibility'],
  },
  technology: {
    eyebrow: 'KORA / DNA',
    title: 'Performance with purpose',
    description: 'From construction and materials to surface textures, manufacturing and testing, every detail matters in the development of KORA performance balls.',
    image: '/assets/kora/2nd.webp',
    imageAlt: 'Exploded KORA football showing its layered construction',
    details: [
      { heading: 'GRIPSKIN PU®', body: 'The textured performance surface forms the outer layer of the football.' },
      { heading: 'REBOUNDCORE FOAM', body: 'A foam layer sits beneath the surface as part of the ball’s layered construction.' },
      { heading: 'FLIGHTFRAME', body: 'A structural stability layer is incorporated into the ball.' },
      { heading: 'AIRLOCK', body: 'The air-retention core completes the construction.' },
    ],
    facts: ['Surface texture', 'Layered construction', 'Structural stability', 'Air retention'],
  },
};

@Component({
  selector: 'app-information-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './information-page.component.html',
  styleUrl: './information-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly page = pages[this.route.snapshot.data['page'] as PageKey] ?? pages.about;

  ngOnInit(): void {
    const pageTitle = `${this.page.title} | KORA®`;
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: this.page.description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: this.page.description });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: this.page.description });
  }
}
