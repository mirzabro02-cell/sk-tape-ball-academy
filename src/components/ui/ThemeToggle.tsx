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
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[10px] border transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]',
        showLabel ? 'h-10 px-3 text-xs font-semibold' : 'h-10 w-10',
        variant === 'header'
          ? 'border-white/15 bg-white/5 text-white hover:border-[#D5A52B]/60 hover:bg-white/10 hover:text-[#D5A52B]'
          : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] hover:border-[#D5A52B] hover:bg-white dark:border-white/15 dark:bg-[#162B4D] dark:text-white dark:hover:border-[#D5A52B]/60 dark:hover:text-[#D5A52B]',
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#D5A52B]" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 text-[#07152C] dark:text-[#D5A52B]" aria-hidden="true" />
      )}
      {showLabel && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  );
}
