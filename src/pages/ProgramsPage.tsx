import { Activity, Crosshair, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';
import battingImg from '@/src/assets/images/drill_power_batting_1795439224792.jpg';
import paceImg from '@/src/assets/images/drill_pace_bowling_1795439224452.jpg';
import fieldingImg from '@/src/assets/images/drill_fielding_agility_1795439226739.jpg';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { sanitizeConfirmedText } from '@/src/utils/validation';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { Card } from '@/src/components/ui/Card';
import { MediaImage } from '@/src/components/ui/MediaImage';

interface ConfirmedProgramDefinition {
  id: string;
  code: string;
  title: string;
  legacyDefaultTitle: string;
  description: string;
  legacyDefaultDescriptionPrefix: string;
  imagePath: string;
  imageAlt: string;
  icon: typeof Activity;
}

const CONFIRMED_PROGRAMS: ConfirmedProgramDefinition[] = [
  {
    id: 'prog-fitness',
    code: '01',
    title: 'Fitness',
    legacyDefaultTitle: 'Athletic Fitness & Conditioning',
    description:
      'Athletic conditioning for stamina, power, speed, mobility, flexibility, and elasticity.',
    legacyDefaultDescriptionPrefix: 'Around 200 structured exercises',
    imagePath: lanesImg,
    imageAlt: 'Cricket conditioning and fitness drill lanes',
    icon: Activity,
  },
  {
    id: 'prog-batting',
    code: '02',
    title: 'Tape Ball Batting',
    legacyDefaultTitle: 'Tape Ball Batting',
    description:
      'Player assessment and focused practice to develop shot technique, timing, control, and consistency.',
    legacyDefaultDescriptionPrefix: 'Individual strengths and weaknesses assessment',
    imagePath: battingImg,
    imageAlt: 'Tape ball batting stance and shot practice visual',
    icon: Target,
  },
  {
    id: 'prog-bowling',
    code: '03',
    title: 'Tape Ball Bowling',
    legacyDefaultTitle: 'Tape Ball Bowling',
    description: 'Drills focused on bowling speed, accuracy, line, and length.',
    legacyDefaultDescriptionPrefix: 'Targeted drills to build raw pace',
    imagePath: paceImg,
    imageAlt: 'Tape ball bowling delivery and target accuracy visual',
    icon: Zap,
  },
  {
    id: 'prog-fielding',
    code: '04',
    title: 'Fielding',
    legacyDefaultTitle: 'Fielding & Catching',
    description: 'Catching and ground-fielding drills for movement, reaction, and control.',
    legacyDefaultDescriptionPrefix: 'Complete fielding routines covering',
    imagePath: fieldingImg,
    imageAlt: 'Cricket fielding and catching agility visual',
    icon: Crosshair,
  },
];

export function ProgramsPage() {
  useDocumentTitle('Training Programs');
  const { state } = useAcademyState();
  const { siteSettings } = state;
  const prefersReduced = useReducedMotion();

  const academyName = sanitizeConfirmedText(siteSettings.academyName) || 'SK Tape Ball Academy';

  const visiblePrograms = CONFIRMED_PROGRAMS.filter((item) => {
    const cmsRecord = state.programs.find((p) => p.id === item.id);
    return cmsRecord ? cmsRecord.published !== false : true;
  }).map((item) => {
    const cmsRecord = state.programs.find((p) => p.id === item.id);
    const cmsTitle = sanitizeConfirmedText(cmsRecord?.title);
    const cmsDesc = sanitizeConfirmedText(cmsRecord?.description);

    const resolvedTitle =
      cmsTitle && cmsTitle !== item.legacyDefaultTitle ? cmsTitle : item.title;

    const usesLegacyDefaultDescription =
      cmsDesc.startsWith(item.legacyDefaultDescriptionPrefix);

    const resolvedDescription =
      cmsDesc && !usesLegacyDefaultDescription ? cmsDesc : item.description;

    const resolvedImage = cmsRecord?.imagePath?.trim() || item.imagePath;

    return {
      ...item,
      title: resolvedTitle,
      description: resolvedDescription,
      imageSrc: resolvedImage,
      imageTransform: cmsRecord?.imageTransform,
    };
  });

  return (
    <div>
      {/* Full-Bleed Edge-to-Edge Hero Directly Beneath Navigation */}
      <section
        aria-labelledby="programs-hero-heading"
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
              <span className="text-[#D5A83C] font-semibold">Training Programs</span>
            </nav>

            <h1
              id="programs-hero-heading"
              className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold uppercase leading-[0.98] tracking-tight text-white [text-wrap:balance] drop-shadow-[0_2px_14px_rgba(5,13,27,0.65)]"
            >
              Training Programs
            </h1>

            <p className="max-w-xl text-sm sm:text-base lg:text-[17px] leading-relaxed text-[#E2E8F0] drop-shadow-[0_1px_8px_rgba(5,13,27,0.6)]">
              Four core tape-ball cricket development areas at {academyName}.
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Four Confirmed Program Cards: 4 cols desktop, 2 cols tablet, 1 col mobile */}
      {visiblePrograms.length > 0 && (
        <PageContainer className="mt-10 sm:mt-14">
          <section aria-label="Core Training Areas">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {visiblePrograms.map((program, index) => {
                const Icon = program.icon;

                return (
                  <motion.div
                    key={program.id}
                    initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: prefersReduced ? 0 : 0.32,
                      delay: prefersReduced ? 0 : index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full"
                  >
                    <article
                      tabIndex={0}
                      aria-label={program.title}
                      className="group h-full touch-manipulation rounded-[16px] outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
                    >
                      <Card
                        padding="none"
                        className="h-full overflow-hidden flex flex-col transition-[transform,border-color,box-shadow] duration-200 ease-out group-hover:-translate-y-1 group-hover:border-[#D5A83C]/80 group-hover:shadow-[0_16px_36px_-16px_rgba(213,168,60,0.38)] group-focus-visible:-translate-y-1 group-focus-visible:border-[#D5A83C]/85 group-focus-visible:shadow-[0_16px_36px_-16px_rgba(213,168,60,0.42)] group-active:scale-[0.99] group-active:border-[#D5A83C]/80 group-active:shadow-[0_12px_28px_-14px_rgba(213,168,60,0.34)] dark:group-hover:border-[#D5A83C]/75 dark:group-focus-visible:border-[#D5A83C]/85 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0 motion-reduce:group-active:scale-100"
                      >
                        <div className="aspect-[16/10] w-full overflow-hidden border-b border-[#E2E8F0] bg-[#07152C] dark:border-white/10">
                          <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04] group-active:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100 motion-reduce:group-active:scale-100">
                            <MediaImage
                              src={program.imageSrc}
                              alt={program.imageAlt}
                              transform={program.imageTransform}
                              fallbackLabel={program.title}
                              className="h-full w-full"
                            />
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col gap-3 p-6">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold tracking-wider text-[#C8202B] dark:text-[#D5A83C] tabular-nums">
                              {program.code}
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A83C] transition-colors duration-200 group-hover:bg-[#102342] group-focus-visible:bg-[#102342] dark:border dark:border-white/10 dark:bg-[#162B4D] dark:group-hover:border-[#D5A83C]/45">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </div>
                          </div>

                          <h2 className="text-xl font-bold tracking-tight text-[#07152C] dark:text-white">
                            {program.title}
                          </h2>

                          {program.description && (
                            <p className="text-sm leading-relaxed text-[#475569] dark:text-[#C8D5E8]">
                              {program.description}
                            </p>
                          )}
                        </div>
                      </Card>
                    </article>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </PageContainer>
      )}
    </div>
  );
}
