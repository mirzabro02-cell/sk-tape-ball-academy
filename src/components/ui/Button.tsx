import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'outlineLight';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

type ButtonAsButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined;
  };

type ButtonAsLinkProps = BaseButtonProps & {
  to: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-[#E0B136] to-[#D5A52B] text-[#050D1B] hover:from-[#EAC04F] hover:to-[#E2B84A] active:from-[#C99A22] active:to-[#BD8E1C] border border-[#F3D174]/35 shadow-[var(--shadow-gold)] hover:shadow-[var(--shadow-gold-hover)]',
  secondary:
    'bg-[#07152C] text-white hover:bg-[#0F213B] active:bg-[#050D1B] border border-[#07152C] shadow-sm dark:bg-[#0F213B] dark:text-white dark:border-[#D5A52B]/75 dark:hover:border-[#D5A52B] dark:hover:bg-[#162B4D] dark:hover:shadow-[0_10px_24px_-10px_rgba(213,165,43,0.42)]',
  accent:
    'bg-[#C8202B] text-white hover:bg-[#B01A24] active:bg-[#99151E] border border-[#E03A45]/30 shadow-sm',
  outline:
    'bg-white text-[#07152C] border border-[#CBD5E1] hover:border-[#07152C]/45 hover:bg-[#F5F7FA] dark:bg-[#0F213B]/90 dark:text-white dark:border-white/15 dark:hover:border-[#D5A52B]/65 dark:hover:bg-[#162B4D]',
  outlineLight:
    'bg-white/6 text-white border border-white/25 hover:bg-white/12 hover:border-[#D5A52B]/70',
  ghost:
    'bg-transparent text-[#07152C] border border-[#E2E8F0]/80 hover:border-[#07152C]/25 hover:bg-[#07152C]/5 dark:bg-[#0F213B]/35 dark:text-white/90 dark:border-white/15 dark:hover:border-[#D5A52B]/55 dark:hover:bg-[#162B4D]/75 dark:hover:text-white',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
};

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
  } = props;

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold tracking-tight whitespace-nowrap shrink-0 transition-all duration-150 ease-out cursor-pointer select-none hover:-translate-y-[1px] motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#07152C] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:translate-y-0 active:scale-[0.99]',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
    loading && 'pointer-events-none opacity-80',
    className,
  );

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="inline-flex shrink-0 items-center">{rightIcon}</span>
      )}
    </>
  );

  if ('to' in props && props.to !== undefined) {
    return (
      <Link
        to={props.to}
        onClick={props.onClick}
        aria-label={props.ariaLabel}
        aria-busy={loading || undefined}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    fullWidth: _fw,
    loading: _ld,
    leftIcon: _li,
    rightIcon: _ri,
    className: _cn,
    children: _ch,
    disabled,
    ...rest
  } = props;

  return (
    <button
      type={rest.type ?? 'button'}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
}
