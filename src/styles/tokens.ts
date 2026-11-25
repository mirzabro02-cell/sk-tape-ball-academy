export const BRAND_COLORS = {
  deepNavy: '#07152C',
  navySecondary: '#0F213B',
  navyElevated: '#162B4D',
  darkNavy: '#050D1B',
  royalGold: '#D5A52B',
  royalGoldHover: '#E2B84A',
  white: '#FFFFFF',
  cricketRed: '#C8202B',
  lightBackground: '#F5F7FA',
  secondaryText: '#64748B',
  darkMutedText: '#9FB2CC',
  border: '#E2E8F0',
} as const;

export const DESIGN_SYSTEM = {
  fonts: {
    display: 'Barlow Condensed',
    heading: 'Plus Jakarta Sans',
    body: 'Plus Jakarta Sans',
    mono: 'JetBrains Mono',
  },
  layout: {
    maxWidthPx: 1280,
    containerClass: 'mx-auto w-full max-w-[1260px] px-4 sm:px-6 lg:px-8',
  },
  radii: {
    card: '16px',
    button: '10px',
    input: '10px',
  },
  controls: {
    inputHeight: '48px',
  },
} as const;

export type BrandColorKey = keyof typeof BRAND_COLORS;
