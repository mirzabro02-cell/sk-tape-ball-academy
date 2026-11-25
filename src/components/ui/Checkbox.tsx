import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: string;
  error?: string;
}

export function Checkbox({
  label,
  description,
  error,
  className,
  id,
  checked,
  disabled,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-start gap-3 select-none',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className="peer sr-only"
            {...rest}
          />
          <span
            aria-hidden="true"
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-[6px] border transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-[#D5A52B] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-offset-[#07152C]',
              checked
                ? 'border-[#D5A52B] bg-[#D5A52B] text-[#050D1B] shadow-[0_4px_12px_-4px_rgba(213,165,43,0.65)]'
                : error
                  ? 'border-[#C8202B] bg-white dark:border-[#F87171] dark:bg-[#09172E]'
                  : 'border-[#CBD5E1] bg-white hover:border-[#07152C]/50 dark:border-white/25 dark:bg-[#09172E] dark:hover:border-[#D5A52B]/60',
            )}
          >
            {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </span>
        </span>

        <span className="flex flex-col gap-0.5 text-sm leading-snug text-[#07152C] dark:text-[#E2E8F0]">
          <span>{label}</span>
          {description && (
            <span className="text-xs text-[#64748B] dark:text-[#8499B8]">{description}</span>
          )}
        </span>
      </label>

      {error && (
        <p className="text-xs font-medium text-[#C8202B] dark:text-[#FCA5A5]">{error}</p>
      )}
    </div>
  );
}
