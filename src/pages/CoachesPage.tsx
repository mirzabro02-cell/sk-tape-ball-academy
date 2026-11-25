import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import type { AdminCoach } from '@/src/types/admin';
import { sanitizeConfirmedText } from '@/src/utils/validation';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { Card } from '@/src/components/ui/Card';
import { buildMediaTransformStyle, MediaImage } from '@/src/components/ui/MediaImage';

interface VerifiedCoachViewModel extends AdminCoach {
  fullName: string;
  roleTitle: string;
  bio: string;
  experienceLabel: string;
  specialties: string[];
  imageSrc: string | null;
}

function VerifiedCoachCard({
  coach,
  index,
  prefersReduced,
}: {
  coach: VerifiedCoachViewModel;
  index: number;
  prefersReduced: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [coach.imageSrc]);

  const hasPhoto = Boolean(coach.imageSrc) && !imgError;
  const coachRouteSlug = coach.slug || coach.id;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReduced ? 0 : 0.32,
        delay: prefersReduced ? 0 : index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <article className="group">
        <Card
          padding="none"
          className="overflow-hidden flex flex-col transition-[transform,border-color,box-shadow] duration-200 ease-out group-hover:-translate-y-1 group-hover:border-[#D5A83C]/80 group-hover:shadow-[0_16px_36px_-16px_rgba(213,168,60,0.38)] dark:group-hover:border-[#D5A83C]/75 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        >
          {hasPhoto && coach.imageSrc && (
            <div className="aspect-[4/5] w-full overflow-hidden border-b border-[#E2E8F0] bg-[#07152C] dark:border-white/10">
              <img
                src={coach.imageSrc}
                alt={`${coach.fullName} — ${coach.roleTitle}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                style={buildMediaTransformStyle(coach.imageTransform)}
                className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
          )}

          <div className="flex flex-1 flex-col justify-between gap-4 p-6">
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C8202B] dark:text-[#D5A83C]">
                {coach.roleTitle}
              </p>

              <h2 className="text-xl font-bold tracking-tight text-[#07152C] dark:text-white">
                {coach.fullName}
              </h2>

              {coach.experienceLabel && (
                <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  {coach.experienceLabel}
                </p>
              )}

              {coach.bio && (
                <p className="pt-1 text-sm leading-relaxed text-[#475569] dark:text-[#C8D5E8]">
                  {coach.bio}
                </p>
              )}

              {coach.specialties.length > 0 && (
                <p className="pt-1 text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
                  {coach.specialties.join(' · ')}
                </p>
              )}
            </div>

            <div className="border-t border-[#E2E8F0] pt-4 dark:border-white/10">
              <Link
                to={`/coaches/${coachRouteSlug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#CBD5E1] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#07152C] transition-colors hover:border-[#D5A83C] hover:bg-[#07152C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C] dark:border-white/15 dark:text-white dark:hover:border-[#D5A83C] dark:hover:bg-[#D5A83C] dark:hover:text-[#050D1B]"
              >
                <span>View Profile</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Card>
      </article>
    </motion.div>
  );
}

export function CoachesPage() {
  useDocumentTitle('Coaches');
  const { state } = useAcademyState();
  const { siteSettings } = state;
  const prefersReduced = useReducedMotion();

  const academyName = sanitizeConfirmedText(siteSettings.academyName) || 'SK Tape Ball Academy';

  const publishedCoaches: VerifiedCoachViewModel[] = state.coaches
    .filter((coach) => coach.published !== false)
    .map((coach) => ({
      ...coach,
      fullName: sanitizeConfirmedText(coach.fullName),
      roleTitle: sanitizeConfirmedText(coach.roleTitle),
      bio: sanitizeConfirmedText(coach.bio),
      experienceLabel: sanitizeConfirmedText(coach.experienceLabel),
      specialties: (coach.specialties ?? [])
        .map((item) => sanitizeConfirmedText(item))
        .filter(Boolean),
      imageSrc: coach.imageSrc?.trim() || null,
    }))
    .filter((coach) => Boolean(coach.fullName) && Boolean(coach.roleTitle));

  const gridColumnsClass =
    publishedCoaches.length === 1
      ? 'grid grid-cols-1 items-start max-w-md'
      : publishedCoaches.length === 2
        ? 'grid grid-cols-1 items-start gap-6 md:grid-cols-2 max-w-4xl'
        : publishedCoaches.length === 3
          ? 'grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3'
          : 'grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-4';

  return (
    <div>
      {/* Full-Bleed Edge-to-Edge Hero Directly Beneath Navigation */}
      <section
        aria-labelledby="coaches-hero-heading"
        className="relative w-full overflow-hidden border-b border-white/10 bg-[#07152C] text-white"
      >
        <div className="absolute inset-0">
          <MediaImage
            src={heroImg}
            alt="Evening floodlit cricket training ground"
            transform={{ fit: 'cover', posX: 50, posY: 45, scale: 1 }}
            fallbackLabel={academyName}
            priority
            className="h-full w-full"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#050D1B]/95 via-[#07152C]/82 to-[#07152C]/45 sm:via-[#07152C]/72 sm:to-[#07152C]/30"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#050D1B]/80 via-transparent to-[#07152C]/35"
          />
        </div>

        <PageContainer className="relative z-10 flex min-h-[300px] sm:min-h-[360px] lg:min-h-[390px] items-center py-12 sm:py-16">
          <div className="max-w-2xl space-y-4">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs font-medium text-[#C8D5E8]"
            >
              <Link to="/" className="hover:text-[#D5A83C] transition-colors">
                Home
              </Link>
              <span aria-hidden="true" className="text-white/40">
                /
              </span>
              <span className="text-[#D5A83C] font-semibold">Coaches</span>
            </nav>

            <h1
              id="coaches-hero-heading"
              className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold uppercase leading-[0.98] tracking-tight text-white [text-wrap:balance] drop-shadow-[0_2px_14px_rgba(5,13,27,0.65)]"
            >
              Coaches
            </h1>

            <p className="max-w-xl text-sm sm:text-base lg:text-[17px] leading-relaxed text-[#E2E8F0] drop-shadow-[0_1px_8px_rgba(5,13,27,0.6)]">
              Structured tape-ball cricket coaching focused on fitness, batting, bowling, and fielding at {academyName}.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Verified Published Coach Profiles — hidden completely when none are published */}
      {publishedCoaches.length > 0 && (
        <PageContainer className="mt-10 sm:mt-14 pb-12 sm:pb-16">
          <section aria-label="Published Coaching Profiles">
            <div className={gridColumnsClass}>
              {publishedCoaches.map((coach, index) => (
                <VerifiedCoachCard
                  key={coach.id}
                  coach={coach}
                  index={index}
                  prefersReduced={prefersReduced}
                />
              ))}
            </div>
          </section>
        </PageContainer>
      )}
    </div>
  );
}
