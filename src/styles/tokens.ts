export const BRAND_COLORS = {
  deepNavy: '#071A36',
  darkNavy: '#050D1B',
  royalGold: '#D9A52E',
  white: '#FFFFFF',
  cricketRed: '#C8202B',
  lightBackground: '#F5F7FA',
  secondaryText: '#64748B',
  border: '#E2E8F0',
} as const;

export const DESIGN_SYSTEM = {
  fonts: {
    heading: 'Sora',
    body: 'Inter',
  },
  layout: {
    maxWidthPx: 1280,
    containerClass: 'mx-auto w-full max-w-[1260px] px-4 sm:px-6 lg:px-8',
  },
  radii: {
    card: '14px',
    button: '10px',
    input: '10px',
  },
  controls: {
    inputHeight: '50px',
  },
} as const;

export type BrandColorKey = keyof typeof BRAND_COLORS;
