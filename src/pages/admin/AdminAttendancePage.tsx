import { useMemo, useState } from 'react';
import { Check, ClipboardCheck } from 'lucide-react';
import {
  INITIAL_ADMIN_BATCHES,
  INITIAL_ADMIN_STUDENTS,
} from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AttendanceMark } from '@/src/types/admin';
import { AdminDonutBreakdown } from '@/src/components/admin/AdminCharts';
import {
  AdminDemoNotice,
  AdminPageHeader,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';

export function AdminAttendancePage() {
  useDocumentTitle('Attendance Management');
  const { showToast } = useAdminToast();

  const [selectedBatchId, setSelectedBatchId] = useState(INITIAL_ADMIN_BATCHES[0].id);
  const [selectedDate, setSelectedDate] = useState('2026-11-23');
  const [marks, setMarks] = useState<Record<string, AttendanceMark>>(() => {
    const initial: Record<string, AttendanceMark> = {};
    INITIAL_ADMIN_STUDENTS.forEach((stu, idx) => {
      initial[stu.id] = idx === 3 ? 'Late' : 'Present';
    });
    return initial;
  });

  const [historyLog, setHistoryLog] = useState([
    {
      id: 'hist-1',
      date: '2026-11-21',
      batchName: 'Batting Foundation A (Demo)',
      summary: '2 Present · 0 Absent · 0 Late',
    },
    {
      id: 'hist-2',
      date: '2026-11-19',
      batchName: 'Pace & Yorkers Clinic (Demo)',
      summary: '1 Present · 0 Absent · 0 Late',
    },
  ]);

  const activeBatch =
    INITIAL_ADMIN_BATCHES.find((b) => b.id === selectedBatchId) ?? INITIAL_ADMIN_BATCHES[0];

  const batchRoster = useMemo(() => {
    const inBatch = INITIAL_ADMIN_STUDENTS.filter((s) => s.batchId === selectedBatchId);
    return inBatch.length > 0 ? inBatch : INITIAL_ADMIN_STUDENTS.slice(0, 3);
  }, [selectedBatchId]);

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
    const summaryText = `${summary.present} Present · ${summary.absent} Absent · ${summary.late} Late`;
    setHistoryLog((prev) => [
      {
        id: `hist-${Date.now()}`,
        date: selectedDate,
        batchName: activeBatch.name,
        summary: summaryText,
      },
      ...prev,
    ]);
    showToast(
      'Attendance Saved (Demonstration)',
      `${activeBatch.name} attendance logged for ${selectedDate} in local session.`,
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Attendance Management"
        description="Select a training batch and date to mark Present, Absent, or Late attendance in preview mode."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={handleSaveAttendance}>
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            <span>Save Attendance Sheet</span>
          </Button>
        }
      />

      <AdminDemoNotice />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card padding="md" className="lg:col-span-8 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Select Batch"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              options={INITIAL_ADMIN_BATCHES.map((b) => ({ value: b.id, label: b.name }))}
            />
            <Input
              label="Training Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
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
        </Card>

        <div className="lg:col-span-4 space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-bold text-[#071A36]">
              Session Attendance Breakdown
            </h2>
            <AdminDonutBreakdown
              segments={[
                { label: 'Present', count: summary.present, color: '#071A36' },
                { label: 'Late', count: summary.late, color: '#D9A52E' },
                { label: 'Absent', count: summary.absent, color: '#C8202B' },
              ]}
            />
          </Card>

          <Card padding="md" className="space-y-3">
            <h2 className="text-base font-bold text-[#071A36]">Attendance History (Demo)</h2>
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
          </Card>
        </div>
      </div>
    </div>
  );
}
