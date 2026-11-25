import { useMemo, useState } from 'react';
import { Check, ClipboardCheck } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AttendanceMark } from '@/src/types/admin';
import { AdminDonutBreakdown } from '@/src/components/admin/AdminCharts';
import { AdminEmptyState, AdminPageHeader } from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';

export function AdminAttendancePage() {
  useDocumentTitle('Attendance Management');
  const { showToast } = useAdminToast();
  const { state } = useAcademyState();

  const [selectedBatchId, setSelectedBatchId] = useState(state.batches[0]?.id ?? 'all');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState<Record<string, AttendanceMark>>({});
  const [historyLog, setHistoryLog] = useState<
    { id: string; date: string; batchName: string; summary: string }[]
  >([]);

  const activeBatch = state.batches.find((b) => b.id === selectedBatchId);

  const batchRoster = useMemo(() => {
    if (selectedBatchId === 'all' || !selectedBatchId) return state.students;
    return state.students.filter((s) => s.batchId === selectedBatchId);
  }, [state.students, selectedBatchId]);

  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    batchRoster.forEach((stu) => {
      const m = marks[stu.id] ?? 'Present';
      if (m === 'Present') present += 1;
      else if (m === 'Absent') absent += 1;
      else late += 1;
    });
    return { present, absent, late };
  }, [batchRoster, marks]);

  function handleSaveAttendance() {
    if (batchRoster.length === 0) return;
    const summaryText = `${summary.present} Present · ${summary.absent} Absent · ${summary.late} Late`;
    setHistoryLog((prev) => [
      {
        id: `hist-${Date.now()}`,
        date: selectedDate,
        batchName: activeBatch?.name ?? 'All Enrolled Students',
        summary: summaryText,
      },
      ...prev,
    ]);
    showToast('Attendance Logged', `Session sheet saved for ${selectedDate}.`);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Attendance Management"
        description="Mark session attendance for enrolled athletes by batch and training date."
        actions={
          batchRoster.length > 0 ? (
            <Button type="button" variant="primary" size="sm" onClick={handleSaveAttendance}>
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              <span>Save Attendance Sheet</span>
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <Card padding="md" className="lg:col-span-8 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Filter by Batch"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              options={[
                { value: 'all', label: 'All Enrolled Students' },
                ...state.batches.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />
            <Input
              label="Training Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="overflow-hidden rounded-[12px] border border-[#E2E8F0]">
            {batchRoster.length === 0 ? (
              <AdminEmptyState
                title="No students available for this batch"
                description="Add students or assign them to this batch in Student Management to take session attendance."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F7FA] text-[#64748B]">
                    <tr className="border-b border-[#E2E8F0]">
                      <th className="px-4 py-3 font-semibold">Student</th>
                      <th className="px-4 py-3 font-semibold">Program</th>
                      <th className="px-4 py-3 font-semibold text-right">Mark Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {batchRoster.map((stu) => {
                      const currentMark = marks[stu.id] ?? 'Present';
                      return (
                        <tr key={stu.id} className="hover:bg-[#F5F7FA]/60">
                          <td className="px-4 py-3">
                            <p className="font-bold text-[#071A36]">{stu.fullName}</p>
                            <p className="font-mono text-[11px] text-[#64748B]">{stu.studentCode}</p>
                          </td>
                          <td className="px-4 py-3 text-[#64748B]">{stu.program}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-1 gap-1">
                              {(['Present', 'Late', 'Absent'] as AttendanceMark[]).map((option) => {
                                const selected = currentMark === option;
                                const activeStyle =
                                  option === 'Present'
                                    ? 'bg-[#071A36] text-[#D9A52E]'
                                    : option === 'Late'
                                      ? 'bg-[#D9A52E] text-[#050D1B]'
                                      : 'bg-[#C8202B] text-white';

                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() =>
                                      setMarks((prev) => ({ ...prev, [stu.id]: option }))
                                    }
                                    className={`inline-flex items-center gap-1 rounded-[7px] px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                                      selected ? activeStyle : 'text-[#64748B] hover:text-[#071A36]'
                                    }`}
                                  >
                                    {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                                    <span>{option}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        <div className="lg:col-span-4 space-y-5">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-bold text-[#071A36]">Session Summary</h2>
            <AdminDonutBreakdown
              segments={[
                { label: 'Present', count: summary.present, color: '#071A36' },
                { label: 'Late', count: summary.late, color: '#D9A52E' },
                { label: 'Absent', count: summary.absent, color: '#C8202B' },
              ]}
            />
          </Card>

          <Card padding="md" className="space-y-3">
            <h2 className="text-base font-bold text-[#071A36]">Saved Attendance Sheets</h2>
            {historyLog.length === 0 ? (
              <p className="text-xs text-[#64748B]">No sheets logged in this session yet.</p>
            ) : (
              <div className="space-y-2">
                {historyLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#071A36]">{entry.batchName}</span>
                      <span className="font-mono text-[11px] text-[#64748B] tabular-nums">
                        {entry.date}
                      </span>
                    </div>
                    <p className="text-[#64748B]">{entry.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
