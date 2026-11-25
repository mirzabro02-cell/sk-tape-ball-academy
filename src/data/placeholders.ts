import type { SelectOption } from '@/src/types/common';

export const PROGRAM_SELECT_PLACEHOLDERS: SelectOption[] = [
  { label: 'Select a training track (Placeholder)', value: '' },
  { label: 'Foundation Batch — Tape Ball Basics (Placeholder)', value: 'foundation-placeholder' },
  { label: 'Pace & Death Bowling Clinic (Placeholder)', value: 'pace-clinic-placeholder' },
  { label: 'Power Hitting & Strike Rotation (Placeholder)', value: 'batting-clinic-placeholder' },
  { label: 'High-Performance Match Squad (Placeholder)', value: 'squad-placeholder' },
];

export const FOUNDATION_PILLARS_PLACEHOLDER = [
  {
    code: '01',
    title: 'Design System & Palette',
    description:
      'Configured with Deep Navy (#071A36), Dark Navy (#050D1B), Royal Gold (#D9A52E), Cricket Red (#C8202B), and Light Canvas (#F5F7FA).',
  },
  {
    code: '02',
    title: 'Global Layout & Navigation',
    description:
      'Responsive header, Academy routes menu, mobile drawer, official logo slot, primary CTAs, WhatsApp placeholder, and structured footer.',
  },
  {
    code: '03',
    title: 'Routing & Future Data Readiness',
    description:
      'All 17 public routes and 8 admin placeholder routes active with typed service interfaces prepared for Supabase integration.',
  },
] as const;
