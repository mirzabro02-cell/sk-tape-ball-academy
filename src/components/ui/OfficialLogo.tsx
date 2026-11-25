import { Link } from 'react-router-dom';
import { OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { buildMediaTransformStyle } from '@/src/components/ui/MediaImage';
import { cn } from '@/src/utils/cn';

export interface OfficialLogoProps {
  tone?: 'light' | 'dark';
  to?: string;
  onClick?: () => void;
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function OfficialLogo({
  tone = 'light',
  to = '/',
  onClick,
  className,
  showWordmark = true,
  size = 'md',
}: OfficialLogoProps) {
  const { state } = useAcademyState();
  const isDarkSurface = tone === 'dark';

  const logoSrc = state.siteSettings.logo.src || OFFICIAL_LOGO_CONFIG.src;
  const logoTransform = state.siteSettings.logo.transform;
  const academyName = state.siteSettings.academyName;

  const boxSize =
    size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E] rounded-[10px] py-0.5',
        className,
      )}
    >
      <span className={cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[8px]', boxSize)}>
        <img
          src={logoSrc}
          alt={`${academyName} Official Crest`}
          referrerPolicy="no-referrer"
          style={buildMediaTransformStyle({ ...logoTransform, fit: logoTransform?.fit ?? 'contain' })}
          className="h-full w-full"
        />
      </span>

      {showWordmark && (
        <span
          className={cn(
            'font-[var(--font-heading)] text-[15px] sm:text-lg font-bold tracking-tight whitespace-nowrap shrink-0',
            isDarkSurface ? 'text-white' : 'text-[#071A36]',
          )}
        >
          {academyName}
        </span>
      )}
    </Link>
  );
}
