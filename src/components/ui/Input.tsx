import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/src/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export function Input({
  label,
  helperText,
  error,
  leftIcon,
  className,
  id,
  required,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const feedbackId = error || helperText ? `${inputId}-feedback` : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-[#07152C] dark:text-[#E2E8F0] flex items-center gap-1"
        >
          <span>{label}</span>
          {required && (
            <span className="text-[#C8202B] dark:text-[#F87171]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#859BB9]"
          >
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={feedbackId}
          className={cn(
            'h-[48px] w-full rounded-[10px] border bg-white text-sm text-[#07152C] placeholder:text-[#64748B]/85 transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none focus:ring-2 focus:ring-[#D5A83C]/40 focus:border-[#07152C] disabled:opacity-60 disabled:cursor-not-allowed dark:bg-[#09172E] dark:text-white dark:placeholder:text-[#859BB9]/85 dark:focus:border-[#D5A83C]',
            leftIcon ? 'pl-10 pr-4' : 'px-4',
            error
              ? 'border-[#C8202B] focus:border-[#C8202B] focus:ring-[#C8202B]/30 dark:border-[#F87171] dark:focus:border-[#F87171]'
              : 'border-[#CBD5E1] hover:border-[#94A3B8] dark:border-white/15 dark:hover:border-white/28',
            className,
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p id={feedbackId} className="text-xs font-medium text-[#C8202B] dark:text-[#FCA5A5]">
          {error}
        </p>
      ) : helperText ? (
        <p id={feedbackId} className="text-xs text-[#64748B] dark:text-[#859BB9]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
