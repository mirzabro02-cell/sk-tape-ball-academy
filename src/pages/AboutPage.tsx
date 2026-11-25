import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Compass, MapPin, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { ABOUT_PAGE_CONTENT } from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { sanitizeConfirmedText } from '@/src/utils/validation';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { buildMediaTransformStyle, MediaImage } from '@/src/components/ui/MediaImage';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function AboutPage() {
  useDocumentTitle('About Us');
  const { state } = useAcademyState();
  const { siteSettings } = state;

  const [ownerImgError, setOwnerImgError] = useState(false);

  const ownerPhotoSrc = siteSettings.ownerMedia?.src?.trim() || null;
  useEffect(() => {
    setOwnerImgError(false);
  }, [ownerPhotoSrc]);

  const hasOwnerPhoto = Boolean(ownerPhotoSrc) && !ownerImgError;

  const academyName = sanitizeConfirmedText(siteSettings.academyName) || ABOUT_PAGE_CONTENT.title;
  const tagline = sanitizeConfirmedText(siteSettings.tagline);
  const founderName = sanitizeConfirmedText(siteSettings.founderName);
  const founderRole = sanitizeConfirmedText(siteSettings.founderRole) || 'Founder / Owner';
  const locationText = sanitizeConfirmedText(siteSettings.locationText);
  const launchedNote = sanitizeConfirmedText(siteSettings.launchedNote);

  const storyParagraphs = siteSettings.aboutStory
    .split(/\n\s*\n/)
    .map((p) => sanitizeConfirmedText(p))
    .filter(Boolean);

  const missionText = sanitizeConfirmedText(siteSettings.aboutMission);
  const visionText = sanitizeConfirmedText(siteSettings.aboutVision);
  const valuesList = (siteSettings.aboutValues ?? [])
    .map((item) => sanitizeConfirmedText(item))
    .filter(Boolean);

  const hasFounderSection =
    Boolean(founderName) ||
    storyParagraphs.length > 0 ||
    hasOwnerPhoto ||
    Boolean(locationText) ||
    Boolean(launchedNote);

  const hasPurposeSection = Boolean(missionText) || Boolean(visionText) || valuesList.length > 0;

  return (
    <div>
      {/* Full-Bleed Edge-to-Edge Hero Directly Beneath Top Navigation */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative w-full overflow-hidden border-b border-white/10 bg-[#07152C] text-white"
      >
        <div className="absolute inset-0">
          <MediaImage
            src={heroImg}
            alt="Evening floodlit cricket training ground at SK Tape Ball Academy"
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

        <PageContainer className="relative z-10 flex min-h-[340px] sm:min-h-[400px] lg:min-h-[440px] items-center py-12 sm:py-16">
          <div className="max-w-2xl space-y-4 sm:space-y-5">
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
              <span className="text-[#D5A83C] font-semibold">About Us</span>
            </nav>

            <h1
              id="about-hero-heading"
              className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold uppercase leading-[0.98] tracking-tight text-white [text-wrap:balance] drop-shadow-[0_2px_14px_rgba(5,13,27,0.65)]"
            >
              {academyName}
            </h1>

            <p className="max-w-xl text-sm sm:text-base lg:text-[17px] leading-relaxed text-[#E2E8F0] drop-shadow-[0_1px_8px_rgba(5,13,27,0.6)]">
              {tagline ? (
                <>
                  <span className="font-semibold text-[#D5A83C]">{tagline}</span>{' '}
                </>
              ) : null}
              {founderName
                ? `Founded by ${founderName} to give young cricketers access to quality training, professional coaching, and meaningful opportunities.`
                : ABOUT_PAGE_CONTENT.heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Button to="/programs" variant="primary" size="lg" shape="pill">
                <span>Explore Programs</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button to="/register" variant="outlineLight" size="lg" shape="pill">
                <span>Register Now</span>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="mt-10 sm:mt-14 space-y-12 sm:space-y-16">
        {/* Founder Story & Admin-Controlled Owner Photo */}
        {hasFounderSection && (
          <section aria-labelledby="founder-story-heading">
              <div
                className={
                  hasOwnerPhoto
                    ? 'grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center'
                    : 'w-full'
                }
              >
                <div className={hasOwnerPhoto ? 'lg:col-span-7 space-y-5' : 'max-w-4xl space-y-5'}>
                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#D5A83C]">
                      Founder Story
                    </p>
                    <h2
                      id="founder-story-heading"
                      className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#07152C] dark:text-white [text-wrap:balance]"
                    >
                      {founderName || 'Founder Story'}
                    </h2>
                    {founderName && (
                      <p className="text-sm font-semibold text-[#9A6F0A] dark:text-[#D5A83C]">
                        {founderRole}
                      </p>
                    )}
                  </div>

                  {storyParagraphs.length > 0 && (
                    <div className="space-y-3.5">
                      {storyParagraphs.map((paragraph, idx) => (
                        <p
                          key={`${idx}-${paragraph.slice(0, 24)}`}
                          className="text-sm sm:text-base leading-relaxed text-[#334155] dark:text-[#C8D5E8]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {(launchedNote || locationText) && (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E2E8F0] pt-4 text-xs sm:text-sm text-[#475569] dark:border-white/10 dark:text-[#B8C7DF]">
                      {launchedNote && (
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays
                            className="h-4 w-4 shrink-0 text-[#C8202B] dark:text-[#D5A83C]"
                            aria-hidden="true"
                          />
                          <span>{launchedNote}</span>
                        </span>
                      )}
                      {locationText && (
                        <span className="inline-flex items-center gap-2">
                          <MapPin
                            className="h-4 w-4 shrink-0 text-[#C8202B] dark:text-[#D5A83C]"
                            aria-hidden="true"
                          />
                          <span>Operating in {locationText}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {hasOwnerPhoto && ownerPhotoSrc && (
                  <div className="lg:col-span-5">
                    <figure className="overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-white shadow-[0_18px_40px_-24px_rgba(5,13,27,0.28)] dark:border-white/12 dark:bg-[#0B1B36]">
                      <div className="aspect-[4/5] w-full overflow-hidden bg-[#07152C]">
                        <img
                          src={ownerPhotoSrc}
                          alt={
                            founderName
                              ? `${founderName} — ${founderRole} of ${academyName}`
                              : `${academyName} ${founderRole}`
                          }
                          loading="eager"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() => setOwnerImgError(true)}
                          style={buildMediaTransformStyle(siteSettings.ownerMedia.transform)}
                          className="h-full w-full transition-transform duration-150 ease-out"
                        />
                      </div>
                      {founderName && (
                        <figcaption className="flex items-center justify-between gap-3 border-t border-[#E2E8F0] px-5 py-3.5 dark:border-white/10">
                          <span className="text-sm font-bold text-[#07152C] dark:text-white">
                            {founderName}
                          </span>
                          <span className="text-xs font-semibold text-[#9A6F0A] dark:text-[#D5A83C]">
                            {founderRole}
                          </span>
                        </figcaption>
                      )}
                    </figure>
                  </div>
                )}
              </div>
            </section>
        )}

        {/* Mission, Vision & Values */}
        {hasPurposeSection && (
          <section aria-labelledby="mission-vision-heading" className="space-y-6">
              <SectionHeader
                id="mission-vision-heading"
                kicker="Purpose & Standards"
                title="Mission, Vision & Values"
              />

              {(missionText || visionText) && (
                <div
                  className={
                    missionText && visionText
                      ? 'grid grid-cols-1 gap-6 md:grid-cols-2'
                      : 'grid grid-cols-1'
                  }
                >
                  {missionText && (
                    <Card tone="navy" padding="lg" className="space-y-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#D5A83C]/40 bg-[#050D1B] text-[#D5A83C]">
                        <Target className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {ABOUT_PAGE_CONTENT.mission.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed text-[#C8D5E8]">
                        {missionText}
                      </p>
                    </Card>
                  )}

                  {visionText && (
                    <Card padding="lg" className="space-y-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A83C] dark:border dark:border-white/10 dark:bg-[#162B4D]">
                        <Compass className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-bold text-[#07152C] dark:text-white">
                        {ABOUT_PAGE_CONTENT.vision.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#C8D5E8]">
                        {visionText}
                      </p>
                    </Card>
                  )}
                </div>
              )}

              {valuesList.length > 0 && (
                <Card padding="md" className="space-y-3.5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#D5A83C]">
                    Core Values
                  </h3>
                  <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                    {valuesList.map((val) => (
                      <li
                        key={val}
                        className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#07152C] dark:border-white/12 dark:bg-[#09172E] dark:text-white"
                      >
                        {val}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </section>
        )}
      </PageContainer>
    </div>
  );
}
