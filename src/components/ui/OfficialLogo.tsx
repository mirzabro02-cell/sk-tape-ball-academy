import { Link } from 'react-router-dom';
import { OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { cn } from '@/src/utils/cn';

export interface OfficialLogoProps {
  tone?: 'light' | 'dark';
  to?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Official Logo Slot
 *
 * Displays the unmodified official logo image when `OFFICIAL_LOGO_CONFIG.src`
 * is provided in `src/assets/branding.ts`. While awaiting the supplied file,
 * renders a clean, clearly marked official logo placeholder slot alongside the
 * academy wordmark without inventing or fabricating a crest.
 */
export function OfficialLogo({
  tone = 'light',
  to = '/',
  onClick,
  className,
}: OfficialLogoProps) {
  const isDarkSurface = tone === 'dark';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E] rounded-[10px] py-1',
        className,
      )}
    >
      {OFFICIAL_LOGO_CONFIG.src ? (
        <img
          src={OFFICIAL_LOGO_CONFIG.src}
          alt={OFFICIAL_LOGO_CONFIG.alt}
          referrerPolicy="no-referrer"
          className="h-10 w-auto object-contain shrink-0"
        />
      ) : (
        <span
          aria-label="Official Logo Placeholder Slot"
          title="Place supplied official logo file in src/assets/branding.ts"
          className={cn(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border text-[11px] font-bold tracking-wider select-none',
            isDarkSurface
              ? 'border-[#D9A52E]/50 bg-[#050D1B] text-[#D9A52E]'
              : 'border-[#071A36]/20 bg-[#071A36] text-[#D9A52E]',
          )}
        >
          LOGO
        </span>
      )}

      <span
        className={cn(
          'font-[var(--font-heading)] text-base sm:text-lg font-bold tracking-tight whitespace-nowrap shrink-0',
          isDarkSurface ? 'text-white' : 'text-[#071A36]',
        )}
      >
        {ACADEMY_BRAND.name}
      </span>
    </Link>
  );
}
