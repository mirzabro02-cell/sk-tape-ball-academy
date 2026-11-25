import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'outlineLight';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'pill';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
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
    'bg-gradient-to-b from-[#E4BC54] to-[#D5A83C] text-[#050D1B] hover:from-[#ECC96B] hover:to-[#E0B347] active:from-[#C7992D] active:to-[#B88B21] border border-[#F5D988]/45 shadow-[var(--shadow-gold)] hover:shadow-[var(--shadow-gold-hover)]',
  secondary:
    'bg-[#07152C] text-white hover:bg-[#101D35] active:bg-[#050D1B] border border-[#07152C] shadow-sm dark:bg-[#0F213B] dark:text-white dark:border-[#D5A83C]/65 dark:hover:border-[#D5A83C] dark:hover:bg-[#162B4D] dark:hover:shadow-[0_10px_24px_-10px_rgba(213,168,60,0.42)]',
  accent:
    'bg-[#C8202B] text-white hover:bg-[#B01A24] active:bg-[#99151E] border border-[#E03A45]/35 shadow-sm',
  outline:
    'bg-white text-[#07152C] border border-[#CBD5E1] hover:border-[#07152C]/45 hover:bg-[#F4F6FA] dark:bg-[#0F213B]/90 dark:text-white dark:border-white/16 dark:hover:border-[#D5A83C]/65 dark:hover:bg-[#162B4D]',
  outlineLight:
    'bg-white/8 text-white border border-white/25 hover:bg-white/14 hover:border-[#D5A83C]/75',
  ghost:
    'bg-transparent text-[#07152C] border border-[#E2E8F0]/80 hover:border-[#07152C]/25 hover:bg-[#07152C]/5 dark:bg-[#0F213B]/40 dark:text-white/90 dark:border-white/15 dark:hover:border-[#D5A83C]/55 dark:hover:bg-[#162B4D]/80 dark:hover:text-white',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
};

const SHAPE_CLASSES: Record<ButtonShape, string> = {
  default: 'rounded-[10px]',
  pill: 'rounded-full',
};

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    shape = 'default',
    className,
    children,
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
  } = props;

  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold tracking-tight whitespace-nowrap shrink-0 transition-all duration-150 ease-out cursor-pointer select-none hover:-translate-y-[1px] motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#07152C] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:translate-y-0 active:scale-[0.99]',
    SHAPE_CLASSES[shape],
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
    shape: _sh,
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
