import { Link } from 'react-router-dom';
import { OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { buildMediaTransformStyle } from '@/src/components/ui/MediaImage';
import { cn } from '@/src/utils/cn';

export interface OfficialLogoProps {
  tone?: 'auto' | 'light' | 'dark';
  to?: string;
  onClick?: () => void;
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function OfficialLogo({
  tone = 'auto',
  to = '/',
  onClick,
  className,
  showWordmark = true,
  size = 'md',
}: OfficialLogoProps) {
  const { state } = useAcademyState();
  const isForcedDark = tone === 'dark';
  const isForcedLight = tone === 'light';

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
        'group inline-flex items-center gap-2.5 sm:gap-3 whitespace-nowrap shrink-0 rounded-[10px] py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[8px] transition-transform duration-150 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100',
          boxSize,
        )}
      >
        <img
          src={logoSrc}
          alt={`${academyName} Official Crest`}
          referrerPolicy="no-referrer"
          style={buildMediaTransformStyle({
            ...logoTransform,
            fit: logoTransform?.fit ?? 'contain',
          })}
          className="h-full w-full"
        />
      </span>

      {showWordmark && (
        <span
          className={cn(
            'font-display text-lg sm:text-[21px] font-extrabold uppercase tracking-wide whitespace-nowrap shrink-0 leading-none',
            isForcedDark
              ? 'text-white'
              : isForcedLight
                ? 'text-[#07152C]'
                : 'text-[#07152C] dark:text-white',
          )}
        >
          {academyName}
        </span>
      )}
    </Link>
  );
}
