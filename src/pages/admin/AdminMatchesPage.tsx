import { useState, type FormEvent } from 'react';
import { ClipboardList, Pencil, Plus } from 'lucide-react';
import { INITIAL_ADMIN_MATCHES } from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminMatch, MatchRecordStatus } from '@/src/types/admin';
import {
  AdminDemoNotice,
  AdminModal,
  AdminPageHeader,
  AdminStatusBadge,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

const MATCH_BADGE: Record<MatchRecordStatus, 'navy' | 'success' | 'warning'> = {
  Upcoming: 'navy',
  Completed: 'success',
  Postponed: 'warning',
};

export function AdminMatchesPage() {
  useDocumentTitle('Matches & Events Management');
  const { showToast } = useAdminToast();

  const [matches, setMatches] = useState<AdminMatch[]>(INITIAL_ADMIN_MATCHES);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminMatch | null>(null);
  const [scorecardMatch, setScorecardMatch] = useState<AdminMatch | null>(null);

  const [title, setTitle] = useState('');
  const [matchType, setMatchType] = useState<AdminMatch['matchType']>('Practice Match');
  const [academyTeam, setAcademyTeam] = useState('SK Academy XI (Demo)');
  const [opponentTeam, setOpponentTeam] = useState('');
  const [datePlaceholder, setDatePlaceholder] = useState('[Match Date Pending]');
  const [locationPlaceholder, setLocationPlaceholder] = useState('SK Academy Ground (Placeholder)');
  const [status, setStatus] = useState<MatchRecordStatus>('Upcoming');

  const [academyScore, setAcademyScore] = useState('');
  const [opponentScore, setOpponentScore] = useState('');
  const [resultSummary, setResultSummary] = useState('');

  function openCreate() {
    setEditing(null);
    setTitle('');
    setMatchType('Practice Match');
    setAcademyTeam('SK Academy XI (Demo)');
    setOpponentTeam('');
    setDatePlaceholder('[Match Date Pending]');
    setLocationPlaceholder('SK Academy Ground (Placeholder)');
    setStatus('Upcoming');
    setFormOpen(true);
  }

  function openEdit(m: AdminMatch) {
    setEditing(m);
    setTitle(m.title);
    setMatchType(m.matchType);
    setAcademyTeam(m.academyTeam);
    setOpponentTeam(m.opponentTeam);
    setDatePlaceholder(m.datePlaceholder);
    setLocationPlaceholder(m.locationPlaceholder);
    setStatus(m.status);
    setFormOpen(true);
  }

  function openScorecard(m: AdminMatch) {
    setScorecardMatch(m);
    setAcademyScore(m.academyScore);
    setOpponentScore(m.opponentScore);
    setResultSummary(m.resultSummary);
  }

  function handleSaveMatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !opponentTeam.trim()) return;

    if (editing) {
      setMatches((prev) =>
        prev.map((m) =>
          m.id === editing.id
            ? {
                ...m,
                title,
                matchType,
                academyTeam,
                opponentTeam,
                datePlaceholder,
                locationPlaceholder,
                status,
              }
            : m,
        ),
      );
      showToast('Match Updated (Preview)', `${title} updated in demonstration fixtures.`);
    } else {
      const next: AdminMatch = {
        id: `match-${Date.now()}`,
        title,
        matchType,
        academyTeam,
        opponentTeam,
        datePlaceholder,
        locationPlaceholder,
        status,
        academyScore: 'TBD',
        opponentScore: 'TBD',
        resultSummary: 'Fixture scheduled in demonstration mode.',
      };
      setMatches((prev) => [next, ...prev]);
      showToast('Match Created (Preview)', `${title} added to fixture list.`);
    }
    setFormOpen(false);
  }

  function handleSaveScorecard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!scorecardMatch) return;
    setMatches((prev) =>
      prev.map((m) =>
        m.id === scorecardMatch.id
          ? {
              ...m,
              academyScore,
              opponentScore,
              resultSummary,
              status: 'Completed',
            }
          : m,
      ),
    );
    showToast(
      'Scorecard Saved (Preview)',
      `${scorecardMatch.title} scorecard updated in session state.`,
    );
    setScorecardMatch(null);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Matches & Events Management"
        description="Schedule academy tape ball fixtures, manage team details, and log sample match scorecards."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create Match / Event</span>
          </Button>
        }
      />

      <AdminDemoNotice />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {matches.map((m) => (
          <Card key={m.id} padding="md" className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  {m.matchType}
                </p>
                <h2 className="text-base font-bold text-[#071A36]">{m.title}</h2>
              </div>
              <AdminStatusBadge label={m.status} variant={MATCH_BADGE[m.status]} />
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 text-xs">
              <div>
                <p className="text-[#64748B]">{m.academyTeam}</p>
                <p className="font-mono font-bold text-[#071A36]">{m.academyScore}</p>
              </div>
              <div>
                <p className="text-[#64748B]">{m.opponentTeam}</p>
                <p className="font-mono font-bold text-[#071A36]">{m.opponentScore}</p>
              </div>
            </div>

            <div className="text-xs text-[#64748B] space-y-1">
              <p>
                <strong className="text-[#071A36]">Date &amp; Location:</strong>{' '}
                {m.datePlaceholder} · {m.locationPlaceholder}
              </p>
              <p>
                <strong className="text-[#071A36]">Summary:</strong> {m.resultSummary}
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-[#E2E8F0] pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openScorecard(m)}
              >
                <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Scorecard</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => openEdit(m)}
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Edit</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Match / Event' : 'Create Match / Event'}
      >
        <form onSubmit={handleSaveMatch} className="space-y-4">
          <Input
            label="Match / Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Event Type"
              value={matchType}
              onChange={(e) => setMatchType(e.target.value as AdminMatch['matchType'])}
              options={[
                { value: 'Practice Match', label: 'Practice Match' },
                { value: 'Inter-Batch Challenge', label: 'Inter-Batch Challenge' },
                { value: 'Night Tape Ball Event', label: 'Night Tape Ball Event' },
              ]}
            />
            <Select
              label="Match Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as MatchRecordStatus)}
              options={[
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Postponed', label: 'Postponed' },
              ]}
            />
            <Input
              label="Academy Team"
              value={academyTeam}
              onChange={(e) => setAcademyTeam(e.target.value)}
              required
            />
            <Input
              label="Opponent / Visiting Team"
              value={opponentTeam}
              onChange={(e) => setOpponentTeam(e.target.value)}
              required
            />
            <Input
              label="Date Placeholder"
              value={datePlaceholder}
              onChange={(e) => setDatePlaceholder(e.target.value)}
            />
            <Input
              label="Location Placeholder"
              value={locationPlaceholder}
              onChange={(e) => setLocationPlaceholder(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Save Match' : 'Create Match'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={Boolean(scorecardMatch)}
        onClose={() => setScorecardMatch(null)}
        title={`Scorecard — ${scorecardMatch?.title ?? ''}`}
        subtitle="Demonstration scorecard interface"
        maxWidth="md"
      >
        {scorecardMatch && (
          <form onSubmit={handleSaveScorecard} className="space-y-4">
            <Input
              label={`${scorecardMatch.academyTeam} Score`}
              value={academyScore}
              onChange={(e) => setAcademyScore(e.target.value)}
              placeholder="e.g. 92/4 (8 Overs — Demo)"
              required
            />
            <Input
              label={`${scorecardMatch.opponentTeam} Score`}
              value={opponentScore}
              onChange={(e) => setOpponentScore(e.target.value)}
              placeholder="e.g. 85/6 (8 Overs — Demo)"
              required
            />
            <Textarea
              label="Match Result Summary"
              value={resultSummary}
              onChange={(e) => setResultSummary(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setScorecardMatch(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Scorecard
              </Button>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
