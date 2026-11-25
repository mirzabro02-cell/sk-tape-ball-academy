import { isSupabaseConfigured, rawSupabase } from '@/src/services/supabaseClient';
import type {
  AdminApplication,
  AdminStudent,
  AdminTrialBooking,
  AdmissionDecisionStatus,
  StudentStatus,
  TrialBookingStatus,
} from '@/src/types/admin';

/**
 * Verified Core Supabase Repository
 *
 * Maps strictly against Task 4 v15 verified tables:
 *   - public.profiles (id, role, full_name)
 *   - public.students (id, full_name, guardian_profile_id, created_at, ...)
 *   - public.admissions (id, reference_code, status, created_at, ...)
 *   - public.trial_bookings (id, reference_code, status, created_at, ...)
 *
 * All status mapping strictly respects v15 Postgres CHECK constraints:
 *   - admissions.status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted'
 *   - trial_bookings.status: 'requested' | 'confirmed' | 'completed' | 'cancelled'
 */

export type DbAdmissionStatus =
  | 'pending'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'waitlisted';

export type DbTrialStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';

export interface RegistrationSubmitInput {
  studentName: string;
  dateOfBirth: string;
  age: number;
  isMinor: boolean;
  gender: string;
  cityArea: string;
  studentPhone: string;
  studentEmail: string;
  guardianName: string;
  relationship: string;
  guardianPhone: string;
  whatsappNumber: string;
  guardianEmail: string;
  requestedProgram: string;
  previousExperience: string;
  preferredBatch: string;
  additionalMessage: string;
  guardianConsent: boolean;
  privacyConsent: boolean;
  photographyConsent: boolean;
}

export interface TrialSubmitInput {
  studentName: string;
  dobOrAge: string;
  guardianName: string;
  contactPhone: string;
  contactEmail: string;
  requestedProgram: string;
  preferredDate: string;
  preferredTimeSlot: string;
  previousExperience: string;
  additionalMessage: string;
}

export interface RepositoryActionResult<T = void> {
  ok: boolean;
  data?: T;
  error?: string;
  schemaMissingHint?: boolean;
}

export function mapDbAdmissionStatusToUi(raw: string | null | undefined): AdmissionDecisionStatus {
  switch ((raw ?? '').toLowerCase()) {
    case 'under_review':
      return 'Under Review';
    case 'accepted':
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'waitlisted':
      return 'More Information Required';
    case 'pending':
    default:
      return 'Pending';
  }
}

export function mapUiAdmissionStatusToDb(status: AdmissionDecisionStatus): DbAdmissionStatus {
  switch (status) {
    case 'Under Review':
      return 'under_review';
    case 'Approved':
      return 'accepted';
    case 'Rejected':
      return 'rejected';
    case 'More Information Required':
      return 'waitlisted';
    case 'Pending':
    default:
      return 'pending';
  }
}

export function mapDbTrialStatusToUi(
  raw: string | null | undefined,
  staffNote?: string | null,
): TrialBookingStatus {
  if (staffNote && staffNote.startsWith('[Rescheduled]') && raw !== 'cancelled') {
    return 'Rescheduled';
  }
  switch ((raw ?? '').toLowerCase()) {
    case 'confirmed':
    case 'completed':
      return 'Confirmed';
    case 'cancelled':
    case 'rejected':
      return 'Rejected';
    case 'requested':
    default:
      return 'Requested (Unconfirmed)';
  }
}

export function mapUiTrialStatusToDb(status: TrialBookingStatus): DbTrialStatus {
  switch (status) {
    case 'Confirmed':
      return 'confirmed';
    case 'Rejected':
      return 'cancelled';
    case 'Rescheduled':
    case 'Requested (Unconfirmed)':
    default:
      return 'requested';
  }
}

function formatReadableDate(iso: unknown): string {
  if (typeof iso !== 'string' || !iso) return 'Recorded';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isSchemaColumnOrTableError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('does not exist') ||
    lower.includes('could not find') ||
    lower.includes('schema cache') ||
    lower.includes('pgrst204') ||
    lower.includes('pgrst205')
  );
}

