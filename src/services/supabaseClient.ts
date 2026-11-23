/**
 * Future Supabase Client Configuration Placeholder
 *
 * Part 1 Rule: No active Supabase connection or backend calls yet.
 * When Supabase is connected in a later phase, install `@supabase/supabase-js`
 * and configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
 */
export interface SupabaseConfigStatus {
  isConfigured: boolean;
  urlPresent: boolean;
  anonKeyPresent: boolean;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  return {
    isConfigured: Boolean(url && anonKey),
    urlPresent: Boolean(url),
    anonKeyPresent: Boolean(anonKey),
  };
}
