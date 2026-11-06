export interface ResponsiveImageAsset {
  readonly alt: string;
  readonly fallbackSrc: string;
  readonly mobileSrc: string;
  readonly tabletSrc: string;
  readonly desktopSrc: string;
  readonly retinaSrc: string;
  readonly sizes: string;
  readonly width: number;
  readonly height: number;
  readonly placeholderBg: string;
  readonly objectPosition?: string;
  readonly priority?: boolean;
  readonly avifSrcset?: string;
  readonly webpSrcset?: string;
}

export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly targetSectionIndex: number;
  readonly badge?: string;
}

export interface SectionDescriptor {
  readonly id: string;
  readonly index: number;
  readonly numberLabel: string;
  readonly codeLabel: string;
  readonly title: string;
}

export interface HeroContent {
  readonly titleLine1: string;
  readonly titleLine2: string;
  readonly ctaLabel: string;
  readonly topRightCopy: string;
  readonly bgImage: string;
  readonly responsiveBg: ResponsiveImageAsset;
  readonly specs: readonly string[];
}

export interface InnerPowerContent {
  readonly sectionCode: string;
  readonly sectionNumber: string;
  readonly titleLine1: string;
  readonly titleLine2: string;
  readonly titleLine3: string;
  readonly cardTitle: string;
  readonly cardDescription: string;
  readonly leftImage: string;
  readonly responsiveLeftImage: ResponsiveImageAsset;
}

export interface PeakPerformanceContent {
  readonly sectionCode: string;
  readonly sectionNumber: string;
  readonly topCopy: string;
  readonly bottomCopy: string;
  readonly titleLines: readonly [string, string, string];
  readonly rightImage: string;
  readonly responsiveRightImage: ResponsiveImageAsset;
}

export interface MaximumImpactContent {
  readonly sectionCode: string;
  readonly sectionNumber: string;
  readonly topTitleLine1: string;
  readonly topTitleLine2: string;
  readonly bottomTitleLine1: string;
  readonly bottomTitleLine2: string;
  readonly ctaLabel: string;
  readonly backdropImage: string;
  readonly responsiveBackdrop: ResponsiveImageAsset;
}

export interface BeyondLimitsContent {
  readonly sectionCode: string;
  readonly sectionNumber: string;
  readonly headline: string;
  readonly leftFeatureTitle: string;
  readonly leftFeatureDescription: string;
  readonly rightMicroCopy: string;
  readonly ctaLabel: string;
  readonly insetPortraitImage: string;
  readonly responsiveInsetPortrait: ResponsiveImageAsset;
}

export interface FooterLinkGroup {
  readonly heading: string;
  readonly links: readonly {
    readonly label: string;
    readonly sectionIndex?: number;
  }[];
}

export interface FooterSpotlightCard {
  readonly tag: string;
  readonly name: string;
  readonly role: string;
  readonly quote: string;
  readonly avatarUrl: string;
  readonly responsiveAvatar: ResponsiveImageAsset;
}

export interface FooterContent {
  readonly brandName: string;
  readonly email: string;
  readonly linkGroups: readonly FooterLinkGroup[];
  readonly spotlight: FooterSpotlightCard;
  readonly copyright: string;
  readonly legalLinks: readonly string[];
  readonly bgImage: string;
  readonly responsiveBg: ResponsiveImageAsset;
}
