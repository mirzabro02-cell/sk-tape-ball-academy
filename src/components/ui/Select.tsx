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

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={selectId}
        className="text-sm font-medium text-[#071A36] flex items-center gap-1"
      >
        <span>{label}</span>
        {required && (
          <span className="text-[#C8202B]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="relative">
        <select
          id={selectId}
          required={required}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-[50px] w-full appearance-none rounded-[10px] border bg-white pl-4 pr-10 text-sm text-[#071A36] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#D9A52E]/60 focus:border-[#071A36]',
            error ? 'border-[#C8202B]' : 'border-[#E2E8F0]',
            className,
          )}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value || option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p className="text-xs font-medium text-[#C8202B]">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B]">{helperText}</p>
      ) : null}
    </div>
  );
}
