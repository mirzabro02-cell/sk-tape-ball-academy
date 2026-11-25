import type { TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '@/src/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export function Textarea({
  label,
  helperText,
  error,
  className,
  id,
  required,
  rows = 4,
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-[#07152C] dark:text-[#E2E8F0] flex items-center gap-1"
        >
          <span>{label}</span>
          {required && (
            <span className="text-[#C8202B] dark:text-[#F87171]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        className={cn(
          'min-h-[108px] w-full rounded-[10px] border bg-white px-4 py-3 text-sm text-[#07152C] placeholder:text-[#64748B]/75 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#D5A52B]/60 focus:border-[#07152C] dark:bg-[#07152C] dark:text-white dark:placeholder:text-[#8499B8] dark:focus:border-[#D5A52B]',
          error
            ? 'border-[#C8202B] dark:border-[#F87171]'
            : 'border-[#E2E8F0] dark:border-white/15',
          className,
        )}
        {...rest}
      />
      {error ? (
        <p className="text-xs font-medium text-[#C8202B] dark:text-[#FCA5A5]">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B] dark:text-[#8499B8]">{helperText}</p>
      ) : null}
    </div>
  );
}
