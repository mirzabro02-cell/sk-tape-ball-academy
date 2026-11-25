-- =============================================================================
-- SK TAPE BALL ACADEMY — TASK 4 SCHEMA MIGRATION
-- Version : v13 — FINAL REVIEW CANDIDATE (STANDARD GREATEST EXPRESSION, TIMESTAMP NULL DETECTION & SEQSTART VALIDATION)
-- =============================================================================
-- PURPOSE  : Apply schema improvements described in the Task 4 plan.
-- SCOPE    : DDL + safe data normalisation only. No RLS policies. No admin setup.
-- SAFETY   : Idempotent. Halts on unexpected objects. All existing data preserved.
-- STATUS   : FOR REVIEW — do NOT execute until the user grants explicit approval.
--
-- STATUS NORMALISATION & DEFAULT RULES (ALIGNED TO ORIGINAL DATABASE SCHEMA):
--   1. admissions.status:
--      • Original allowed values : 'pending', 'approved', 'rejected'
--      • Approved new values     : 'pending', 'under_review', 'accepted', 'rejected', 'waitlisted'
--      • Mapping applied         : 'approved' → 'accepted'
--      • Preserved               : 'pending', 'rejected'
--      • Default                 : 'pending' (validated and preserved)
--      • NOT NULL                : Verified and enforced at column level
--   2. trial_bookings.status:
--      • Original allowed values : 'pending', 'confirmed', 'completed', 'cancelled'
--      • Original default        : 'pending'
--      • Approved new values     : 'requested', 'confirmed', 'completed', 'cancelled'
--      • Mapping applied         : 'pending' → 'requested'
--      • Preserved               : 'confirmed', 'completed', 'cancelled'
--      • Default updated         : 'pending' → 'requested' (inspected via catalog;
--                                  preserves 'requested' if already set; halts on unexpected custom defaults)
--      • NOT NULL                : Verified and enforced at column level
--
-- NOT NULL CONSTRAINT PRESERVATION:
--   • Legacy CHECK constraints like ((role IS NOT NULL)) or ((status IS NOT NULL))
--     are replaced by true column-level NOT NULL constraints (ALTER COLUMN ... SET NOT NULL).
--   • Before setting NOT NULL, the migration verifies that 0 rows contain NULL.
--     If NULL records exist, the migration halts immediately with an exception.
--   • Applied to: profiles.role, admissions.status, trial_bookings.status.
--
-- UNIQUE INDEX & CONSTRAINT HARDENING (STEPS 4 & 5):
--   • Inspects pg_constraint for named unique constraint (admissions_reference_code_key).
--   • Inspects pg_constraint for any other equivalent unique constraint covering reference_code.
--   • Inspects pg_index for valid standalone unique indexes covering reference_code:
--     - indisunique = TRUE
--     - indisvalid  = TRUE
--     - indisready  = TRUE (ready for inserts)
--     - indislive   = TRUE (not dead/being dropped)
--     - indpred IS NULL    (not partial)
--     - indexprs IS NULL   (not expression)
--     - indnkeyatts = 1    (single key column)
--   • If a standalone index is named admissions_reference_code_key, attaches it via USING INDEX.
--   • If an equivalent standalone index exists under another name, skips creating a duplicate.
--   • Avoids creating redundant indexes while ensuring reference_code uniqueness.
--
-- SEQUENCE VALIDATION & HIGH-WATER MARK SYNCHRONIZATION:
--   • Sequences are initialized with START 1000 MINVALUE 1000 INCREMENT BY 1 CACHE 1.
--   • Step 6 validates that existing sequence settings match:
--     - start = 1000
--     - increment = 1
--     - min_value = 1000
--     - cache_size = 1
--     - cycle = false
--     If settings differ, the migration HALTS immediately with an exception.
--     It never silently drops, resets, or alters existing sequences.
--   • Synchronization sets the sequence counter to GREATEST(consumed, max_suffix, 1000)
--     with is_called = TRUE.
--   • Therefore, the FIRST generated reference code is 1001 (e.g. ADM-YY-01001
--     or TRL-YY-01001), correctly establishing a clean 5-digit baseline > 1000.
--   • nextval() and setval() are NOT rolled back if the transaction aborts.
--     Gaps in sequence numbers are harmless. Re-running the script is safe because:
--     - Backfill only touches rows WHERE reference_code IS NULL OR btrim(reference_code) = ''
--     - Sequence sync only advances, never retreats.
--
-- TIMESTAMP INTEGRITY & PRE-FLIGHT AUDIT:
--   • Steps 10 & 11 execute pre-flight checks detecting records with NULL created_at.
--   • If any NULL created_at records exist, migration halts immediately with an exception
--     reporting the exact count. Timestamps must NEVER be silently fabricated or altered.
--
-- NUMERIC OVERFLOW-SAFE REFERENCE CODES & WHITESPACE HARDENING:
--   • Both backfill blocks and both trigger functions use:
--     LPAD(seq_val, GREATEST(5, LENGTH(seq_val)), '0')
--     This guarantees at least 5 digits (01001) while preventing truncation when
--     sequence numbers exceed 5 digits (e.g. 100000 remains 100000, not 10000).
--   • Whitespace-only strings ('   ') are treated as unassigned reference codes
--     along with NULL and empty strings ('').
--   • Existing legitimate nonblank reference codes remain strictly immutable.
--
-- SECURITY & IMMUTABILITY GUARANTEES (REFERENCE CODES):
--   1. On INSERT: ALWAYS generates a trusted server-side sequence code.
--      Any client-supplied reference_code is unconditionally overwritten.
--   2. On UPDATE:
--      • If the row already has an issued code (non-null/non-blank/non-whitespace),
--        it is strictly immutable: NEW.reference_code := OLD.reference_code.
--      • If the row was an unassigned legacy row (NULL, blank, or whitespace-only),
--        the server unconditionally generates a new sequence code. Client-supplied
--        codes are NEVER accepted under any circumstances.
--   3. Execution & Path hardening:
--      • Functions run as SECURITY DEFINER with fixed empty search_path ('').
--      • All catalog functions are fully qualified (pg_catalog.*).
--      • EXECUTE is revoked from PUBLIC (protecting anon/authenticated).
--
-- LOCKING STRATEGY:
--   LOCK TABLE ... IN SHARE ROW EXCLUSIVE MODE is acquired at the start of the
--   transaction on admissions, trial_bookings, profiles, and students.
--   This prevents concurrent INSERTs and UPDATEs from racing with the sequence-sync,
--   status-normalization, and backfill steps while still permitting concurrent SELECT queries.
--   All locks are held throughout the transaction and released on COMMIT or ROLLBACK.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- LOCK TABLES to prevent concurrent inserts/updates during migration steps.
-- SHARE ROW EXCLUSIVE: blocks INSERT/UPDATE/DELETE, allows concurrent SELECT.
-- ---------------------------------------------------------------------------
LOCK TABLE public.admissions      IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.trial_bookings  IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.profiles        IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.students        IN SHARE ROW EXCLUSIVE MODE;


-- ===========================================================================
-- STEP 1 — ADD students.full_name (nullable TEXT)
-- ===========================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_catalog.pg_attribute a
    JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
    WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
      AND  c.relname  = 'students'
      AND  a.attname  = 'full_name'
      AND  a.attnum   > 0
      AND  NOT a.attisdropped
  ) THEN
    ALTER TABLE public.students ADD COLUMN full_name TEXT;
    RAISE NOTICE 'STEP 1: Added students.full_name';
  ELSE
    RAISE NOTICE 'STEP 1: students.full_name already exists — skipped';
  END IF;
END;
$$;


-- ===========================================================================
-- STEP 2 — ADD students.guardian_profile_id column + FK
--          FK: students.guardian_profile_id → profiles.id  ON DELETE SET NULL
--
-- Validation covers:
--   • Constraint exists with contype = 'f'                     (FK type)
--   • conkey maps to guardian_profile_id attnum                (source column)
--   • confrelid is public.profiles                             (target table)
--   • confkey maps to profiles.id attnum                       (target column)
--   • confdeltype = 'n'                                        (ON DELETE SET NULL)
-- ===========================================================================
DO $$
DECLARE
  v_col_exists    BOOLEAN;
  v_contype       CHAR(1);
  v_conkey        INT2[];
  v_confkey       INT2[];
  v_confdeltype   CHAR(1);
  v_src_attnum    INT2;
  v_tgt_attnum    INT2;
