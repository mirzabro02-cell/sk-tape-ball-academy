export const BRAND_COLORS = {
  deepNavy: '#07152C',
  navySecondary: '#0F213B',
  navyElevated: '#162B4D',
  darkNavy: '#050D1B',
  accentBlue: '#1E3F73',
  accentBlueBright: '#2B599E',
  royalGold: '#D5A52B',
  royalGoldHover: '#E2B84A',
  royalGoldActive: '#C2931F',
  white: '#FFFFFF',
  cricketRed: '#C8202B',
  cricketRedBright: '#E03A45',
  lightBackground: '#F5F7FA',
  lightElevated: '#EEF2F6',
  secondaryText: '#64748B',
  slateText: '#475569',
  darkMutedText: '#B4C4DC',
  darkSubtleText: '#8499B8',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  success: '#16A34A',
  warning: '#D5A52B',
  danger: '#C8202B',
  info: '#2563EB',
} as const;

export const TYPOGRAPHY_TOKENS = {
  fonts: {
    display: 'Barlow Condensed',
    heading: 'Plus Jakarta Sans',
    body: 'Plus Jakarta Sans',
    mono: 'JetBrains Mono',
  },
  scale: {
    displayHero: 'clamp(2.5rem, 5vw, 4.25rem)',
    displaySection: 'clamp(1.75rem, 3vw, 2.5rem)',
    h1: 'clamp(2rem, 3.6vw, 3.25rem)',
    h2: 'clamp(1.5rem, 2.5vw, 2.125rem)',
    h3: '1.25rem',
    h4: '1.0625rem',
    bodyLg: '1.0625rem',
    body: '0.9375rem',
    bodySm: '0.875rem',
    caption: '0.75rem',
    overline: '0.6875rem',
  },
  tracking: {
    display: '-0.025em',
    heading: '-0.02em',
    overline: '0.16em',
  },
} as const;

export const SPACING_TOKENS = {
  headerHeightPx: 78,
  containerMaxPx: 1260,
  sectionGapClass: 'space-y-12 sm:space-y-16',
  cardPadding: {
    sm: '16px 20px',
    md: '24px',
    lg: '28px 32px',
  },
} as const;

export const RADIUS_TOKENS = {
  card: '16px',
  cardLg: '20px',
  button: '10px',
  input: '10px',
  badge: '8px',
  pill: '9999px',
} as const;

export const SHADOW_TOKENS = {
  cardLight: '0 10px 28px -18px rgba(7, 21, 44, 0.14)',
  cardLightHover: '0 18px 36px -18px rgba(7, 21, 44, 0.20)',
  cardDark: '0 18px 42px -20px rgba(0, 0, 0, 0.65)',
  cardDarkHover: '0 22px 48px -18px rgba(2, 8, 19, 0.85), 0 0 0 1px rgba(213, 165, 43, 0.35)',
  goldGlow: '0 8px 24px -6px rgba(213, 165, 43, 0.52)',
  goldGlowHover: '0 14px 32px -6px rgba(213, 165, 43, 0.72)',
  headerDark: '0 12px 32px -12px rgba(3, 9, 20, 0.72)',
  headerLight: '0 8px 24px -14px rgba(7, 21, 44, 0.12)',
} as const;

export const GRADIENT_TOKENS = {
  navySurfaceDark: 'linear-gradient(180deg, #12284B 0%, #0A1831 100%)',
  heroDark: 'linear-gradient(135deg, #07152C 0%, #0F213B 54%, #050D1B 100%)',
  footerDark: 'linear-gradient(180deg, #07152C 0%, #050D1B 100%)',
  goldAccentBar: 'linear-gradient(90deg, rgba(213,165,43,0.1) 0%, #D5A52B 50%, rgba(200,32,43,0.75) 100%)',
  drawerActiveGold: 'linear-gradient(90deg, #D5A52B 0%, #E2B84A 100%)',
} as const;

export const TRANSITION_TOKENS = {
  easePremium: [0.22, 1, 0.36, 1] as const,
  microMs: 160,
  drawerMs: 240,
  pageMs: 240,
} as const;

export const BREAKPOINT_TOKENS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440,
} as const;

export const DESIGN_SYSTEM = {
  fonts: TYPOGRAPHY_TOKENS.fonts,
  typography: TYPOGRAPHY_TOKENS,
  spacing: SPACING_TOKENS,
  layout: {
    maxWidthPx: 1280,
    containerClass: 'mx-auto w-full max-w-[1260px] px-4 sm:px-6 lg:px-8',
  },
  radii: RADIUS_TOKENS,
  shadows: SHADOW_TOKENS,
  gradients: GRADIENT_TOKENS,
  transitions: TRANSITION_TOKENS,
  breakpoints: BREAKPOINT_TOKENS,
  controls: {
    inputHeight: '48px',
    headerHeight: '78px',
  },
} as const;

export type BrandColorKey = keyof typeof BRAND_COLORS;
