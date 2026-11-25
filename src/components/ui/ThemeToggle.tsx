import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';
import { cn } from '@/src/utils/cn';

export interface ThemeToggleProps {
  variant?: 'header' | 'surface';
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  variant = 'header',
  showLabel = false,
  className,
}: ThemeToggleProps) {
  const { isDark, setTheme } = useTheme();

  if (showLabel) {
    return (
      <div
        role="group"
        aria-label="Theme mode selector"
        className={cn(
          'inline-flex items-center rounded-full border p-1 transition-colors duration-150',
          'border-[#CBD5E1] bg-white dark:border-white/15 dark:bg-[#0F213B]',
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          aria-pressed={!isDark}
          aria-label="Activate Light Mode"
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]',
            !isDark
              ? 'bg-[#D5A83C] text-[#050D1B] shadow-xs'
              : 'text-[#9FB2CD] hover:text-white',
          )}
        >
          <Sun className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          aria-pressed={isDark}
          aria-label="Activate Dark Mode"
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]',
            isDark
              ? 'bg-[#D5A83C] text-[#050D1B] shadow-xs'
              : 'text-[#475569] hover:text-[#07152C]',
          )}
        >
          <Moon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme mode selector"
      className={cn(
        'inline-flex h-10 items-center rounded-full border p-1 transition-colors duration-150 shrink-0',
        variant === 'header'
          ? 'border-[#CBD5E1] bg-[#F4F6FA] dark:border-white/15 dark:bg-[#0B1B36]'
          : 'border-[#CBD5E1] bg-[#F4F6FA] dark:border-white/15 dark:bg-[#162B4D]',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        aria-label="Switch to Light Mode"
        title="Light Mode"
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]',
          !isDark
            ? 'bg-[#D5A83C] text-[#050D1B] shadow-xs'
            : 'text-[#9FB2CD] hover:text-white',
        )}
      >
        <Sun className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        aria-label="Switch to Dark Mode"
        title="Dark Mode"
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]',
          isDark
            ? 'bg-[#D5A83C] text-[#050D1B] shadow-xs'
            : 'text-[#475569] hover:text-[#07152C]',
        )}
      >
        <Moon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
