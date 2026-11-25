import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration & Initialization Layer
 *
 * Requirements:
 * - Never expose or accept service_role / secret keys in frontend code.
 * - Support both legacy anon JWT keys and modern Supabase publishable keys.
 * - Safely validate environment variables without crashing the app at import/page load.
 * - Prevent database/auth operations if unconfigured, raising clear developer-friendly errors.
 */

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  urlPresent: boolean;
  anonKeyPresent: boolean;
  error?: string | null;
}

const PLACEHOLDER_URL_PATTERNS = [
  'your-project',
  'your-project-id',
  'your-project-ref',
  'example.supabase.co',
];

const PLACEHOLDER_KEY_PATTERNS = [
  'your-anon',
  'your-anon-public-key',
  'your-anon-key',
  'my_anon_key',
];

function isPlaceholder(value: string, placeholders: string[]): boolean {
  const normalized = value.trim().toLowerCase();
  return placeholders.some((pattern) => normalized.includes(pattern));
}

function isServiceRoleKey(key: string): boolean {
  const trimmed = key.trim();
  if (
    trimmed.toLowerCase().includes('service_role') ||
    trimmed.startsWith('sb_secret_') ||
    trimmed.startsWith('sbs_')
  ) {
    return true;
  }

  // Inspect JWT payload if key is in standard JWT format (legacy anon/service_role keys)
  if (trimmed.startsWith('eyJ') && trimmed.includes('.')) {
    try {
      const parts = trimmed.split('.');
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
        );
        const parsed = JSON.parse(jsonPayload);
        if (parsed.role === 'service_role') {
          return true;
        }
      }
    } catch {
      // In case of base64/JSON decode failure, fail open for JWT parse
    }
  }

  return false;
}

function validateConfiguration(): {
  isValid: boolean;
  url: string | null;
  anonKey: string | null;
  error: string | null;
} {
  const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const url = rawUrl?.trim() || null;
  const anonKey = rawAnonKey?.trim() || null;

  if (!url || !anonKey) {
    return {
      isValid: false,
      url,
      anonKey,
      error:
        'Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.',
    };
  }

  if (isPlaceholder(url, PLACEHOLDER_URL_PATTERNS)) {
    return {
      isValid: false,
      url,
      anonKey,
      error:
        'VITE_SUPABASE_URL contains placeholder text. Replace it with your actual Supabase project URL.',
    };
  }

  if (isPlaceholder(anonKey, PLACEHOLDER_KEY_PATTERNS)) {
    return {
      isValid: false,
      url,
      anonKey,
      error:
        'VITE_SUPABASE_ANON_KEY contains placeholder text. Replace it with your actual Supabase anon or publishable key.',
    };
  }

  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return {
        isValid: false,
        url,
        anonKey,
        error: `VITE_SUPABASE_URL must use http: or https: protocol (received "${url}").`,
      };
    }
  } catch {
    return {
      isValid: false,
      url,
      anonKey,
      error: `VITE_SUPABASE_URL is not a valid URL (received "${url}").`,
    };
  }

  if (isServiceRoleKey(anonKey)) {
    return {
      isValid: false,
      url,
      anonKey,
      error:
        'SECURITY VIOLATION: A service_role secret key was provided to VITE_SUPABASE_ANON_KEY. Never expose service_role or admin secret keys in frontend client code! Use the public anon or publishable key instead.',
    };
  }

  return {
    isValid: true,
    url,
    anonKey,
    error: null,
  };
}

const configResult = validateConfiguration();

let rawClient: SupabaseClient | null = null;

if (configResult.isValid && configResult.url && configResult.anonKey) {
  rawClient = createClient(configResult.url, configResult.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} else if (configResult.error) {
  // Developer-friendly notification in development environments
  if (import.meta.env.DEV) {
    if (configResult.error.includes('SECURITY VIOLATION')) {
      console.error(
        `%c[Supabase Security Error] ${configResult.error}`,
        'color: red; font-weight: bold; font-size: 14px;',
      );
    } else {
      console.info(
        `%c[Supabase] Unconfigured State: ${configResult.error}\nAdd your keys to .env.local to enable live database and auth features.`,
        'color: #D9A52E; font-weight: 500;',
      );
    }
  }
}

/**
 * Returns current configuration status details.
 */
export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  return {
    isConfigured: configResult.isValid,
    urlPresent: Boolean(configResult.url),
    anonKeyPresent: Boolean(configResult.anonKey),
    error: configResult.error,
  };
}

export const isSupabaseConfigured = configResult.isValid;

/**
 * Direct reference to the raw SupabaseClient instance (or null if unconfigured).
 */
export const rawSupabase: SupabaseClient | null = rawClient;

/**
 * Safe Supabase client proxy.
 *
 * If valid Supabase credentials are configured, delegates all calls directly to the
 * initialized SupabaseClient.
 *
 * If unconfigured, does NOT crash the application on page load, but immediately blocks
 * database/auth operations with a clear developer-friendly error message if accessed.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (rawClient) {
      const value = (rawClient as unknown as Record<string | symbol, unknown>)[prop];
      return typeof value === 'function' ? value.bind(rawClient) : value;
    }

    throw new Error(
      `[Supabase Unconfigured] Cannot access 'supabase.${String(prop)}()'. ${configResult.error || 'Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'}`,
    );
  },
});
