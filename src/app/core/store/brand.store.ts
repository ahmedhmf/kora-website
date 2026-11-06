import { afterNextRender, computed, Injectable, Signal } from '@angular/core';
import {
  BeyondLimitsContent,
  FooterContent,
  HeroContent,
  InnerPowerContent,
  MaximumImpactContent,
  NavItem,
  PeakPerformanceContent,
} from '../models/brand.models';
import { createSignalStore } from './signal-store';

export type ConnectionProfile = 'fast' | 'moderate' | 'save-data';

export interface BrandState {
  readonly brandName: string;
  readonly navItems: readonly NavItem[];
  readonly selectedCategory: string;
  readonly cartCount: number;
  readonly activeToast: string | null;
  readonly connectionProfile: ConnectionProfile;
  readonly hero: HeroContent;
  readonly innerPower: InnerPowerContent;
  readonly peakPerformance: PeakPerformanceContent;
  readonly maximumImpact: MaximumImpactContent;
  readonly beyondLimits: BeyondLimitsContent;
  readonly footer: FooterContent;
}

const initialBrandState: BrandState = {
  brandName: 'oxlando',
  navItems: [
    { id: 'men', label: 'MEN', targetSectionIndex: 1 },
    { id: 'women', label: 'WOMEN', targetSectionIndex: 2 },
    { id: 'kids', label: 'KIDS', targetSectionIndex: 3 },
    { id: 'training', label: 'TRAINING', targetSectionIndex: 4 },
  ],
  selectedCategory: 'men',
  cartCount: 0,
  activeToast: null,
  connectionProfile: 'fast',
  hero: {
    titleLine1: 'Engineered for',
    titleLine2: 'the Unstoppable',
    ctaLabel: 'SHOP NOW',
    topRightCopy:
      'Built from ultra-lightweight aero-weave fibers and precision body-mapped ventilation zones. Designed for athletes who command every stride.',
    bgImage:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1920&q=80&fm=webp',
    responsiveBg: {
      alt: 'Athlete running in Oxlando technical sportswear',
      fallbackSrc:
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1920&q=80&fm=webp',
      mobileSrc:
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=750&h=1334&q=75&fm=webp',
      tabletSrc:
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1024&h=1366&q=78&fm=webp',
      desktopSrc:
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1920&h=1080&q=80&fm=webp',
      retinaSrc:
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=2560&h=1440&q=82&fm=webp',
      sizes: '100vw',
      width: 1920,
      height: 1080,
      placeholderBg: 'linear-gradient(155deg, #273e54 0%, #4b6983 48%, #a6bfd2 100%)',
      objectPosition: 'center 24%',
      priority: true,
    },
    specs: ['AERO-WEAVE 2.4', 'ZERO SEAM FRICTION', 'HYDRO-SHIELD'],
  },
  innerPower: {
    sectionCode: '01 / 04',
    sectionNumber: '01',
    titleLine1: 'Release',
    titleLine2: 'Your Inner',
    titleLine3: 'Power',
    cardTitle: 'KINETIC COMPRESSION TECH',
    cardDescription:
      'Precision-knitted tension zones stabilize key muscle groups while returning explosive kinetic energy with every movement.',
    leftImage:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1440&q=80&fm=webp',
    responsiveLeftImage: {
      alt: 'Sprinters in motion',
      fallbackSrc:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80&fm=webp',
      mobileSrc:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=750&h=750&q=74&fm=webp',
      tabletSrc:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=960&h=1200&q=78&fm=webp',
      desktopSrc:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=960&h=1200&q=80&fm=webp',
      retinaSrc:
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1440&h=1800&q=82&fm=webp',
      sizes: '(max-width: 768px) 100vw, 50vw',
      width: 960,
      height: 1200,
      placeholderBg: 'linear-gradient(160deg, #6889a6 0%, #2c465e 100%)',
      objectPosition: 'center center',
      priority: false,
    },
  },
  peakPerformance: {
    sectionCode: '02 / 04',
    sectionNumber: '02',
    topCopy:
      'Adaptive thermal regulation responds dynamically to your core temperature, maintaining peak micro-climate balance from warm-up to final sprint.',
    bottomCopy:
      'Sculpted ergonomic seams follow natural biomechanical lines for unrestricted 360-degree mobility under high-output conditions.',
    titleLines: ['Peak Performance', 'Limitless Style', 'Next-Gen Apparel'],
    rightImage:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1440&q=80&fm=webp',
    responsiveRightImage: {
      alt: 'Female athlete in high-intensity motion',
      fallbackSrc:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80&fm=webp',
      mobileSrc:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=750&h=900&q=74&fm=webp',
      tabletSrc:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=960&h=1200&q=78&fm=webp',
      desktopSrc:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=960&h=1200&q=80&fm=webp',
      retinaSrc:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1440&h=1800&q=82&fm=webp',
      sizes: '(max-width: 768px) 100vw, 50vw',
      width: 960,
      height: 1200,
      placeholderBg: 'linear-gradient(180deg, #1b3146 0%, #0f1c29 100%)',
      objectPosition: 'center 22%',
      priority: false,
    },
  },
  maximumImpact: {
    sectionCode: '03 / 04',
    sectionNumber: '03',
    topTitleLine1: 'Optimized',
    topTitleLine2: 'for',
    bottomTitleLine1: 'Maximum',
    bottomTitleLine2: 'Impact',
    ctaLabel: 'SHOP NOW',
    backdropImage:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80&fm=webp',
    responsiveBackdrop: {
      alt: 'Athlete training silhouette',
      fallbackSrc:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80&fm=webp',
      mobileSrc:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=750&h=1334&q=72&fm=webp',
      tabletSrc:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1024&h=1366&q=76&fm=webp',
      desktopSrc:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&h=1080&q=78&fm=webp',
      retinaSrc:
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=2560&h=1440&q=80&fm=webp',
      sizes: '100vw',
      width: 1920,
      height: 1080,
      placeholderBg: 'linear-gradient(165deg, #d7e5f0 0%, #95b3cc 100%)',
      objectPosition: 'center 35%',
      priority: false,
    },
  },
  beyondLimits: {
    sectionCode: '04 / 04',
    sectionNumber: '04',
    headline: 'Beyond Limits',
    leftFeatureTitle: 'Zero Gravity Tech:',
    leftFeatureDescription:
      'Zero Gravity Tech: Lightweight, breathable materials built to withstand your most intense sessions without compromise.',
    rightMicroCopy:
      'Engineered at 68 grams per square meter with directional moisture transfer and four-way mechanical recovery.',
    ctaLabel: 'SHOP NOW',
    insetPortraitImage:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80&fm=webp',
    responsiveInsetPortrait: {
      alt: 'Athlete profile silhouette',
      fallbackSrc:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&h=460&q=80&fm=webp',
      mobileSrc:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&h=230&q=75&fm=webp',
      tabletSrc:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=320&h=368&q=78&fm=webp',
      desktopSrc:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=320&h=368&q=80&fm=webp',
      retinaSrc:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&h=460&q=82&fm=webp',
      sizes: '(max-width: 768px) 130px, 170px',
      width: 320,
      height: 368,
      placeholderBg: 'linear-gradient(145deg, #d8e7f3 0%, #98b4cc 100%)',
      objectPosition: 'center center',
      priority: false,
    },
  },
  footer: {
    brandName: 'oxlando',
    email: 'HELLO@OXLANDO.COM',
    linkGroups: [
      {
        heading: 'COLLECTION',
        links: [
          { label: 'Men Apparel', sectionIndex: 1 },
          { label: 'Women Apparel', sectionIndex: 2 },
          { label: 'Kids Performance', sectionIndex: 3 },
          { label: 'Training Gear', sectionIndex: 4 },
          { label: 'Aero Footwear', sectionIndex: 0 },
        ],
      },
      {
        heading: 'SUPPORT',
        links: [
          { label: 'Contact Us', sectionIndex: 5 },
          { label: 'Shipping & Delivery' },
          { label: 'Returns & Exchanges' },
          { label: 'Size Matrix' },
          { label: 'Care Instructions' },
        ],
      },
      {
        heading: 'ABOUT US',
        links: [
          { label: 'Our Innovation', sectionIndex: 4 },
          { label: 'Sustainability' },
          { label: 'Athlete Roster', sectionIndex: 2 },
          { label: 'Careers' },
          { label: 'Press Kit' },
        ],
      },
    ],
    spotlight: {
      tag: 'Explore the Series',
      name: 'AERO-ZERO CAPSULE',
      role: '2026 Performance Lookbook',
      quote: 'Tested in wind-tunnel conditions with elite endurance runners.',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80&fm=webp',
      responsiveAvatar: {
        alt: 'Aero-Zero Lookbook Athlete',
        fallbackSrc:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=190&q=80&fm=webp',
        mobileSrc:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=110&h=130&q=75&fm=webp',
        tabletSrc:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=190&q=78&fm=webp',
        desktopSrc:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=190&q=80&fm=webp',
        retinaSrc:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=285&q=82&fm=webp',
        sizes: '64px',
        width: 110,
        height: 130,
        placeholderBg: '#d8e7f3',
        objectPosition: 'center top',
        priority: false,
      },
    },
    copyright: '© 2026 OXLANDO PERFORMANCE LAB. ALL RIGHTS RESERVED.',
    legalLinks: ['PRIVACY POLICY', 'TERMS OF USE', 'COOKIE SETTINGS'],
    bgImage:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=78&fm=webp',
    responsiveBg: {
      alt: 'Oxlando endurance athlete silhouette',
      fallbackSrc:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=78&fm=webp',
      mobileSrc:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=640&h=560&q=72&fm=webp',
      tabletSrc:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=960&h=840&q=76&fm=webp',
      desktopSrc:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1280&h=1120&q=78&fm=webp',
      retinaSrc:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&h=1400&q=80&fm=webp',
      sizes: '(max-width: 768px) 85vw, 760px',
      width: 1280,
      height: 1120,
      placeholderBg: 'linear-gradient(180deg, #b8cde0 0%, #dae6f0 100%)',
      objectPosition: 'center 20%',
      priority: false,
    },
  },
};

