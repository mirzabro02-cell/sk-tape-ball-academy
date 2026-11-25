import { useEffect, type ReactNode } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  X,
  XCircle,
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/utils/cn';

export function AdminDemoNotice({
  text,
}: {
  text?: string;
}) {
  if (!text) return null;
  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3 text-xs leading-relaxed text-[#071A36]">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#071A36]">{title}</h1>
        <p className="text-sm text-[#64748B]">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: typeof Info;
  tone?: 'default' | 'navy' | 'gold' | 'red';
}) {
  return (
    <div
      className={cn(
        'rounded-[14px] border p-5 space-y-3 transition-colors',
        tone === 'navy'
          ? 'border-[#071A36] bg-[#071A36] text-white'
          : 'border-[#E2E8F0] bg-white text-[#071A36]',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className={cn(
            'text-xs font-semibold uppercase tracking-wider',
            tone === 'navy' ? 'text-white/75' : 'text-[#64748B]',
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-[8px]',
            tone === 'navy'
              ? 'bg-white/10 text-[#D9A52E]'
              : tone === 'red'
                ? 'bg-[#C8202B]/10 text-[#C8202B]'
                : tone === 'gold'
                  ? 'bg-[#D9A52E]/15 text-[#071A36]'
                  : 'bg-[#F5F7FA] text-[#071A36]',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="text-2xl font-extrabold tracking-tight tabular-nums">{value}</p>
      <p className={cn('text-xs', tone === 'navy' ? 'text-white/70' : 'text-[#64748B]')}>
        {hint}
      </p>
    </div>
  );
}

export type AdminBadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'navy';

export function AdminStatusBadge({
  label,
  variant = 'neutral',
}: {
  label: string;
  variant?: AdminBadgeVariant;
}) {
  const styles: Record<AdminBadgeVariant, { classes: string; Icon: typeof Info }> = {
    success: {
      classes: 'border-[#D9A52E] bg-[#D9A52E]/15 text-[#071A36]',
      Icon: CheckCircle2,
    },
    navy: {
      classes: 'border-[#071A36]/25 bg-[#071A36] text-white',
      Icon: CheckCircle2,
    },
    warning: {
      classes: 'border-[#D9A52E]/50 bg-[#F5F7FA] text-[#071A36]',
      Icon: Clock,
    },
    danger: {
      classes: 'border-[#C8202B]/35 bg-[#C8202B]/10 text-[#C8202B]',
      Icon: XCircle,
    },
    neutral: {
      classes: 'border-[#E2E8F0] bg-[#F5F7FA] text-[#64748B]',
      Icon: AlertCircle,
    },
  };

  const { classes, Icon } = styles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap',
        classes,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function AdminModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
}) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const widthClass =
    maxWidth === 'md' ? 'max-w-lg' : maxWidth === 'xl' ? 'max-w-3xl' : 'max-w-2xl';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/65 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          'flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-2xl',
          widthClass,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-6 py-4">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-[#071A36]">{title}</h2>
            {subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function AdminConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  tone = 'danger',
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  tone?: 'danger' | 'primary';
}) {
  return (
    <AdminModal open={open} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-[#64748B]">{message}</p>
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={tone === 'danger' ? 'accent' : 'primary'}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </AdminModal>
  );
}

export function AdminPagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (nextPage: number) => void;
}) {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] bg-[#F5F7FA]/60 px-5 py-3 text-xs text-[#64748B]">
      <span className="tabular-nums">
        Page <strong className="text-[#071A36]">{page}</strong> of{' '}
        <strong className="text-[#071A36]">{Math.max(1, totalPages)}</strong> ({totalItems}{' '}
        records)
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#E2E8F0] bg-white px-2.5 text-xs font-medium text-[#071A36] hover:bg-[#F5F7FA] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Prev</span>
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#E2E8F0] bg-white px-2.5 text-xs font-medium text-[#071A36] hover:bg-[#F5F7FA] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center space-y-3">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FA] text-[#071A36]">
        <Info className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-bold text-[#071A36]">{title}</h3>
        <p className="text-xs leading-relaxed text-[#64748B]">{description}</p>
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
