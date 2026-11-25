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
      <label
        htmlFor={textareaId}
        className="text-sm font-medium text-[#071A36] flex items-center gap-1"
      >
        <span>{label}</span>
        {required && (
          <span className="text-[#C8202B]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        className={cn(
          'min-h-[112px] w-full rounded-[10px] border bg-white px-4 py-3 text-sm text-[#071A36] placeholder:text-[#64748B]/75 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#D9A52E]/60 focus:border-[#071A36]',
          error ? 'border-[#C8202B]' : 'border-[#E2E8F0]',
          className,
        )}
        {...rest}
      />
      {error ? (
        <p className="text-xs font-medium text-[#C8202B]">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B]">{helperText}</p>
      ) : null}
    </div>
  );
}