BEGIN

  -- 2a. Add column if missing
  v_col_exists := EXISTS (
    SELECT 1
    FROM   pg_catalog.pg_attribute a
    JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
    WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
      AND  c.relname  = 'students'
      AND  a.attname  = 'guardian_profile_id'
      AND  a.attnum   > 0
      AND  NOT a.attisdropped
  );

  IF NOT v_col_exists THEN
    ALTER TABLE public.students ADD COLUMN guardian_profile_id UUID;
    RAISE NOTICE 'STEP 2a: Added students.guardian_profile_id column';
  ELSE
    RAISE NOTICE 'STEP 2a: students.guardian_profile_id already exists — skipped';
  END IF;

  -- 2b. Inspect any constraint named fk_students_guardian_profile
  SELECT contype, conkey, confkey, confdeltype
  INTO   v_contype, v_conkey, v_confkey, v_confdeltype
  FROM   pg_catalog.pg_constraint
  WHERE  conrelid = 'public.students'::pg_catalog.regclass
    AND  conname  = 'fk_students_guardian_profile';

  IF FOUND THEN
    -- Verify: must be a foreign key
    IF v_contype <> 'f' THEN
      RAISE EXCEPTION
        'STEP 2b: Constraint "fk_students_guardian_profile" exists on students '
        'but has type "%" (expected "f"). Inspect and resolve manually.',
        v_contype;
    END IF;

    -- Verify: source column must be guardian_profile_id
    SELECT a.attnum INTO v_src_attnum
    FROM   pg_catalog.pg_attribute a
    JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
    WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
      AND  c.relname = 'students'
      AND  a.attname = 'guardian_profile_id'
      AND  a.attnum  > 0 AND NOT a.attisdropped;

    IF v_conkey <> ARRAY[v_src_attnum]::INT2[] THEN
      RAISE EXCEPTION
        'STEP 2b: "fk_students_guardian_profile" maps to unexpected source column(s). '
        'Inspect manually.';
    END IF;

    -- Verify: target table must be public.profiles
    IF NOT EXISTS (
      SELECT 1
      FROM   pg_catalog.pg_constraint fk
      JOIN   pg_catalog.pg_class      tc ON tc.oid = fk.confrelid
      JOIN   pg_catalog.pg_namespace  ns ON ns.oid = tc.relnamespace
      WHERE  fk.conrelid = 'public.students'::pg_catalog.regclass
        AND  fk.conname  = 'fk_students_guardian_profile'
        AND  ns.nspname  = 'public'
        AND  tc.relname  = 'profiles'
    ) THEN
      RAISE EXCEPTION
        'STEP 2b: "fk_students_guardian_profile" references an unexpected target table. '
        'Inspect manually.';
    END IF;

    -- Verify: target column must be profiles.id
    SELECT a.attnum INTO v_tgt_attnum
    FROM   pg_catalog.pg_attribute a
    JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
    WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
      AND  c.relname = 'profiles'
      AND  a.attname = 'id'
      AND  a.attnum  > 0 AND NOT a.attisdropped;

    IF v_confkey <> ARRAY[v_tgt_attnum]::INT2[] THEN
      RAISE EXCEPTION
        'STEP 2b: "fk_students_guardian_profile" references an unexpected target column '
        '(expected profiles.id). Inspect manually.';
    END IF;

    -- Verify: ON DELETE SET NULL  (confdeltype = 'n')
    IF v_confdeltype <> 'n' THEN
      RAISE EXCEPTION
        'STEP 2b: "fk_students_guardian_profile" exists but has confdeltype "%" '
        '(expected "n" = ON DELETE SET NULL). Inspect manually.',
        v_confdeltype;
    END IF;

    RAISE NOTICE 'STEP 2b: FK fk_students_guardian_profile already exists and is fully correct — skipped';

  ELSE
    -- Constraint does not exist — add it
    ALTER TABLE public.students
      ADD CONSTRAINT fk_students_guardian_profile
      FOREIGN KEY (guardian_profile_id)
      REFERENCES public.profiles(id)
      ON DELETE SET NULL;
    RAISE NOTICE 'STEP 2b: Added FK fk_students_guardian_profile';
  END IF;

END;
$$;


-- ===========================================================================
-- STEP 3 — Validate profiles.role with CHECK constraint + PRESERVE NOT NULL
--
-- Strategy:
--   1. Determine attnum and attnotnull for profiles.role.
--   2. Preserve NOT NULL:
--        • Verify no existing rows have role IS NULL.
--        • If NULL rows exist, RAISE EXCEPTION.
--        • Enforce column-level NOT NULL via ALTER TABLE ... ALTER COLUMN role SET NOT NULL.
--   3. Enumerate all CHECK constraints whose conkey is exactly [role_attnum].
--   4. Normalize definition by stripping any leading 'CHECK ' prefix from
--      pg_get_constraintdef() output.
--   5. For each constraint:
--        • If normalized definition matches target → set v_already_correct = TRUE.
--        • If normalized definition matches known legacy → drop it.
--        • If unknown → RAISE EXCEPTION (halt for DBA review).
--   6. If v_already_correct is FALSE, add chk_profiles_role.
-- ===========================================================================
DO $$
DECLARE
  v_attnum          INT2;
  v_attnotnull      BOOLEAN;
  v_null_count      BIGINT;
  v_conname         TEXT;
  v_condef          TEXT;
  v_condef_norm     TEXT;
  v_already_correct BOOLEAN := FALSE;

  -- The exact expression PostgreSQL stores for our target constraint
  v_target_def CONSTANT TEXT :=
    $d$((role = ANY (ARRAY['admin'::text, 'coach'::text, 'student'::text, 'parent'::text])))$d$;

  -- Known legacy definitions safe to replace
  v_known_old_defs TEXT[] := ARRAY[
    $d$((role = ANY (ARRAY['admin'::text, 'coach'::text, 'student'::text])))$d$,
    $d$((role IS NOT NULL))$d$,
    $d$((role = ANY (ARRAY['Admin'::text, 'Coach'::text, 'Student'::text, 'Parent'::text])))$d$,
    $d$((role = ANY (ARRAY['admin'::text, 'coach'::text, 'student'::text, 'parent'::text, 'guardian'::text])))$d$,
    $d$((role = ANY (ARRAY['admin'::text, 'coach'::text, 'student'::text, 'parent'::text, 'user'::text])))$d$,
    $d$(((role = 'admin'::text) OR (role = 'coach'::text) OR (role = 'student'::text) OR (role = 'parent'::text)))$d$
  ];

BEGIN
  -- Resolve attnum and attnotnull for profiles.role
  SELECT a.attnum, a.attnotnull
  INTO   v_attnum, v_attnotnull
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname = 'profiles'
    AND  a.attname = 'role'
    AND  a.attnum  > 0 AND NOT a.attisdropped;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'STEP 3: profiles.role column not found. Cannot proceed.';
  END IF;

  -- 3a. Preserve NOT NULL semantics
  SELECT pg_catalog.count(*)
  INTO   v_null_count
  FROM   public.profiles
  WHERE  role IS NULL;

  IF v_null_count > 0 THEN
    RAISE EXCEPTION
      'STEP 3: Cannot preserve NOT NULL on profiles.role: % row(s) contain NULL. '
      'Resolve these records before re-running the migration.', v_null_count;
  END IF;

  IF NOT v_attnotnull THEN
    ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;
    RAISE NOTICE 'STEP 3: Enforced NOT NULL on profiles.role column';
  ELSE
    RAISE NOTICE 'STEP 3: profiles.role is already NOT NULL — preserved';
  END IF;

  -- 3b. Enumerate single-column CHECK constraints on profiles.role
  FOR v_conname, v_condef IN
    SELECT c.conname, pg_catalog.pg_get_constraintdef(c.oid)
    FROM   pg_catalog.pg_constraint c
    WHERE  c.conrelid = 'public.profiles'::pg_catalog.regclass
      AND  c.contype  = 'c'
      AND  c.conkey   = ARRAY[v_attnum]::INT2[]
    ORDER BY c.oid
  LOOP
    v_condef_norm := pg_catalog.regexp_replace(v_condef, '^CHECK\s*', '');

    IF v_condef_norm = v_target_def THEN
      v_already_correct := TRUE;
      RAISE NOTICE 'STEP 3: Correct role CHECK already present as "%" — preserved', v_conname;

    ELSIF v_condef_norm = ANY(v_known_old_defs) THEN
      RAISE NOTICE 'STEP 3: Dropping known-legacy role CHECK "%" (definition: %)', v_conname, v_condef;
      EXECUTE pg_catalog.format('ALTER TABLE public.profiles DROP CONSTRAINT %I', v_conname);

    ELSE
      RAISE EXCEPTION
        'STEP 3: Unexpected CHECK constraint "%" on profiles.role with unknown definition: [%]. '
        'Review this constraint manually before re-running the migration.',
        v_conname, v_condef;
    END IF;
  END LOOP;

  -- 3c. Add the new constraint only if the correct one was not already present
  IF NOT v_already_correct THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT chk_profiles_role
      CHECK (role IN ('admin', 'coach', 'student', 'parent'));
    RAISE NOTICE 'STEP 3: Added chk_profiles_role constraint';
  END IF;

