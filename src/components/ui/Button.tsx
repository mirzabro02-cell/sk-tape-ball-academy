import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'outlineLight';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
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
    'bg-[#D5A52B] text-[#050D1B] hover:bg-[#E2B84A] active:bg-[#C39522] border border-transparent shadow-sm',
  secondary:
    'bg-[#07152C] text-white hover:bg-[#0F213B] active:bg-[#050D1B] border border-transparent shadow-sm dark:bg-[#162B4D] dark:hover:bg-[#1E3963] dark:border-white/10',
  accent:
    'bg-[#C8202B] text-white hover:bg-[#B01A24] active:bg-[#99151E] border border-transparent shadow-sm',
  outline:
    'bg-white text-[#07152C] border border-[#E2E8F0] hover:border-[#07152C]/40 hover:bg-[#F5F7FA] dark:bg-[#0F213B] dark:text-white dark:border-white/15 dark:hover:border-[#D5A52B]/60 dark:hover:bg-[#162B4D]',
  outlineLight:
    'bg-white/5 text-white border border-white/25 hover:bg-white/12 hover:border-[#D5A52B]/60',
  ghost:
    'bg-transparent text-[#07152C] border border-transparent hover:bg-[#07152C]/5 dark:text-white/85 dark:hover:bg-white/10',
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
  } = props;

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold tracking-tight whitespace-nowrap shrink-0 transition-all duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#07152C] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
    className,
  );

  if ('to' in props && props.to !== undefined) {
    return (
      <Link
        to={props.to}
        onClick={props.onClick}
        aria-label={props.ariaLabel}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, fullWidth: _fw, className: _cn, children: _ch, ...rest } = props;
  return (
    <button type={rest.type ?? 'button'} className={classes} {...rest}>
      {children}
    </button>
  );
}
