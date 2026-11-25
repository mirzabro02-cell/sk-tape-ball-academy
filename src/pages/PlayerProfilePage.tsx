import { ArrowLeft, Award, UserRound } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { PLAYER_PROFILES_DATA } from '@/src/data/activitiesContent';
import { TRAINING_PROGRAMS_DATA } from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { ProgramCard } from '@/src/components/academy/ProgramCard';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function PlayerProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const player = PLAYER_PROFILES_DATA.find((item) => item.slug === slug);

  useDocumentTitle(player ? player.namePlaceholder : 'Player Profile Not Found');

  if (!player) {
    return (
      <Card className="mx-auto max-w-xl text-center space-y-4" padding="lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
          Player Profile Not Found
        </p>
        <h1 className="text-2xl font-bold text-[#071A36]">
          Requested Player Profile Unavailable
        </h1>
        <p className="text-sm text-[#64748B]">
          This player profile slug is not configured. Return to Achievements to view available demonstration player spotlights.
        </p>
        <div className="pt-2 flex justify-center">
          <Button to="/achievements" variant="primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Achievements</span>
          </Button>
        </div>
      </Card>
    );
  }

  const relatedPrograms = TRAINING_PROGRAMS_DATA.filter((program) =>
    player.relatedProgramSlugs.includes(program.slug),
  );

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Achievements', to: '/achievements' },
          { label: player.namePlaceholder },
        ]}
        kicker={player.spotlightTag}
        title={player.namePlaceholder}
        description={`${player.playingRole} · ${player.battingStyle} · ${player.bowlingStyle}`}
        actions={
          <>
            <Button to="/achievements" variant="outlineLight" size="lg">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Achievements</span>
            </Button>
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
          </>
        }
        aside={
          <div className="aspect-[4/3] w-full rounded-[16px] border border-white/15 bg-[#050D1B] flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D9A52E]/50 bg-[#071A36] text-[#D9A52E]">
              <UserRound className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="text-xs font-medium text-white/80">
              {player.photoPlaceholderLabel}
            </p>
          </div>
        }
      />

      {/* Profile Breakdown & Achievement History */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 space-y-4" padding="lg">
          <h2 className="text-xl font-bold text-[#071A36]">Player Attributes (Sample)</h2>
          <dl className="divide-y divide-[#E2E8F0] border-t border-[#E2E8F0] text-sm">
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#64748B]">Playing Role</dt>
              <dd className="font-semibold text-[#071A36] text-right">{player.playingRole}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#64748B]">Batting Style</dt>
              <dd className="font-semibold text-[#071A36] text-right">{player.battingStyle}</dd>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <dt className="text-[#64748B]">Bowling Style</dt>
              <dd className="font-semibold text-[#071A36] text-right">{player.bowlingStyle}</dd>
            </div>
          </dl>

          <div className="border-t border-[#E2E8F0] pt-4 space-y-2">
            <h3 className="text-sm font-bold text-[#071A36]">Short Biography</h3>
            <p className="text-sm leading-relaxed text-[#64748B]">
              {player.shortBioPlaceholder}
            </p>
          </div>
        </Card>

        <Card className="lg:col-span-7 space-y-4" padding="lg">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-[#071A36]">
              Achievement History (Placeholder Records)
            </h2>
          </div>
          <p className="text-xs text-[#64748B]">
            Verified player statistics and tournament honors will replace these placeholder items once recorded.
          </p>
          <ul className="space-y-3 border-t border-[#E2E8F0] pt-4">
            {player.achievementHistoryPlaceholders.map((entry) => (
              <li
                key={entry}
                className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-4 py-3 text-sm text-[#071A36]"
              >
                {entry}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {relatedPrograms.length > 0 && (
        <section aria-labelledby="player-related-programs" className="space-y-6">
          <SectionHeader
            kicker="Training Alignment"
            title="Related Training Programs"
            description="Core tracks matching this playing profile."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {relatedPrograms.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        </section>
      )}

      <CtaBanner
        title="Develop Your Game at SK Tape Ball Academy"
        description="Explore our structured programs or schedule a free trial assessment."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Register Now"
        secondaryTo="/register"
      />
    </div>
  );
}