END;
$$;


-- ===========================================================================
-- STEP 4 — ADD admissions.reference_code column + UNIQUE constraint
--          Avoids creating redundant indexes if an equivalent valid standalone
--          unique index already exists.
-- ===========================================================================
DO $$
DECLARE
  v_attnum          INT2;
  v_contype         CHAR(1);
  v_conkey          INT2[];
  v_other_conname   TEXT;
  v_existing_idx    TEXT;
BEGIN
  -- 4a. Add column if missing
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_catalog.pg_attribute a
    JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
    WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
      AND  c.relname  = 'admissions'
      AND  a.attname  = 'reference_code'
      AND  a.attnum   > 0 AND NOT a.attisdropped
  ) THEN
    ALTER TABLE public.admissions ADD COLUMN reference_code TEXT;
    RAISE NOTICE 'STEP 4a: Added admissions.reference_code column';
  ELSE
    RAISE NOTICE 'STEP 4a: admissions.reference_code already exists — skipped';
  END IF;

  -- Resolve attnum for admissions.reference_code (needed for UNIQUE check)
  SELECT a.attnum INTO v_attnum
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname = 'admissions'
    AND  a.attname = 'reference_code'
    AND  a.attnum  > 0 AND NOT a.attisdropped;

  -- 4b. Check for named constraint admissions_reference_code_key
  SELECT contype, conkey
  INTO   v_contype, v_conkey
  FROM   pg_catalog.pg_constraint
  WHERE  conrelid = 'public.admissions'::pg_catalog.regclass
    AND  conname  = 'admissions_reference_code_key';

  IF FOUND THEN
    IF v_contype <> 'u' THEN
      RAISE EXCEPTION
        'STEP 4b: "admissions_reference_code_key" exists but has type "%" (expected "u"). '
        'Inspect manually.', v_contype;
    END IF;
    IF v_conkey <> ARRAY[v_attnum]::INT2[] THEN
      RAISE EXCEPTION
        'STEP 4b: "admissions_reference_code_key" exists but covers different column(s). '
        'Inspect manually.';
    END IF;
    RAISE NOTICE 'STEP 4b: UNIQUE admissions_reference_code_key already correct — skipped';
  ELSE
    -- Check if any other UNIQUE constraint covers reference_code
    SELECT conname
    INTO   v_other_conname
    FROM   pg_catalog.pg_constraint
    WHERE  conrelid = 'public.admissions'::pg_catalog.regclass
      AND  contype  = 'u'
      AND  conkey   = ARRAY[v_attnum]::INT2[]
    LIMIT 1;

    IF v_other_conname IS NOT NULL THEN
      RAISE NOTICE
        'STEP 4b: An equivalent UNIQUE constraint "%" on admissions.reference_code already exists '
        '(different name) — skipped', v_other_conname;
    ELSE
      -- Check if an equivalent valid, live, ready standalone unique index already covers reference_code
      SELECT c.relname
      INTO   v_existing_idx
      FROM   pg_catalog.pg_index i
      JOIN   pg_catalog.pg_class c ON c.oid = i.indexrelid
      WHERE  i.indrelid    = 'public.admissions'::pg_catalog.regclass
        AND  i.indisunique = TRUE
        AND  i.indisvalid  = TRUE
        AND  i.indisready  = TRUE       -- index is ready for inserts
        AND  i.indislive   = TRUE       -- index is live (not dead/being dropped)
        AND  i.indpred IS NULL          -- not a partial index
        AND  i.indexprs IS NULL         -- not an expression index
        AND  i.indnkeyatts = 1          -- single key column
        AND  i.indkey[0]   = v_attnum
        AND  NOT EXISTS (
               SELECT 1 FROM pg_catalog.pg_constraint con
               WHERE con.conindid = i.indexrelid
             )
      LIMIT 1;

      IF v_existing_idx IS NOT NULL THEN
        IF v_existing_idx = 'admissions_reference_code_key' THEN
          EXECUTE 'ALTER TABLE public.admissions ADD CONSTRAINT admissions_reference_code_key UNIQUE USING INDEX admissions_reference_code_key';
          RAISE NOTICE 'STEP 4b: Attached existing standalone unique index "admissions_reference_code_key" as UNIQUE constraint';
        ELSE
          RAISE NOTICE
            'STEP 4b: An equivalent standalone unique index "%" already covers admissions.reference_code — skipped creating redundant unique index',
            v_existing_idx;
        END IF;
      ELSE
        ALTER TABLE public.admissions
          ADD CONSTRAINT admissions_reference_code_key UNIQUE (reference_code);
        RAISE NOTICE 'STEP 4b: Added UNIQUE admissions_reference_code_key';
      END IF;
    END IF;
  END IF;
END;
$$;


-- ===========================================================================
-- STEP 5 — ADD trial_bookings.reference_code column + UNIQUE constraint
--          Avoids creating redundant indexes if an equivalent valid standalone
--          unique index already exists.
-- ===========================================================================
DO $$
DECLARE
  v_attnum          INT2;
  v_contype         CHAR(1);
  v_conkey          INT2[];
  v_other_conname   TEXT;
  v_existing_idx    TEXT;
BEGIN
  -- 5a. Add column if missing
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_catalog.pg_attribute a
    JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
    WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
      AND  c.relname  = 'trial_bookings'
      AND  a.attname  = 'reference_code'
      AND  a.attnum   > 0 AND NOT a.attisdropped
  ) THEN
    ALTER TABLE public.trial_bookings ADD COLUMN reference_code TEXT;
    RAISE NOTICE 'STEP 5a: Added trial_bookings.reference_code column';
  ELSE
    RAISE NOTICE 'STEP 5a: trial_bookings.reference_code already exists — skipped';
  END IF;

  -- Resolve attnum for trial_bookings.reference_code
  SELECT a.attnum INTO v_attnum
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname = 'trial_bookings'
    AND  a.attname = 'reference_code'
    AND  a.attnum  > 0 AND NOT a.attisdropped;

  -- 5b. Check for named constraint trial_bookings_reference_code_key
  SELECT contype, conkey
  INTO   v_contype, v_conkey
  FROM   pg_catalog.pg_constraint
  WHERE  conrelid = 'public.trial_bookings'::pg_catalog.regclass
    AND  conname  = 'trial_bookings_reference_code_key';

  IF FOUND THEN
    IF v_contype <> 'u' THEN
      RAISE EXCEPTION
        'STEP 5b: "trial_bookings_reference_code_key" exists but has type "%" (expected "u"). '
        'Inspect manually.', v_contype;
    END IF;
    IF v_conkey <> ARRAY[v_attnum]::INT2[] THEN
      RAISE EXCEPTION
        'STEP 5b: "trial_bookings_reference_code_key" exists but covers different column(s). '
        'Inspect manually.';
    END IF;
    RAISE NOTICE 'STEP 5b: UNIQUE trial_bookings_reference_code_key already correct — skipped';
  ELSE
    -- Check if any other UNIQUE constraint covers reference_code
    SELECT conname
    INTO   v_other_conname
    FROM   pg_catalog.pg_constraint
    WHERE  conrelid = 'public.trial_bookings'::pg_catalog.regclass
      AND  contype  = 'u'
      AND  conkey   = ARRAY[v_attnum]::INT2[]
    LIMIT 1;

    IF v_other_conname IS NOT NULL THEN
      RAISE NOTICE
        'STEP 5b: An equivalent UNIQUE constraint "%" on trial_bookings.reference_code already exists '
        '(different name) — skipped', v_other_conname;
    ELSE
      -- Check if an equivalent valid, live, ready standalone unique index already covers reference_code
      SELECT c.relname
      INTO   v_existing_idx
      FROM   pg_catalog.pg_index i
      JOIN   pg_catalog.pg_class c ON c.oid = i.indexrelid
      WHERE  i.indrelid    = 'public.trial_bookings'::pg_catalog.regclass
        AND  i.indisunique = TRUE
        AND  i.indisvalid  = TRUE
        AND  i.indisready  = TRUE       -- index is ready for inserts
        AND  i.indislive   = TRUE       -- index is live (not dead/being dropped)
        AND  i.indpred IS NULL          -- not a partial index
        AND  i.indexprs IS NULL         -- not an expression index
        AND  i.indnkeyatts = 1          -- single key column
        AND  i.indkey[0]   = v_attnum
        AND  NOT EXISTS (
               SELECT 1 FROM pg_catalog.pg_constraint con
               WHERE con.conindid = i.indexrelid
             )
      LIMIT 1;

      IF v_existing_idx IS NOT NULL THEN
        IF v_existing_idx = 'trial_bookings_reference_code_key' THEN
          EXECUTE 'ALTER TABLE public.trial_bookings ADD CONSTRAINT trial_bookings_reference_code_key UNIQUE USING INDEX trial_bookings_reference_code_key';
          RAISE NOTICE 'STEP 5b: Attached existing standalone unique index "trial_bookings_reference_code_key" as UNIQUE constraint';
        ELSE
          RAISE NOTICE
            'STEP 5b: An equivalent standalone unique index "%" already covers trial_bookings.reference_code — skipped creating redundant unique index',
            v_existing_idx;
        END IF;
      ELSE
        ALTER TABLE public.trial_bookings
          ADD CONSTRAINT trial_bookings_reference_code_key UNIQUE (reference_code);
        RAISE NOTICE 'STEP 5b: Added UNIQUE trial_bookings_reference_code_key';
      END IF;
    END IF;
  END IF;
