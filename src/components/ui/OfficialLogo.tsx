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
  layout?: 'stacked' | 'inline';
}

export function OfficialLogo({
  tone = 'auto',
  to = '/',
  onClick,
  className,
  showWordmark = true,
  size = 'md',
  layout = 'stacked',
}: OfficialLogoProps) {
  const { state } = useAcademyState();
  const isForcedDark = tone === 'dark';
  const isForcedLight = tone === 'light';

  const logoSrc = state.siteSettings.logo.src || OFFICIAL_LOGO_CONFIG.src;
  const logoTransform = state.siteSettings.logo.transform;
  const academyName = state.siteSettings.academyName.trim() || 'SK Tape Ball Academy';

  const boxSize =
    size === 'lg'
      ? 'h-13 w-13 sm:h-14 sm:w-14'
      : size === 'sm'
        ? 'h-9 w-9'
        : 'h-10 w-10 sm:h-11 sm:w-11';

  const isDefaultAcademyName = academyName.toLowerCase() === 'sk tape ball academy';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'group inline-flex items-center gap-2.5 sm:gap-3 whitespace-nowrap shrink-0 rounded-[10px] py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#07152C]',
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
            'font-display font-extrabold uppercase whitespace-nowrap shrink-0',
            isForcedDark
              ? 'text-white'
              : isForcedLight
                ? 'text-[#07152C]'
                : 'text-[#07152C] dark:text-white',
          )}
        >
          {layout === 'stacked' && isDefaultAcademyName ? (
            <span className="flex flex-col leading-[0.94] tracking-[0.03em]">
              <span
                className={cn(
                  size === 'lg'
                    ? 'text-[19px] sm:text-[21px]'
                    : size === 'sm'
                      ? 'text-[15px]'
                      : 'text-[16px] sm:text-[18px]',
                )}
              >
                SK TAPE BALL
              </span>
              <span
                className={cn(
                  'tracking-[0.06em]',
                  size === 'lg'
                    ? 'text-[17px] sm:text-[18px]'
                    : size === 'sm'
                      ? 'text-[13px]'
                      : 'text-[14px] sm:text-[15px]',
                  isForcedDark
                    ? 'text-[#D5A83C]'
                    : isForcedLight
                      ? 'text-[#1E3F73]'
                      : 'text-[#1E3F73] dark:text-[#D5A83C]',
                )}
              >
                ACADEMY
              </span>
            </span>
          ) : (
            <span
              className={cn(
                'leading-none tracking-wide',
                size === 'lg'
                  ? 'text-xl sm:text-2xl'
                  : size === 'sm'
                    ? 'text-base'
                    : 'text-lg sm:text-[21px]',
              )}
            >
              {academyName}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