@Injectable({ providedIn: 'root' })
export class BrandStore {
  private readonly store = createSignalStore<BrandState>(initialBrandState);
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly brandName = this.store.signals.brandName;
  readonly navItems = this.store.signals.navItems;
  readonly selectedCategory = this.store.signals.selectedCategory;
  readonly cartCount = this.store.signals.cartCount;
  readonly activeToast = this.store.signals.activeToast;
  readonly connectionProfile = this.store.signals.connectionProfile;

  readonly hero = this.store.signals.hero;
  readonly innerPower = this.store.signals.innerPower;
  readonly peakPerformance = this.store.signals.peakPerformance;
  readonly maximumImpact = this.store.signals.maximumImpact;
  readonly beyondLimits = this.store.signals.beyondLimits;
  readonly footer = this.store.signals.footer;

  readonly hasCartItems: Signal<boolean> = computed(() => this.cartCount() > 0);
  readonly isLowBandwidth: Signal<boolean> = computed(
    () => this.connectionProfile() !== 'fast'
  );

  constructor() {
    afterNextRender(() => {
      this.detectNetworkSpeed();
    });
  }

  selectCategory(categoryId: string): void {
    this.store.patchState({ selectedCategory: categoryId });
  }

  triggerShopAction(contextLabel: string): void {
    this.store.patchState((current) => ({
      cartCount: current.cartCount + 1,
      activeToast: `Added ${contextLabel} capsule to your bag`,
    }));

    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }

    this.toastTimeoutId = setTimeout(() => {
      this.store.patchState({ activeToast: null });
    }, 3200);
  }

  dismissToast(): void {
    this.store.patchState({ activeToast: null });
  }

  private detectNetworkSpeed(): void {
    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
        addEventListener?: (type: string, listener: () => void) => void;
      };
    };

    const conn = nav.connection;
    if (!conn) {
      return;
    }

    const updateProfile = (): void => {
      if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
        this.store.patchState({ connectionProfile: 'save-data' });
      } else if (conn.effectiveType === '3g') {
        this.store.patchState({ connectionProfile: 'moderate' });
      } else {
        this.store.patchState({ connectionProfile: 'fast' });
      }
    };

    updateProfile();
    conn.addEventListener?.('change', updateProfile);
  }
}