function mapStudentRow(row: Record<string, unknown>, index: number): AdminStudent {
  const rawStatus = String(row.status ?? 'Active');
  const validStatuses: StudentStatus[] = ['Active', 'Trial', 'Inactive', 'On Hold'];
  const status: StudentStatus = validStatuses.includes(rawStatus as StudentStatus)
    ? (rawStatus as StudentStatus)
    : 'Active';

  return {
    id: String(row.id ?? `stu-${index}`),
    studentCode: String(row.student_code ?? `SK-${String(index + 1).padStart(4, '0')}`),
    fullName: String(row.full_name ?? 'Unnamed Student'),
    ageGroup: String(row.age_group ?? 'Youth Division'),
    contactPlaceholder: String(row.contact ?? row.contact_phone ?? ''),
    guardianName: String(row.guardian_name ?? 'On File'),
    program: String(row.program ?? 'General Training'),
    batchId: String(row.batch_id ?? ''),
    batchName: String(row.batch_name ?? 'Unassigned'),
    status,
    joinedLabel: formatReadableDate(row.created_at),
    attendanceRate:
      typeof row.attendance_rate === 'number' && Number.isFinite(row.attendance_rate)
        ? row.attendance_rate
        : 100,
    notes: String(row.notes ?? ''),
  };
}

function mapAdmissionRow(row: Record<string, unknown>, index: number): AdminApplication {
  const ageVal = typeof row.age === 'number' ? row.age : Number(row.age ?? 0) || 0;
  return {
    id: String(row.id ?? `app-${index}`),
    referencePlaceholder: String(row.reference_code ?? 'PENDING-REF'),
    applicantName: String(row.applicant_name ?? row.student_name ?? row.full_name ?? 'Applicant'),
    age: ageVal,
    isMinor: typeof row.is_minor === 'boolean' ? row.is_minor : ageVal > 0 && ageVal < 18,
    guardianName: String(row.guardian_name ?? 'Recorded on file'),
    contactPlaceholder: String(row.whatsapp_number ?? row.guardian_phone ?? row.contact ?? ''),
    requestedProgram: String(row.requested_program ?? row.program ?? 'Program Selected'),
    experienceLevel: String(row.experience_level ?? 'Not specified'),
    submittedLabel: formatReadableDate(row.created_at),
    status: mapDbAdmissionStatusToUi(typeof row.status === 'string' ? row.status : 'pending'),
    reviewerNotes: String(row.reviewer_notes ?? row.additional_message ?? ''),
    convertedToStudent: Boolean(row.converted_to_student),
  };
}

function mapTrialRow(row: Record<string, unknown>, index: number): AdminTrialBooking {
  const staffNote = typeof row.staff_note === 'string' ? row.staff_note : '';
  return {
    id: String(row.id ?? `trl-${index}`),
    requestCode: String(row.reference_code ?? 'TRL-PENDING'),
    playerName: String(row.player_name ?? row.student_name ?? row.full_name ?? 'Player'),
    ageGroup: String(row.dob_or_age ?? row.age_group ?? ''),
    contactPlaceholder: String(row.contact_phone ?? row.contact ?? ''),
    requestedProgram: String(row.requested_program ?? row.program ?? 'Trial Session'),
    preferredDate: String(row.preferred_date ?? ''),
    preferredTimeSlot: String(row.preferred_time_slot ?? ''),
    status: mapDbTrialStatusToUi(typeof row.status === 'string' ? row.status : 'requested', staffNote),
    staffNote: staffNote.replace(/^\[Rescheduled\]\s*/, ''),
  };
}

export async function fetchCoreSupabaseData(): Promise<
  RepositoryActionResult<{
    students: AdminStudent[];
    applications: AdminApplication[];
    trials: AdminTrialBooking[];
  }>
> {
  if (!isSupabaseConfigured || !rawSupabase) {
    return { ok: false, error: 'Supabase is not configured in this environment.' };
  }

  const [studentsRes, admissionsRes, trialsRes] = await Promise.all([
    rawSupabase.from('students').select('*').order('created_at', { ascending: false }),
    rawSupabase.from('admissions').select('*').order('created_at', { ascending: false }),
    rawSupabase.from('trial_bookings').select('*').order('created_at', { ascending: false }),
  ]);

  const errors: string[] = [];
  if (studentsRes.error) errors.push(`students: ${studentsRes.error.message}`);
  if (admissionsRes.error) errors.push(`admissions: ${admissionsRes.error.message}`);
  if (trialsRes.error) errors.push(`trial_bookings: ${trialsRes.error.message}`);

  if (errors.length > 0) {
    const joined = errors.join(' | ');
    return {
      ok: false,
      error: joined,
      schemaMissingHint: isSchemaColumnOrTableError(joined),
    };
  }

  return {
    ok: true,
    data: {
      students: (studentsRes.data ?? []).map((r, i) =>
        mapStudentRow(r as Record<string, unknown>, i),
      ),
      applications: (admissionsRes.data ?? []).map((r, i) =>
        mapAdmissionRow(r as Record<string, unknown>, i),
      ),
      trials: (trialsRes.data ?? []).map((r, i) => mapTrialRow(r as Record<string, unknown>, i)),
    },
  };
}

