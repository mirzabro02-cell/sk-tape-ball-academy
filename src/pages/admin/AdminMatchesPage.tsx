import { useState, type FormEvent } from 'react';
import { ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminMatch, MatchRecordStatus } from '@/src/types/admin';
import {
  AdminConfirmDialog,
  AdminEmptyState,
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
  const { state, setMatches } = useAcademyState();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminMatch | null>(null);
  const [scorecardMatch, setScorecardMatch] = useState<AdminMatch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMatch | null>(null);

  const [title, setTitle] = useState('');
  const [matchType, setMatchType] = useState<AdminMatch['matchType']>('Night Tape Ball Event');
  const [academyTeam, setAcademyTeam] = useState('SK Tape Ball Academy XI');
  const [opponentTeam, setOpponentTeam] = useState('');
  const [datePlaceholder, setDatePlaceholder] = useState('');
  const [locationPlaceholder, setLocationPlaceholder] = useState(state.siteSettings.locationText);
  const [status, setStatus] = useState<MatchRecordStatus>('Upcoming');

  const [academyScore, setAcademyScore] = useState('');
  const [opponentScore, setOpponentScore] = useState('');
  const [resultSummary, setResultSummary] = useState('');

  function openCreate() {
    setEditing(null);
    setTitle('');
    setMatchType('Night Tape Ball Event');
    setAcademyTeam('SK Tape Ball Academy XI');
    setOpponentTeam('');
    setDatePlaceholder('');
    setLocationPlaceholder(state.siteSettings.locationText);
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
                title: title.trim(),
                matchType,
                academyTeam: academyTeam.trim(),
                opponentTeam: opponentTeam.trim(),
                datePlaceholder: datePlaceholder.trim() || 'Date TBD',
                locationPlaceholder: locationPlaceholder.trim() || state.siteSettings.locationText,
                status,
              }
            : m,
        ),
      );
      showToast('Match Updated', `${title.trim()} saved.`);
    } else {
      const next: AdminMatch = {
        id: `match-${Date.now()}`,
        title: title.trim(),
        matchType,
        academyTeam: academyTeam.trim(),
        opponentTeam: opponentTeam.trim(),
        datePlaceholder: datePlaceholder.trim() || 'Date TBD',
        locationPlaceholder: locationPlaceholder.trim() || state.siteSettings.locationText,
        status,
        academyScore: 'TBD',
        opponentScore: 'TBD',
        resultSummary: 'Scheduled academy competition fixture.',
      };
      setMatches((prev) => [next, ...prev]);
      showToast('Match Created', `${next.title} added to schedule.`);
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
              academyScore: academyScore.trim(),
              opponentScore: opponentScore.trim(),
              resultSummary: resultSummary.trim(),
              status: 'Completed',
            }
          : m,
      ),
    );
    showToast('Scorecard Saved', `${scorecardMatch.title} marked Completed.`);
    setScorecardMatch(null);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Matches & Events Management"
        description="Publish academy-organized tape ball leagues, single-wicket events, and match scorecards."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create Match / Event</span>
          </Button>
        }
      />

      {state.matches.length === 0 ? (
        <Card padding="md">
          <AdminEmptyState
            title="No matches or league events published yet"
            description="Create a fixture when announcing an academy tape ball league or single-wicket competition."
            action={
              <Button type="button" variant="primary" size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Create First Match / Event</span>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:items-start">
          {state.matches.map((m) => (
            <Card key={m.id} padding="md" className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#A3B4CC]">
                    {m.matchType}
                  </p>
                  <h2 className="text-base font-bold text-[#07152C] dark:text-white">{m.title}</h2>
                </div>
                <AdminStatusBadge label={m.status} variant={MATCH_BADGE[m.status]} />
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 text-xs dark:border-white/10 dark:bg-[#07152C]">
                <div>
                  <p className="text-[#64748B] dark:text-[#A3B4CC]">{m.academyTeam}</p>
                  <p className="font-mono font-bold text-[#07152C] dark:text-[#D5A52B]">
                    {m.academyScore}
                  </p>
                </div>
                <div>
                  <p className="text-[#64748B] dark:text-[#A3B4CC]">{m.opponentTeam}</p>
                  <p className="font-mono font-bold text-[#07152C] dark:text-white">
                    {m.opponentScore}
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#64748B] dark:text-[#A3B4CC] space-y-1">
                <p>
                  <strong className="text-[#07152C] dark:text-white">Date &amp; Venue:</strong>{' '}
                  {m.datePlaceholder} · {m.locationPlaceholder}
                </p>
                <p>
                  <strong className="text-[#07152C] dark:text-white">Summary:</strong>{' '}
                  {m.resultSummary}
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-[#E2E8F0] pt-3 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openScorecard(m)}
                >
                  <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Scorecard</span>
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(m)}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Edit</span>
                </Button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(m)}
                  aria-label={`Delete ${m.title}`}
                  className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#C8202B]/30 px-3 text-xs text-[#C8202B] hover:bg-[#C8202B]/10 dark:border-[#F87171]/35 dark:text-[#FCA5A5] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

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
            placeholder="e.g. SK Floodlit Tape Ball League — Opening Night"
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Event Type"
              value={matchType}
              onChange={(e) => setMatchType(e.target.value as AdminMatch['matchType'])}
              options={[
                { value: 'Night Tape Ball Event', label: 'Tape Ball League / Night Event' },
                { value: 'Inter-Batch Challenge', label: 'Single-Wicket / Inter-Batch Event' },
                { value: 'Practice Match', label: 'Practice Match' },
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
              label="Academy Squad"
              value={academyTeam}
              onChange={(e) => setAcademyTeam(e.target.value)}
              required
            />
            <Input
              label="Opponent / Participating Side"
              value={opponentTeam}
              onChange={(e) => setOpponentTeam(e.target.value)}
              required
            />
            <Input
              label="Match Date"
              value={datePlaceholder}
              onChange={(e) => setDatePlaceholder(e.target.value)}
              placeholder="e.g. Saturday, 12 Dec 2026 · 7:30 PM"
            />
            <Input
              label="Venue / Ground"
              value={locationPlaceholder}
              onChange={(e) => setLocationPlaceholder(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
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
        maxWidth="md"
      >
        {scorecardMatch && (
          <form onSubmit={handleSaveScorecard} className="space-y-4">
            <Input
              label={`${scorecardMatch.academyTeam} Score`}
              value={academyScore}
              onChange={(e) => setAcademyScore(e.target.value)}
              placeholder="e.g. 92/4 (8 Overs)"
              required
            />
            <Input
              label={`${scorecardMatch.opponentTeam} Score`}
              value={opponentScore}
              onChange={(e) => setOpponentScore(e.target.value)}
              placeholder="e.g. 85/6 (8 Overs)"
              required
            />
            <Textarea
              label="Match Result Summary"
              value={resultSummary}
              onChange={(e) => setResultSummary(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
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

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setMatches((prev) => prev.filter((m) => m.id !== deleteTarget.id));
          showToast('Match Deleted', `${deleteTarget.title} removed.`, 'warning');
        }}
        title="Delete Match / Event"
        message={`Remove "${deleteTarget?.title ?? ''}" from matches and events?`}
        confirmLabel="Delete Match"
        tone="danger"
      />
    </div>
  );
}
