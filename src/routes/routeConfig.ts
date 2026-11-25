export interface ProtectedAdminRouteConfig {
  path: string;
  index?: boolean;
  title: string;
  description: string;
}

export const PUBLIC_PLACEHOLDER_ROUTES: never[] = [];

export const ADMIN_PORTAL_BASE = '/sk-portal';
