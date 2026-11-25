import { useId, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  helperText?: string;
  error?: string;
}

export function PasswordInput({
  label,
  helperText,
  error,
  className,
  id,
  required,
  ...rest
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-[#07152C] dark:text-[#E2E8F0] flex items-center gap-1"
      >
        <span>{label}</span>
        {required && (
          <span className="text-[#C8202B] dark:text-[#F87171]" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          required={required}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-[48px] w-full rounded-[10px] border bg-white pl-4 pr-12 text-sm text-[#07152C] placeholder:text-[#64748B]/75 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#D5A52B]/60 focus:border-[#07152C] dark:bg-[#07152C] dark:text-white dark:placeholder:text-[#8499B8] dark:focus:border-[#D5A52B]',
            error
              ? 'border-[#C8202B] dark:border-[#F87171]'
              : 'border-[#E2E8F0] dark:border-white/15',
            className,
          )}
          {...rest}
        />

        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#07152C] dark:text-[#8499B8] dark:hover:bg-white/10 dark:hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {error ? (
        <p className="text-xs font-medium text-[#C8202B] dark:text-[#FCA5A5]">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B] dark:text-[#8499B8]">{helperText}</p>
      ) : null}
    </div>
  );
}