export async function insertSupabaseAdmission(
  input: RegistrationSubmitInput,
): Promise<RepositoryActionResult<{ application: AdminApplication }>> {
  if (!isSupabaseConfigured || !rawSupabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const payload = {
    applicant_name: input.studentName,
    date_of_birth: input.dateOfBirth || null,
    age: input.age,
    is_minor: input.isMinor,
    gender: input.gender || null,
    city_area: input.cityArea,
    student_phone: input.studentPhone || null,
    student_email: input.studentEmail || null,
    guardian_name: input.guardianName,
    relationship: input.relationship,
    guardian_phone: input.guardianPhone,
    whatsapp_number: input.whatsappNumber,
    guardian_email: input.guardianEmail || null,
    requested_program: input.requestedProgram,
    experience_level: input.previousExperience,
    preferred_batch: input.preferredBatch,
    additional_message: input.additionalMessage || null,
    guardian_consent: input.guardianConsent,
    privacy_consent: input.privacyConsent,
    photography_consent: input.photographyConsent,
    status: 'pending' as DbAdmissionStatus,
  };

  const { data, error } = await rawSupabase
    .from('admissions')
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    const msg = error?.message ?? 'Unable to submit admission application to Supabase.';
    return {
      ok: false,
      error: msg,
      schemaMissingHint: isSchemaColumnOrTableError(msg),
    };
  }

  return {
    ok: true,
    data: { application: mapAdmissionRow(data as Record<string, unknown>, 0) },
  };
}

export async function insertSupabaseTrialBooking(
  input: TrialSubmitInput,
): Promise<RepositoryActionResult<{ trial: AdminTrialBooking }>> {
  if (!isSupabaseConfigured || !rawSupabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const payload = {
    player_name: input.studentName,
    dob_or_age: input.dobOrAge,
    guardian_name: input.guardianName,
    contact_phone: input.contactPhone,
    contact_email: input.contactEmail || null,
    requested_program: input.requestedProgram,
    preferred_date: input.preferredDate,
    preferred_time_slot: input.preferredTimeSlot,
    previous_experience: input.previousExperience,
    additional_message: input.additionalMessage || null,
    status: 'requested' as DbTrialStatus,
    staff_note: input.additionalMessage
      ? `Guardian: ${input.guardianName} · ${input.additionalMessage}`
      : `Guardian: ${input.guardianName} · Level: ${input.previousExperience}`,
  };

  const { data, error } = await rawSupabase
    .from('trial_bookings')
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    const msg = error?.message ?? 'Unable to submit trial request to Supabase.';
    return {
      ok: false,
      error: msg,
      schemaMissingHint: isSchemaColumnOrTableError(msg),
    };
  }

  return {
    ok: true,
    data: { trial: mapTrialRow(data as Record<string, unknown>, 0) },
  };
}