END;
$$;


-- ===========================================================================
-- STEP 6 — CREATE AND VALIDATE SEQUENCES
--   Expected parameters:
--     START 1000 MINVALUE 1000 INCREMENT BY 1 CACHE 1 NO CYCLE.
--   Baseline is 1000 (after sync: setval 1000, is_called=TRUE).
--   Therefore, the first generated code is 1001 (e.g. ADM-YY-01001 / TRL-YY-01001).
--   If an existing sequence has unexpected configuration, halts with an exception.
-- ===========================================================================
DO $$
DECLARE
  v_seq_start BIGINT;
  v_seq_inc   BIGINT;
  v_seq_min   BIGINT;
  v_seq_cache BIGINT;
  v_seq_cycle BOOLEAN;
BEGIN
  -- 6a. Ensure admissions_ref_seq exists
  CREATE SEQUENCE IF NOT EXISTS public.admissions_ref_seq
    START 1000 MINVALUE 1000 INCREMENT BY 1 CACHE 1;

  -- Validate admissions_ref_seq configuration in pg_sequence
  SELECT seqstart, seqincrement, seqmin, seqcache, seqcycle
  INTO   v_seq_start, v_seq_inc, v_seq_min, v_seq_cache, v_seq_cycle
  FROM   pg_catalog.pg_sequence
  WHERE  seqrelid = 'public.admissions_ref_seq'::pg_catalog.regclass;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'STEP 6a: Sequence public.admissions_ref_seq not found in pg_sequence.';
  END IF;

  IF v_seq_start <> 1000 OR v_seq_inc <> 1 OR v_seq_min <> 1000 OR v_seq_cache <> 1 OR v_seq_cycle <> FALSE THEN
    RAISE EXCEPTION
      'STEP 6a: Sequence public.admissions_ref_seq has unexpected configuration: '
      'start=%, increment=%, min=%, cache=%, cycle=%. Expected: start=1000, increment=1, min=1000, cache=1, cycle=false. '
      'Inspect and resolve manually.',
      v_seq_start, v_seq_inc, v_seq_min, v_seq_cache, v_seq_cycle;
  END IF;
  RAISE NOTICE 'STEP 6a: Sequence public.admissions_ref_seq validated (start=1000, increment=1, min=1000, cache=1, cycle=false)';

  -- 6b. Ensure trial_bookings_ref_seq exists
  CREATE SEQUENCE IF NOT EXISTS public.trial_bookings_ref_seq
    START 1000 MINVALUE 1000 INCREMENT BY 1 CACHE 1;

  -- Validate trial_bookings_ref_seq configuration in pg_sequence
  SELECT seqstart, seqincrement, seqmin, seqcache, seqcycle
  INTO   v_seq_start, v_seq_inc, v_seq_min, v_seq_cache, v_seq_cycle
  FROM   pg_catalog.pg_sequence
  WHERE  seqrelid = 'public.trial_bookings_ref_seq'::pg_catalog.regclass;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'STEP 6b: Sequence public.trial_bookings_ref_seq not found in pg_sequence.';
  END IF;

  IF v_seq_start <> 1000 OR v_seq_inc <> 1 OR v_seq_min <> 1000 OR v_seq_cache <> 1 OR v_seq_cycle <> FALSE THEN
    RAISE EXCEPTION
      'STEP 6b: Sequence public.trial_bookings_ref_seq has unexpected configuration: '
      'start=%, increment=%, min=%, cache=%, cycle=%. Expected: start=1000, increment=1, min=1000, cache=1, cycle=false. '
      'Inspect and resolve manually.',
      v_seq_start, v_seq_inc, v_seq_min, v_seq_cache, v_seq_cycle;
  END IF;
  RAISE NOTICE 'STEP 6b: Sequence public.trial_bookings_ref_seq validated (start=1000, increment=1, min=1000, cache=1, cycle=false)';
END;
$$;


-- ===========================================================================
-- STEP 7a — SYNCHRONISE admissions_ref_seq HIGH-WATER MARK
--
-- Reads state directly from the sequence relation (not pg_sequences view).
--   is_called = FALSE → last_value is the START value, NOT yet consumed.
--                        v_consumed = last_value - 1
--   is_called = TRUE  → last_value WAS issued; next = last_value + 1.
--                        v_consumed = last_value
-- Target = GREATEST(v_consumed, highest_numeric_suffix_in_table, 1000).
-- Only advances the sequence — never moves it backwards.
-- First code generated on empty table = 1001 (01001).
-- ===========================================================================
DO $$
DECLARE
  v_seq_lv     BIGINT;
  v_seq_called BOOLEAN;
  v_consumed   BIGINT;
  v_max_suffix BIGINT;
  v_target     BIGINT;
BEGIN
  SELECT last_value, is_called
  INTO   v_seq_lv, v_seq_called
  FROM   public.admissions_ref_seq;

  v_consumed := CASE WHEN v_seq_called THEN v_seq_lv ELSE v_seq_lv - 1 END;

  SELECT COALESCE(
    pg_catalog.max(
      pg_catalog.substring(reference_code FROM '\-(\d+)$')::BIGINT
    ), 0)
  INTO v_max_suffix
  FROM public.admissions
  WHERE reference_code IS NOT NULL
    AND pg_catalog.btrim(reference_code) <> ''
    AND reference_code ~ '\-\d+$';

  v_target := GREATEST(v_consumed, v_max_suffix, 1000);

  IF v_target > v_consumed THEN
    PERFORM pg_catalog.setval(
      'public.admissions_ref_seq'::pg_catalog.regclass, v_target, TRUE
    );
    RAISE NOTICE 'STEP 7a: admissions_ref_seq advanced to % (is_called=true)', v_target;
  ELSE
    RAISE NOTICE 'STEP 7a: admissions_ref_seq already at %; no advance needed', v_seq_lv;
  END IF;
END;
$$;


-- ===========================================================================
-- STEP 7b — SYNCHRONISE trial_bookings_ref_seq HIGH-WATER MARK
-- ===========================================================================
DO $$
DECLARE
  v_seq_lv     BIGINT;
  v_seq_called BOOLEAN;
  v_consumed   BIGINT;
  v_max_suffix BIGINT;
  v_target     BIGINT;
