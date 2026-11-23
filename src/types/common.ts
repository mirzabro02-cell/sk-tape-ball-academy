export type PlaceholderStatus = 'placeholder' | 'planned' | 'ready';

export interface SelectOption {
  label: string;
  value: string;
}

export interface PageMeta {
  title: string;
  description: string;
  sectionLabel: string;
  routePath: string;
}
