import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isSupabaseConfigured, rawSupabase } from '@/src/services/supabaseClient';

const LOCAL_OPERATOR_KEY = 'sk_portal_operator_v1';
const LOCAL_SESSION_KEY = 'sk_portal_session_v1';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

interface StoredOperatorRecord {
  email: string;
  displayName: string;
  salt: string;
  passwordHash: string;
}

interface ActiveLocalSession {
  email: string;
  displayName: string;
  issuedAt: number;
}

export interface AdminUserSummary {
  email: string;
  displayName: string;
  authSource: 'supabase' | 'local-operator';
}

export interface AdminAuthResult {
  ok: boolean;
  error?: string;
}

export interface AdminAuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  isSupabaseMode: boolean;
  hasLocalOperatorSetup: boolean;
  user: AdminUserSummary | null;
  lockoutRemainingSec: number;
  signIn: (email: string, password: string) => Promise<AdminAuthResult>;
  registerLocalOperator: (
    email: string,
    displayName: string,
    password: string,
  ) => Promise<AdminAuthResult>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

async function deriveSaltedHash(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateSalt(): string {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readStoredOperator(): StoredOperatorRecord | null {
  try {
    const raw = window.localStorage.getItem(LOCAL_OPERATOR_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredOperatorRecord;
    if (!parsed.email || !parsed.passwordHash || !parsed.salt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function readActiveLocalSession(): ActiveLocalSession | null {
  try {
    const raw = window.sessionStorage.getItem(LOCAL_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveLocalSession;
    if (!parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminUserSummary | null>(null);
  const [hasLocalOperatorSetup, setHasLocalOperatorSetup] = useState<boolean>(() =>
    typeof window !== 'undefined' ? Boolean(readStoredOperator()) : false,
  );
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemainingSec, setLockoutRemainingSec] = useState(0);

  useEffect(() => {
    if (!lockoutUntil) {
      setLockoutRemainingSec(0);
      return;
    }
    const tick = () => {
      const diff = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemainingSec(diff);
      if (diff <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
      }
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [lockoutUntil]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (isSupabaseConfigured && rawSupabase) {
        try {
          const {
            data: { session },
          } = await rawSupabase.auth.getSession();

          if (session?.user) {
            const { data: profile } = await rawSupabase
              .from('profiles')
              .select('role, full_name')
              .eq('id', session.user.id)
              .maybeSingle();

            if (active && profile?.role === 'admin') {
              setUser({
                email: session.user.email ?? 'admin',
                displayName:
                  (profile.full_name as string | undefined) || 'Academy Administrator',
                authSource: 'supabase',
              });
            }
          }
        } catch {
          // Leave unauthenticated on lookup failure
        } finally {
          if (active) setIsLoading(false);
        }
        return;
      }

      const storedOp = readStoredOperator();
      const activeSess = readActiveLocalSession();
      if (active) {
        setHasLocalOperatorSetup(Boolean(storedOp));
        if (storedOp && activeSess && activeSess.email === storedOp.email) {
          setUser({
            email: activeSess.email,
            displayName: activeSess.displayName,
            authSource: 'local-operator',
          });
        }
        setIsLoading(false);
      }
    }

    bootstrap();

    if (isSupabaseConfigured && rawSupabase) {
      const {
        data: { subscription },
      } = rawSupabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          setUser(null);
        }
      });
      return () => {
        active = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      active = false;
    };
  }, []);

  async function signIn(email: string, password: string): Promise<AdminAuthResult> {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      return {
        ok: false,
        error: `Too many failed attempts. Please wait ${lockoutRemainingSec}s before trying again.`,
      };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return { ok: false, error: 'Email and password are required.' };
    }

    if (isSupabaseConfigured && rawSupabase) {
      const { data, error } = await rawSupabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error || !data.user) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= MAX_ATTEMPTS) setLockoutUntil(Date.now() + LOCKOUT_MS);
        return { ok: false, error: error?.message ?? 'Invalid admin credentials.' };
      }

      const { data: profile, error: profileError } = await rawSupabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError || profile?.role !== 'admin') {
        await rawSupabase.auth.signOut();
        return {
          ok: false,
          error: 'This account does not have administrator permissions.',
        };
      }

      setFailedAttempts(0);
      setLockoutUntil(null);
      setUser({
        email: data.user.email ?? normalizedEmail,
        displayName: (profile.full_name as string | undefined) || 'Academy Administrator',
        authSource: 'supabase',
      });
      return { ok: true };
    }

    const operator = readStoredOperator();
    if (!operator) {
      return {
        ok: false,
        error: 'No local administrator account is configured on this browser yet.',
      };
    }

    const attemptedHash = await deriveSaltedHash(password, operator.salt);
    if (normalizedEmail !== operator.email || attemptedHash !== operator.passwordHash) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= MAX_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_MS);
      }
      return { ok: false, error: 'Incorrect email or password.' };
    }

    setFailedAttempts(0);
    setLockoutUntil(null);

    const sessionPayload: ActiveLocalSession = {
      email: operator.email,
      displayName: operator.displayName,
      issuedAt: Date.now(),
    };
    window.sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionPayload));
    setUser({
      email: operator.email,
      displayName: operator.displayName,
      authSource: 'local-operator',
    });
    return { ok: true };
  }

  async function registerLocalOperator(
    email: string,
    displayName: string,
    password: string,
  ): Promise<AdminAuthResult> {
    if (isSupabaseConfigured) {
      return {
        ok: false,
        error: 'Supabase authentication is enabled. Sign in with an administrator account.',
      };
    }

    if (readStoredOperator()) {
      return {
        ok: false,
        error: 'An operator account is already registered on this browser.',
      };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: 'Enter a valid administrator email address.' };
    }
    if (cleanName.length < 2) {
      return { ok: false, error: 'Enter an administrator display name.' };
    }
    if (password.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters long.' };
    }

    const salt = generateSalt();
    const passwordHash = await deriveSaltedHash(password, salt);

    const record: StoredOperatorRecord = {
      email: normalizedEmail,
      displayName: cleanName,
      salt,
      passwordHash,
    };
    window.localStorage.setItem(LOCAL_OPERATOR_KEY, JSON.stringify(record));
    window.sessionStorage.setItem(
      LOCAL_SESSION_KEY,
      JSON.stringify({
        email: normalizedEmail,
        displayName: cleanName,
        issuedAt: Date.now(),
      } satisfies ActiveLocalSession),
    );
    setHasLocalOperatorSetup(true);
    setUser({
      email: normalizedEmail,
      displayName: cleanName,
      authSource: 'local-operator',
    });
    return { ok: true };
  }

  async function signOut() {
    if (isSupabaseConfigured && rawSupabase) {
      await rawSupabase.auth.signOut();
    }
    window.sessionStorage.removeItem(LOCAL_SESSION_KEY);
    setUser(null);
  }

  return (
    <AdminAuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: Boolean(user),
        isSupabaseMode: isSupabaseConfigured,
        hasLocalOperatorSetup,
        user,
        lockoutRemainingSec,
        signIn,
        registerLocalOperator,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }
  return ctx;
}