BEGIN
  SELECT last_value, is_called
  INTO   v_seq_lv, v_seq_called
  FROM   public.trial_bookings_ref_seq;

  v_consumed := CASE WHEN v_seq_called THEN v_seq_lv ELSE v_seq_lv - 1 END;

  SELECT COALESCE(
    pg_catalog.max(
      pg_catalog.substring(reference_code FROM '\-(\d+)$')::BIGINT
    ), 0)
  INTO v_max_suffix
  FROM public.trial_bookings
  WHERE reference_code IS NOT NULL
    AND pg_catalog.btrim(reference_code) <> ''
    AND reference_code ~ '\-\d+$';

  v_target := GREATEST(v_consumed, v_max_suffix, 1000);

  IF v_target > v_consumed THEN
    PERFORM pg_catalog.setval(
      'public.trial_bookings_ref_seq'::pg_catalog.regclass, v_target, TRUE
    );
    RAISE NOTICE 'STEP 7b: trial_bookings_ref_seq advanced to % (is_called=true)', v_target;
  ELSE
    RAISE NOTICE 'STEP 7b: trial_bookings_ref_seq already at %; no advance needed', v_seq_lv;
  END IF;
END;
$$;


-- ===========================================================================
-- STEP 8 — NORMALISE admissions.status + ADD CHECK CONSTRAINT + PRESERVE NOT NULL
--
-- Original schema status values: 'pending', 'approved', 'rejected'
-- Approved new lowercase values : 'pending', 'under_review', 'accepted', 'rejected', 'waitlisted'
--
-- Legacy mapping:
--   'approved'       → 'accepted'   (original database value normalized)
--   'Approved'       → 'accepted'
--   'Pending'        → 'pending'
--   'Under Review'   → 'under_review'
--   'Accepted'       → 'accepted'
--   'Rejected'       → 'rejected'
--   'Waitlisted'     → 'waitlisted'
--   (lowercase set)  → unchanged
--   ANYTHING ELSE    → RAISE EXCEPTION (migration halts for human review)
--
-- CHECK constraint handling:
--   • Normalized definition matches target → preserve (v_already_correct = TRUE)
--   • Normalized definition is known legacy → drop and replace
--   • Normalized definition is unknown → RAISE EXCEPTION
--
-- NOT NULL constraint handling:
--   • Verifies no NULL rows exist (halts with exception if found)
--   • Enforces column-level NOT NULL constraint if not already present
-- ===========================================================================
DO $$
DECLARE
  v_attnum          INT2;
  v_attnotnull      BOOLEAN;
  v_null_count      BIGINT;
  v_conname         TEXT;
  v_condef          TEXT;
  v_condef_norm     TEXT;
  v_already_correct BOOLEAN := FALSE;
  v_rows            BIGINT;
  v_bad_vals        TEXT;
  v_def_expr        TEXT;

  -- The exact expression PostgreSQL stores for our target constraint
  v_target_def CONSTANT TEXT :=
    $d$((status = ANY (ARRAY['pending'::text, 'under_review'::text, 'accepted'::text, 'rejected'::text, 'waitlisted'::text])))$d$;

  -- Known legacy definitions safe to replace (includes original DB schema constraint)
  v_known_old_defs TEXT[] := ARRAY[
    -- Original schema constraint: pending, approved, rejected
    $d$((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])))$d$,
    $d$((status = ANY (ARRAY['Pending'::text, 'Approved'::text, 'Rejected'::text])))$d$,
    $d$(((status = 'pending'::text) OR (status = 'approved'::text) OR (status = 'rejected'::text)))$d$,
    -- Previous migration drafts & case variations
    $d$((status = ANY (ARRAY['Pending'::text, 'Under Review'::text, 'Accepted'::text, 'Rejected'::text, 'Waitlisted'::text])))$d$,
    $d$((status = ANY (ARRAY['pending'::text, 'under_review'::text, 'accepted'::text, 'rejected'::text])))$d$,
    $d$((status = ANY (ARRAY['Pending'::text, 'Under Review'::text, 'Approved'::text, 'Rejected'::text])))$d$,
    $d$((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'waitlisted'::text])))$d$,
    $d$((status = ANY (ARRAY['pending'::text, 'under_review'::text, 'approved'::text, 'rejected'::text, 'waitlisted'::text])))$d$,
    $d$((status IS NOT NULL))$d$,
    $d$((status <> ''::text))$d$
  ];

BEGIN
  -- Resolve attnum and attnotnull for admissions.status
  SELECT a.attnum, a.attnotnull
  INTO   v_attnum, v_attnotnull
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname = 'admissions'
    AND  a.attname = 'status'
    AND  a.attnum  > 0 AND NOT a.attisdropped;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'STEP 8: admissions.status column not found.';
  END IF;

  -- 8a. Preserve NOT NULL semantics
  SELECT pg_catalog.count(*)
  INTO   v_null_count
  FROM   public.admissions
  WHERE  status IS NULL;

  IF v_null_count > 0 THEN
    RAISE EXCEPTION
      'STEP 8: Cannot preserve NOT NULL on admissions.status: % row(s) contain NULL. '
      'Resolve these records before re-running the migration.', v_null_count;
  END IF;

  IF NOT v_attnotnull THEN
    ALTER TABLE public.admissions ALTER COLUMN status SET NOT NULL;
    RAISE NOTICE 'STEP 8: Enforced NOT NULL on admissions.status column';
  ELSE
    RAISE NOTICE 'STEP 8: admissions.status is already NOT NULL — preserved';
  END IF;

  -- 8b. Validate column default (if present)
  SELECT pg_catalog.pg_get_expr(d.adbin, d.adrelid)
  INTO   v_def_expr
  FROM   pg_catalog.pg_attrdef d
  WHERE  d.adrelid = 'public.admissions'::pg_catalog.regclass
    AND  d.adnum   = v_attnum;

  IF v_def_expr IN ($$'pending'::text$$, $$'pending'$$, $$'pending'::character varying$$) THEN
    RAISE NOTICE 'STEP 8: admissions.status default is ''pending'' (valid target status) — preserved';
  ELSIF v_def_expr IS NULL THEN
    RAISE NOTICE 'STEP 8: admissions.status has no default — OK';
  ELSIF v_def_expr NOT IN (
    $$'pending'::text$$, $$'under_review'::text$$, $$'accepted'::text$$, $$'rejected'::text$$, $$'waitlisted'::text$$,
    $$'pending'$$, $$'under_review'$$, $$'accepted'$$, $$'rejected'$$, $$'waitlisted'$$
  ) THEN
    RAISE EXCEPTION
      'STEP 8: Unexpected custom default on admissions.status: [%]. Review manually.',
      v_def_expr;
  ELSE
    RAISE NOTICE 'STEP 8: admissions.status default % is valid — preserved', v_def_expr;
  END IF;

  -- 8c. Guard: detect unexpected status values BEFORE modifying anything
  SELECT pg_catalog.string_agg(DISTINCT status, ', ' ORDER BY status)
  INTO   v_bad_vals
  FROM   public.admissions
  WHERE  status IS NOT NULL
    AND  status NOT IN (
           'pending','under_review','accepted','rejected','waitlisted',
           'approved',
           'Pending','Under Review','Accepted','Rejected','Waitlisted',
           'Approved'
         );

  IF v_bad_vals IS NOT NULL THEN
    RAISE EXCEPTION
      'STEP 8: Unexpected admissions.status value(s) found: [%]. '
      'Add an explicit mapping for each value before re-running.', v_bad_vals;
  END IF;

  -- 8d. Handle existing single-column CHECK constraints on status
  -- MUST happen BEFORE UPDATE so old constraints do not reject the new values.
  FOR v_conname, v_condef IN
    SELECT c.conname, pg_catalog.pg_get_constraintdef(c.oid)
    FROM   pg_catalog.pg_constraint c
    WHERE  c.conrelid = 'public.admissions'::pg_catalog.regclass
      AND  c.contype  = 'c'
      AND  c.conkey   = ARRAY[v_attnum]::INT2[]
    ORDER BY c.oid
  LOOP
    v_condef_norm := pg_catalog.regexp_replace(v_condef, '^CHECK\s*', '');

    IF v_condef_norm = v_target_def THEN
      v_already_correct := TRUE;
      RAISE NOTICE 'STEP 8: Correct admissions.status CHECK already present as "%" — preserved', v_conname;

    ELSIF v_condef_norm = ANY(v_known_old_defs) THEN
      RAISE NOTICE 'STEP 8: Dropping known-legacy admissions.status CHECK "%" (was: %)', v_conname, v_condef;
      EXECUTE pg_catalog.format('ALTER TABLE public.admissions DROP CONSTRAINT %I', v_conname);

    ELSE
      RAISE EXCEPTION
        'STEP 8: Unexpected CHECK constraint "%" on admissions.status with unknown definition: [%]. '
        'Review manually before re-running.',
        v_conname, v_condef;
    END IF;
  END LOOP;

  -- 8e. Normalise legacy values → approved lowercase values
  -- Safely maps 'approved' → 'accepted' while preserving 'pending' and 'rejected'
  UPDATE public.admissions
  SET    status = CASE status
    WHEN 'approved'      THEN 'accepted'
    WHEN 'Approved'      THEN 'accepted'
    WHEN 'Pending'       THEN 'pending'
    WHEN 'Under Review'  THEN 'under_review'
    WHEN 'Accepted'      THEN 'accepted'
    WHEN 'Rejected'      THEN 'rejected'
    WHEN 'Waitlisted'    THEN 'waitlisted'
    ELSE status
  END
  WHERE  status IN (
    'approved', 'Approved',
    'Pending', 'Under Review', 'Accepted', 'Rejected', 'Waitlisted'
  );

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RAISE NOTICE 'STEP 8: Normalised admissions.status — % row(s) updated', v_rows;

  -- 8f. Add new constraint only if correct form was not already present
  IF NOT v_already_correct THEN
    ALTER TABLE public.admissions
      ADD CONSTRAINT chk_admissions_status
      CHECK (status IN ('pending','under_review','accepted','rejected','waitlisted'));
    RAISE NOTICE 'STEP 8: Added chk_admissions_status constraint';
  END IF;

