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
    'bg-[#D9A52E] text-[#050D1B] hover:bg-[#c59424] active:bg-[#b5861e] border border-transparent shadow-xs',
  secondary:
    'bg-[#071A36] text-white hover:bg-[#0c274e] active:bg-[#050D1B] border border-transparent shadow-xs',
  accent:
    'bg-[#C8202B] text-white hover:bg-[#b01a24] active:bg-[#99151e] border border-transparent shadow-xs',
  outline:
    'bg-white text-[#071A36] border border-[#E2E8F0] hover:border-[#071A36]/40 hover:bg-[#F5F7FA]',
  outlineLight:
    'bg-transparent text-white border border-white/25 hover:bg-white/10 hover:border-white/45',
  ghost:
    'bg-transparent text-[#071A36] border border-transparent hover:bg-[#071A36]/5',
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
    'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold tracking-tight whitespace-nowrap shrink-0 transition-all duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
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
