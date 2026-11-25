import { ArrowLeft, UserRound } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export function PlayerProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  useDocumentTitle('Player Spotlight Unavailable');

  return (
    <Card className="mx-auto max-w-xl text-center space-y-4" padding="lg">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D5A52B]/40 bg-[#07152C] text-[#D5A52B]">
        <UserRound className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
        Player Spotlights
      </p>
      <h1 className="text-2xl font-bold text-[#07152C] dark:text-white">
        Player Spotlight Profiles Pending Official Publication
      </h1>
      <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
        Verified athlete spotlight pages{slug ? ` (${slug})` : ''} are published only after official player consent and tournament verification by SK Tape Ball Academy.
      </p>
      <div className="pt-2 flex flex-wrap justify-center gap-3">
        <Button to="/achievements" variant="primary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Achievements</span>
        </Button>
        <Button to="/register" variant="outline">
          Register Now
        </Button>
      </div>
    </Card>
  );
}