END;
$$;


-- ===========================================================================
-- STEP 9 — NORMALISE trial_bookings.status + UPDATE DEFAULT + ADD CHECK CONSTRAINT + PRESERVE NOT NULL
--
-- Original schema status values: 'pending', 'confirmed', 'completed', 'cancelled'
-- Original schema default     : 'pending'
-- Approved new lowercase values : 'requested', 'confirmed', 'completed', 'cancelled'
-- Approved new default          : 'requested'
--
-- Column Default Handling:
--   • Legacy 'pending' default → altered to 'requested'
--   • Already 'requested'      → preserved
--   • Unset (NULL)             → set to 'requested'
--   • Unexpected custom default→ RAISE EXCEPTION
--
-- Legacy mapping:
--   'pending'                  → 'requested'  (original database value normalized)
--   'Pending'                  → 'requested'
--   'Requested (Unconfirmed)'  → 'requested'
--   'Confirmed'                → 'confirmed'
--   'Completed'                → 'completed'
--   'Cancelled'                → 'cancelled'  (strictly preserved)
--   'Canceled'                 → 'cancelled'  (alternate spelling normalized)
--   (lowercase set)            → unchanged
--   ANYTHING ELSE              → RAISE EXCEPTION
--
-- NOT NULL constraint handling:
--   • Verifies no NULL rows exist (halts with exception if found)
--   • Enforces column-level NOT NULL constraint if not already present
-- ===========================================================================
DO $$
DECLARE
  v_attnum          INT2;
  v_attnotnull      BOOLEAN;
  v_null_count      BIGINT;
  v_conname         TEXT;
  v_condef          TEXT;
  v_condef_norm     TEXT;
  v_already_correct BOOLEAN := FALSE;
  v_rows            BIGINT;
  v_bad_vals        TEXT;
  v_def_expr        TEXT;

  v_target_def CONSTANT TEXT :=
    $d$((status = ANY (ARRAY['requested'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])))$d$;

  -- Known legacy definitions safe to replace (includes original DB schema constraint)
  v_known_old_defs TEXT[] := ARRAY[
    -- Original schema constraint: pending, confirmed, completed, cancelled
    $d$((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])))$d$,
    $d$((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'canceled'::text])))$d$,
    $d$((status = ANY (ARRAY['Pending'::text, 'Confirmed'::text, 'Completed'::text, 'Cancelled'::text])))$d$,
    $d$((status = ANY (ARRAY['Pending'::text, 'Confirmed'::text, 'Completed'::text, 'Canceled'::text])))$d$,
    $d$(((status = 'pending'::text) OR (status = 'confirmed'::text) OR (status = 'completed'::text) OR (status = 'cancelled'::text)))$d$,
    -- Previous migration drafts & case variations
    $d$((status = ANY (ARRAY['Requested (Unconfirmed)'::text, 'Confirmed'::text, 'Completed'::text, 'Cancelled'::text])))$d$,
    $d$((status = ANY (ARRAY['Requested (Unconfirmed)'::text, 'Confirmed'::text, 'Completed'::text, 'Canceled'::text])))$d$,
    $d$((status = ANY (ARRAY['requested'::text, 'confirmed'::text, 'completed'::text])))$d$,
    $d$((status IS NOT NULL))$d$,
    $d$((status <> ''::text))$d$
  ];

BEGIN
  SELECT a.attnum, a.attnotnull
  INTO   v_attnum, v_attnotnull
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname = 'trial_bookings'
    AND  a.attname = 'status'
    AND  a.attnum  > 0 AND NOT a.attisdropped;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'STEP 9: trial_bookings.status column not found.';
  END IF;

  -- 9a. Preserve NOT NULL semantics
  SELECT pg_catalog.count(*)
  INTO   v_null_count
  FROM   public.trial_bookings
  WHERE  status IS NULL;

  IF v_null_count > 0 THEN
    RAISE EXCEPTION
      'STEP 9: Cannot preserve NOT NULL on trial_bookings.status: % row(s) contain NULL. '
      'Resolve these records before re-running the migration.', v_null_count;
  END IF;

  IF NOT v_attnotnull THEN
    ALTER TABLE public.trial_bookings ALTER COLUMN status SET NOT NULL;
    RAISE NOTICE 'STEP 9: Enforced NOT NULL on trial_bookings.status column';
  ELSE
    RAISE NOTICE 'STEP 9: trial_bookings.status is already NOT NULL — preserved';
  END IF;

  -- 9b. Inspect and update trial_bookings.status column default
  SELECT pg_catalog.pg_get_expr(d.adbin, d.adrelid)
  INTO   v_def_expr
  FROM   pg_catalog.pg_attrdef d
  WHERE  d.adrelid = 'public.trial_bookings'::pg_catalog.regclass
    AND  d.adnum   = v_attnum;

  IF v_def_expr IN ($$'pending'::text$$, $$'pending'$$, $$'pending'::character varying$$) THEN
    ALTER TABLE public.trial_bookings ALTER COLUMN status SET DEFAULT 'requested';
    RAISE NOTICE 'STEP 9: Updated trial_bookings.status default from % to ''requested''', v_def_expr;
  ELSIF v_def_expr IN ($$'requested'::text$$, $$'requested'$$, $$'requested'::character varying$$) THEN
    RAISE NOTICE 'STEP 9: trial_bookings.status default already ''requested'' — preserved';
  ELSIF v_def_expr IS NULL THEN
    ALTER TABLE public.trial_bookings ALTER COLUMN status SET DEFAULT 'requested';
    RAISE NOTICE 'STEP 9: Set trial_bookings.status default to ''requested'' (was unset)';
  ELSE
    RAISE EXCEPTION
      'STEP 9: Unexpected custom default on trial_bookings.status: [%]. '
      'Expected legacy ''pending'' or target ''requested''. Review manually.',
      v_def_expr;
  END IF;

  -- 9c. Guard: detect unexpected values before touching anything
  SELECT pg_catalog.string_agg(DISTINCT status, ', ' ORDER BY status)
  INTO   v_bad_vals
  FROM   public.trial_bookings
  WHERE  status IS NOT NULL
    AND  status NOT IN (
           'requested','confirmed','completed','cancelled',
           'pending',
           'Pending',
           'Requested (Unconfirmed)','Confirmed','Completed','Cancelled','Canceled'
         );

  IF v_bad_vals IS NOT NULL THEN
    RAISE EXCEPTION
      'STEP 9: Unexpected trial_bookings.status value(s) found: [%]. '
      'Add an explicit mapping for each value before re-running.', v_bad_vals;
  END IF;

  -- 9d. Handle existing single-column CHECK constraints BEFORE updating rows
  FOR v_conname, v_condef IN
    SELECT c.conname, pg_catalog.pg_get_constraintdef(c.oid)
    FROM   pg_catalog.pg_constraint c
    WHERE  c.conrelid = 'public.trial_bookings'::pg_catalog.regclass
      AND  c.contype  = 'c'
      AND  c.conkey   = ARRAY[v_attnum]::INT2[]
    ORDER BY c.oid
  LOOP
    v_condef_norm := pg_catalog.regexp_replace(v_condef, '^CHECK\s*', '');

    IF v_condef_norm = v_target_def THEN
      v_already_correct := TRUE;
      RAISE NOTICE 'STEP 9: Correct trial_bookings.status CHECK already present as "%" — preserved', v_conname;

    ELSIF v_condef_norm = ANY(v_known_old_defs) THEN
      RAISE NOTICE 'STEP 9: Dropping known-legacy trial_bookings.status CHECK "%" (was: %)', v_conname, v_condef;
      EXECUTE pg_catalog.format('ALTER TABLE public.trial_bookings DROP CONSTRAINT %I', v_conname);

    ELSE
      RAISE EXCEPTION
        'STEP 9: Unexpected CHECK constraint "%" on trial_bookings.status with unknown definition: [%]. '
        'Review manually before re-running.',
        v_conname, v_condef;
    END IF;
  END LOOP;

  -- 9e. Normalise legacy values: safely maps 'pending' → 'requested'
  -- Preserves 'confirmed', 'completed', 'cancelled'
  UPDATE public.trial_bookings
  SET    status = CASE status
    WHEN 'pending'                 THEN 'requested'
    WHEN 'Pending'                 THEN 'requested'
    WHEN 'Requested (Unconfirmed)' THEN 'requested'
    WHEN 'Confirmed'               THEN 'confirmed'
    WHEN 'Completed'               THEN 'completed'
    WHEN 'Cancelled'               THEN 'cancelled'
    WHEN 'Canceled'                THEN 'cancelled'
    ELSE status
  END
  WHERE  status IN (
    'pending', 'Pending',
    'Requested (Unconfirmed)', 'Confirmed', 'Completed', 'Cancelled', 'Canceled'
  );

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RAISE NOTICE 'STEP 9: Normalised trial_bookings.status — % row(s) updated', v_rows;

  -- 9f. Add new constraint only if correct form was not already present
  IF NOT v_already_correct THEN
    ALTER TABLE public.trial_bookings
      ADD CONSTRAINT chk_trial_bookings_status
      CHECK (status IN ('requested','confirmed','completed','cancelled'));
    RAISE NOTICE 'STEP 9: Added chk_trial_bookings_status constraint';
  END IF;