export async function lookupSupabaseApplicationStatus(
  referenceCode: string,
  contactDigits: string,
): Promise<RepositoryActionResult<AdminApplication | null>> {
  if (!isSupabaseConfigured || !rawSupabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  // Prefer privacy-safe SECURITY DEFINER RPC if deployed
  const rpcRes = await rawSupabase.rpc('lookup_application_status', {
    p_reference_code: referenceCode.trim(),
    p_contact_digits: contactDigits || '',
  });

  if (!rpcRes.error && Array.isArray(rpcRes.data)) {
    const first = rpcRes.data[0] as Record<string, unknown> | undefined;
    return { ok: true, data: first ? mapAdmissionRow(first, 0) : null };
  }

  // Fallback to direct reference_code lookup if permitted by RLS
  const { data, error } = await rawSupabase
    .from('admissions')
    .select('*')
    .ilike('reference_code', referenceCode.trim())
    .limit(1);

  if (error) {
    return {
      ok: false,
      error: `Application lookup failed (${error.message}). Verify lookup_application_status RPC or RLS policy.`,
      schemaMissingHint: isSchemaColumnOrTableError(error.message),
    };
  }

  const row = (data?.[0] as Record<string, unknown> | undefined) ?? null;
  if (!row) return { ok: true, data: null };

  const mapped = mapAdmissionRow(row, 0);
  if (contactDigits) {
    const storedDigits = mapped.contactPlaceholder.replace(/\D/g, '');
    if (storedDigits && !storedDigits.endsWith(contactDigits.slice(-7))) {
      return { ok: true, data: null };
    }
  }
  return { ok: true, data: mapped };
}

export async function upsertSupabaseStudent(
  student: Omit<AdminStudent, 'id' | 'joinedLabel'>,
  existingId?: string,
): Promise<RepositoryActionResult<AdminStudent>> {
  if (!isSupabaseConfigured || !rawSupabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const payload = {
    full_name: student.fullName,
    student_code: student.studentCode,
    age_group: student.ageGroup,
    contact: student.contactPlaceholder,
    guardian_name: student.guardianName,
    program: student.program,
    batch_id: student.batchId,
    batch_name: student.batchName,
    status: student.status,
    attendance_rate: student.attendanceRate,
    notes: student.notes,
  };

  const query = existingId
    ? rawSupabase.from('students').update(payload).eq('id', existingId).select('*').single()
    : rawSupabase.from('students').insert(payload).select('*').single();

  const { data, error } = await query;
  if (error || !data) {
    const msg = error?.message ?? 'Failed to persist student record in Supabase.';
    return { ok: false, error: msg, schemaMissingHint: isSchemaColumnOrTableError(msg) };
  }
  return { ok: true, data: mapStudentRow(data as Record<string, unknown>, 0) };
}

export async function deleteSupabaseStudent(id: string): Promise<RepositoryActionResult> {
  if (!isSupabaseConfigured || !rawSupabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }
  const { error } = await rawSupabase.from('students').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateSupabaseAdmission(
  id: string,
  patch: {
    status?: AdmissionDecisionStatus;
    reviewerNotes?: string;
    convertedToStudent?: boolean;
  },
): Promise<RepositoryActionResult<AdminApplication>> {
  if (!isSupabaseConfigured || !rawSupabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const updatePayload: Record<string, unknown> = {};
  if (patch.status !== undefined) {
    updatePayload.status = mapUiAdmissionStatusToDb(patch.status);
  }
  if (patch.reviewerNotes !== undefined) {
    updatePayload.reviewer_notes = patch.reviewerNotes;
  }
  if (patch.convertedToStudent !== undefined) {
    updatePayload.converted_to_student = patch.convertedToStudent;
  }

  const { data, error } = await rawSupabase
    .from('admissions')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    const msg = error?.message ?? 'Failed to update admission record.';
    return { ok: false, error: msg, schemaMissingHint: isSchemaColumnOrTableError(msg) };
  }
  return { ok: true, data: mapAdmissionRow(data as Record<string, unknown>, 0) };
}

export async function updateSupabaseTrialBooking(
  id: string,
  patch: {
    status: TrialBookingStatus;
    preferredDate?: string;
    preferredTimeSlot?: string;
    staffNote?: string;
  },
): Promise<RepositoryActionResult<AdminTrialBooking>> {
  if (!isSupabaseConfigured || !rawSupabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const updatePayload: Record<string, unknown> = {
    status: mapUiTrialStatusToDb(patch.status),
  };
  if (patch.preferredDate !== undefined) updatePayload.preferred_date = patch.preferredDate;
  if (patch.preferredTimeSlot !== undefined) {
    updatePayload.preferred_time_slot = patch.preferredTimeSlot;
  }
  if (patch.staffNote !== undefined || patch.status === 'Rescheduled') {
    const cleanNote = (patch.staffNote ?? '').replace(/^\[Rescheduled\]\s*/, '').trim();
    updatePayload.staff_note =
      patch.status === 'Rescheduled' ? `[Rescheduled] ${cleanNote}`.trim() : cleanNote;
  }

  const { data, error } = await rawSupabase
    .from('trial_bookings')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    const msg = error?.message ?? 'Failed to update trial booking.';
    return { ok: false, error: msg, schemaMissingHint: isSchemaColumnOrTableError(msg) };
  }
  return { ok: true, data: mapTrialRow(data as Record<string, unknown>, 0) };
}
