import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export type AdminToastTone = 'success' | 'info' | 'warning';

export interface AdminToastItem {
  id: string;
  title: string;
  description?: string;
  tone: AdminToastTone;
}

interface AdminToastContextValue {
  showToast: (title: string, description?: string, tone?: AdminToastTone) => void;
}

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<AdminToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string, tone: AdminToastTone = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, tone }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 4200);
    },
    [],
  );

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Admin notifications"
        className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-[12px] border bg-white p-4 shadow-lg',
              toast.tone === 'warning'
                ? 'border-[#C8202B]/40'
                : toast.tone === 'info'
                  ? 'border-[#071A36]/25'
                  : 'border-[#D9A52E]',
            )}
          >
            <span className="mt-0.5 shrink-0">
              {toast.tone === 'warning' ? (
                <AlertCircle className="h-4 w-4 text-[#C8202B]" aria-hidden="true" />
              ) : toast.tone === 'info' ? (
                <Info className="h-4 w-4 text-[#071A36]" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-[#D9A52E]" aria-hidden="true" />
              )}
            </span>
            <div className="flex-1 space-y-0.5 text-left">
              <p className="text-xs font-bold text-[#071A36]">{toast.title}</p>
              {toast.description && (
                <p className="text-xs leading-relaxed text-[#64748B]">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="rounded-[6px] p-1 text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#071A36] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(AdminToastContext);
  if (!ctx) {
    return {
      showToast: (_title: string, _description?: string, _tone?: AdminToastTone) => {},
    };
  }
  return ctx;
}