END;
$$;


-- ===========================================================================
-- STEP 9b — TEMPORARILY DROP EXISTING REFERENCE CODE TRIGGERS (IF ANY)
--
-- CRITICAL SAFETY GUARD:
--   If triggers already exist (e.g. from an earlier migration attempt or rerun)
--   with a definition that preserves OLD.reference_code on UPDATE, running the
--   backfill UPDATE in Steps 10 & 11 would cause the trigger to overwrite the
--   newly assigned reference_code back to NULL (or ''), defeating the backfill
--   and causing ALTER TABLE ... SET NOT NULL to fail.
--
--   Dropping the triggers here allows Steps 10 and 11 to safely execute pure
--   backfill updates. The hardened, permanent triggers are attached in Step 13.
--   Because the tables are locked in SHARE ROW EXCLUSIVE MODE, no concurrent
--   inserts or updates can occur in the interim.
-- ===========================================================================
DO $$
BEGIN
  DROP TRIGGER IF EXISTS set_admissions_ref_code ON public.admissions;
  DROP TRIGGER IF EXISTS set_trial_bookings_ref_code ON public.trial_bookings;
  RAISE NOTICE 'STEP 9b: Ensured reference code triggers are dropped prior to backfill';
END;
$$;


-- ===========================================================================
-- STEP 10 — BACKFILL admissions.reference_code + SET NOT NULL
--   Covers NULL, blank, and whitespace-only values (btrim(reference_code) = '').
--   Runs AFTER sequence sync (Step 7a), AFTER table lock, and AFTER Step 9b.
--   Format: ADM-YY-NNNNN   e.g. ADM-25-01001 (overflow-safe minimum 5 digits)
-- ===========================================================================
DO $$
DECLARE
  r               RECORD;
  v_rows          BIGINT := 0;
  v_seq_val       TEXT;
  v_null_ts_count BIGINT := 0;
BEGIN
  -- Pre-flight check: Detect NULL created_at in public.admissions
  -- Reference code formatting requires created_at to derive the two-digit year ('YY').
  -- Existing records with NULL created_at must be resolved; timestamps must never be silently modified or fabricated.
  SELECT pg_catalog.count(*)
  INTO   v_null_ts_count
  FROM   public.admissions
  WHERE  created_at IS NULL;

  IF v_null_ts_count > 0 THEN
    RAISE EXCEPTION
      'STEP 10: Cannot backfill admissions.reference_code: % record(s) in public.admissions have NULL created_at. '
      'Timestamps must not be silently modified or fabricated. Resolve NULL created_at records before re-running.',
      v_null_ts_count;
  END IF;

  FOR r IN
    SELECT id, created_at
    FROM   public.admissions
    WHERE  reference_code IS NULL OR pg_catalog.btrim(reference_code) = ''
    ORDER  BY created_at, id   -- deterministic backfill order
  LOOP
    v_seq_val := pg_catalog.nextval('public.admissions_ref_seq'::pg_catalog.regclass)::pg_catalog.text;

    UPDATE public.admissions
    SET    reference_code =
             'ADM-'
             || pg_catalog.to_char(r.created_at AT TIME ZONE 'UTC', 'YY')
             || '-'
             || pg_catalog.lpad(
                  v_seq_val,
                  GREATEST(5, pg_catalog.length(v_seq_val)),
                  '0'
                )
    WHERE  id = r.id;
    v_rows := v_rows + 1;
  END LOOP;
  RAISE NOTICE 'STEP 10: Backfilled % admissions reference code(s)', v_rows;

  ALTER TABLE public.admissions ALTER COLUMN reference_code SET NOT NULL;
  RAISE NOTICE 'STEP 10: admissions.reference_code is now NOT NULL';
END;
$$;


-- ===========================================================================
-- STEP 11 — BACKFILL trial_bookings.reference_code + SET NOT NULL
--   Covers NULL, blank, and whitespace-only values (btrim(reference_code) = '').
--   Format: TRL-YY-NNNNN   e.g. TRL-25-01001 (overflow-safe minimum 5 digits)
-- ===========================================================================
DO $$
DECLARE
  r               RECORD;
  v_rows          BIGINT := 0;
  v_seq_val       TEXT;
  v_null_ts_count BIGINT := 0;
BEGIN
  -- Pre-flight check: Detect NULL created_at in public.trial_bookings
  -- Reference code formatting requires created_at to derive the two-digit year ('YY').
  -- Existing records with NULL created_at must be resolved; timestamps must never be silently modified or fabricated.
  SELECT pg_catalog.count(*)
  INTO   v_null_ts_count
  FROM   public.trial_bookings
  WHERE  created_at IS NULL;

  IF v_null_ts_count > 0 THEN
    RAISE EXCEPTION
      'STEP 11: Cannot backfill trial_bookings.reference_code: % record(s) in public.trial_bookings have NULL created_at. '
      'Timestamps must not be silently modified or fabricated. Resolve NULL created_at records before re-running.',
      v_null_ts_count;
  END IF;

  FOR r IN
    SELECT id, created_at
    FROM   public.trial_bookings
    WHERE  reference_code IS NULL OR pg_catalog.btrim(reference_code) = ''
    ORDER  BY created_at, id
  LOOP
    v_seq_val := pg_catalog.nextval('public.trial_bookings_ref_seq'::pg_catalog.regclass)::pg_catalog.text;

    UPDATE public.trial_bookings
    SET    reference_code =
             'TRL-'
             || pg_catalog.to_char(r.created_at AT TIME ZONE 'UTC', 'YY')
             || '-'
             || pg_catalog.lpad(
                  v_seq_val,
                  GREATEST(5, pg_catalog.length(v_seq_val)),
                  '0'
                )
    WHERE  id = r.id;
    v_rows := v_rows + 1;
  END LOOP;
  RAISE NOTICE 'STEP 11: Backfilled % trial_bookings reference code(s)', v_rows;

  ALTER TABLE public.trial_bookings ALTER COLUMN reference_code SET NOT NULL;
  RAISE NOTICE 'STEP 11: trial_bookings.reference_code is now NOT NULL';
END;
$$;


