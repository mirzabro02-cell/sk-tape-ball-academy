import type { SelectHTMLAttributes } from 'react';
import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SelectOption } from '@/src/types/common';
import { cn } from '@/src/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export function Select({
  label,
  options,
  helperText,
  error,
  className,
  id,
  required,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const feedbackId = error || helperText ? `${selectId}-feedback` : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={selectId}
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
        <select
          id={selectId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={feedbackId}
          className={cn(
            'h-[48px] w-full appearance-none rounded-[10px] border bg-white pl-4 pr-10 text-sm text-[#07152C] transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none focus:ring-2 focus:ring-[#D5A83C]/40 focus:border-[#07152C] disabled:opacity-60 disabled:cursor-not-allowed dark:bg-[#09172E] dark:text-white dark:focus:border-[#D5A83C]',
            error
              ? 'border-[#C8202B] focus:border-[#C8202B] focus:ring-[#C8202B]/30 dark:border-[#F87171] dark:focus:border-[#F87171]'
              : 'border-[#CBD5E1] hover:border-[#94A3B8] dark:border-white/15 dark:hover:border-white/28',
            className,
          )}
          {...rest}
        >
          {options.map((option) => (
            <option
              key={option.value || option.label}
              value={option.value}
              className="bg-white text-[#07152C] dark:bg-[#0F213B] dark:text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#859BB9]"
          aria-hidden="true"
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
