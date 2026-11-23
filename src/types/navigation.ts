export interface NavItem {
  label: string;
  path: string;
  group?: 'primary' | 'academy' | 'actions' | 'admin';
  description?: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: NavItem[];
}