-- ===========================================================================
-- STEP 12 — CREATE TRIGGER FUNCTIONS  (SECURITY DEFINER, search_path = '')
--
-- Security & Immutability Rules:
--   1. On INSERT: ALWAYS generates a trusted server-side sequence code.
--      Any client-supplied reference_code is unconditionally overwritten.
--   2. On UPDATE:
--      • If row ALREADY has an issued code (non-null/non-blank/non-whitespace),
--        enforce strict immutability: NEW.reference_code := OLD.reference_code.
--      • If row had NO reference code (NULL, blank, or whitespace-only legacy row):
--        Unconditionally generate a trusted server-side sequence code.
--        Client-supplied reference codes are NEVER accepted.
--   3. Overflow-safe formatting:
--      • LPAD(val, GREATEST(5, LENGTH(val)), '0') guarantees minimum 5 digits
--        without truncating values > 99999.
--   4. Execution & Path hardening:
--      • SET search_path = '' prevents search-path hijacking.
--      • Fully qualified system functions (pg_catalog.*).
--      • EXECUTE is revoked from PUBLIC.
-- ===========================================================================
CREATE OR REPLACE FUNCTION public.trg_admissions_set_ref_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $func$
DECLARE
  v_seq_val TEXT;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- If row already has a valid issued reference code (non-null, non-blank, non-whitespace), enforce strict immutability
    IF OLD.reference_code IS NOT NULL AND pg_catalog.btrim(OLD.reference_code) <> '' THEN
      NEW.reference_code := OLD.reference_code;
    ELSE
      -- Unassigned legacy row (NULL, blank, or whitespace-only): ALWAYS generate a trusted server-side code.
      -- Any client-supplied reference_code is unconditionally overwritten.
      v_seq_val := pg_catalog.nextval('public.admissions_ref_seq'::pg_catalog.regclass)::pg_catalog.text;
      NEW.reference_code :=
        'ADM-'
        || pg_catalog.to_char(pg_catalog.now() AT TIME ZONE 'UTC', 'YY')
        || '-'
        || pg_catalog.lpad(
             v_seq_val,
             GREATEST(5, pg_catalog.length(v_seq_val)),
             '0'
           );
    END IF;
    RETURN NEW;
  END IF;

  -- On INSERT: always overwrite with trusted server-generated sequence code
  v_seq_val := pg_catalog.nextval('public.admissions_ref_seq'::pg_catalog.regclass)::pg_catalog.text;
  NEW.reference_code :=
    'ADM-'
    || pg_catalog.to_char(pg_catalog.now() AT TIME ZONE 'UTC', 'YY')
    || '-'
    || pg_catalog.lpad(
         v_seq_val,
         GREATEST(5, pg_catalog.length(v_seq_val)),
         '0'
       );
  RETURN NEW;
END;
$func$;

REVOKE EXECUTE ON FUNCTION public.trg_admissions_set_ref_code() FROM PUBLIC;


CREATE OR REPLACE FUNCTION public.trg_trial_bookings_set_ref_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $func$
DECLARE
  v_seq_val TEXT;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- If row already has a valid issued reference code (non-null, non-blank, non-whitespace), enforce strict immutability
    IF OLD.reference_code IS NOT NULL AND pg_catalog.btrim(OLD.reference_code) <> '' THEN
      NEW.reference_code := OLD.reference_code;
    ELSE
      -- Unassigned legacy row (NULL, blank, or whitespace-only): ALWAYS generate a trusted server-side code.
      -- Any client-supplied reference_code is unconditionally overwritten.
      v_seq_val := pg_catalog.nextval('public.trial_bookings_ref_seq'::pg_catalog.regclass)::pg_catalog.text;
      NEW.reference_code :=
        'TRL-'
        || pg_catalog.to_char(pg_catalog.now() AT TIME ZONE 'UTC', 'YY')
        || '-'
        || pg_catalog.lpad(
             v_seq_val,
             GREATEST(5, pg_catalog.length(v_seq_val)),
             '0'
           );
    END IF;
    RETURN NEW;
  END IF;

  -- On INSERT: always overwrite with trusted server-generated sequence code
  v_seq_val := pg_catalog.nextval('public.trial_bookings_ref_seq'::pg_catalog.regclass)::pg_catalog.text;
  NEW.reference_code :=
    'TRL-'
    || pg_catalog.to_char(pg_catalog.now() AT TIME ZONE 'UTC', 'YY')
    || '-'
    || pg_catalog.lpad(
         v_seq_val,
         GREATEST(5, pg_catalog.length(v_seq_val)),
         '0'
       );
  RETURN NEW;
END;
$func$;

REVOKE EXECUTE ON FUNCTION public.trg_trial_bookings_set_ref_code() FROM PUBLIC;

DO $$
BEGIN
  RAISE NOTICE 'STEP 12: Trigger functions created/replaced; EXECUTE revoked from PUBLIC';
END;
$$;


-- ===========================================================================
-- STEP 13 — ATTACH BEFORE INSERT OR UPDATE TRIGGERS
--   DROP IF EXISTS before CREATE so re-runs are safe.
-- ===========================================================================
DO $$
BEGIN
  DROP TRIGGER IF EXISTS set_admissions_ref_code ON public.admissions;
  CREATE TRIGGER set_admissions_ref_code
    BEFORE INSERT OR UPDATE ON public.admissions
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_admissions_set_ref_code();
  RAISE NOTICE 'STEP 13a: Trigger set_admissions_ref_code attached to admissions';

  DROP TRIGGER IF EXISTS set_trial_bookings_ref_code ON public.trial_bookings;
  CREATE TRIGGER set_trial_bookings_ref_code
    BEFORE INSERT OR UPDATE ON public.trial_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_trial_bookings_set_ref_code();
  RAISE NOTICE 'STEP 13b: Trigger set_trial_bookings_ref_code attached to trial_bookings';
END;
$$;


-- ===========================================================================
-- STEP 14 — VERIFY SEQUENCE PRIVILEGES FOR BOTH TRIGGER-FUNCTION OWNERS
--
-- The trigger functions run with SECURITY DEFINER, so they execute as the
-- role that owns the function (typically "postgres" in Supabase, a superuser).
-- A superuser bypasses privilege checks and always has sequence access.
--
-- If the function owner is NOT a superuser, we verify they hold explicit
-- USAGE or SELECT privilege on the sequence.  If they do not, we RAISE
-- EXCEPTION — halting the migration immediately so privileges can be granted.
-- ===========================================================================
DO $$
DECLARE
  v_func_name   TEXT;
  v_owner       NAME;
  v_is_super    BOOLEAN;
  v_has_usage   BOOLEAN;
BEGIN
  FOREACH v_func_name IN ARRAY ARRAY[
    'trg_admissions_set_ref_code',
    'trg_trial_bookings_set_ref_code'
  ]
  LOOP
    -- Determine function owner
    SELECT r.rolname, r.rolsuper
    INTO   v_owner, v_is_super
    FROM   pg_catalog.pg_proc p
    JOIN   pg_catalog.pg_roles r ON r.oid = p.proowner
    WHERE  p.pronamespace = 'public'::pg_catalog.regnamespace
      AND  p.proname = v_func_name;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'STEP 14: Cannot find function public.% to verify owner. '
        'Ensure Step 12 succeeded.', v_func_name;
    END IF;

    IF v_is_super THEN
      RAISE NOTICE
        'STEP 14: Function public.% owned by "%" (superuser) — sequence access guaranteed',
        v_func_name, v_owner;
    ELSE
      -- Non-superuser: check explicit USAGE on both sequences
      SELECT bool_and(
        pg_catalog.has_sequence_privilege(v_owner::TEXT, seq::pg_catalog.regclass, 'USAGE')
      )
      INTO v_has_usage
      FROM (VALUES
        ('public.admissions_ref_seq'),
        ('public.trial_bookings_ref_seq')
      ) AS t(seq);

      IF v_has_usage THEN
        RAISE NOTICE
          'STEP 14: Function public.% owned by non-superuser "%" '
          'and has USAGE on required sequences — OK',
          v_func_name, v_owner;
      ELSE
        RAISE EXCEPTION
          'STEP 14: Function public.% is owned by non-superuser role "%" '
          'which does NOT have USAGE on the required sequences. '
          'Execute the following before re-running this migration: '
          'GRANT USAGE ON SEQUENCE public.admissions_ref_seq TO %; '
          'GRANT USAGE ON SEQUENCE public.trial_bookings_ref_seq TO %;',
          v_func_name, v_owner, v_owner, v_owner;
      END IF;
    END IF;

  END LOOP;
END;
$$;


COMMIT;

-- =============================================================================
-- END OF MIGRATION SCRIPT — v13 FINAL REVIEW CANDIDATE
-- =============================================================================
