-- =============================================================================
-- SK TAPE BALL ACADEMY — TASK 4 SCHEMA MIGRATION
-- Version : v15 — FINAL REVIEW CANDIDATE (UNIQUE CONSTRAINT POST-BACKFILL ORDERING & DUPLICATE CHECKS)
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
-- UNIQUE CONSTRAINT CREATION ORDERING & HARDENING (STEPS 4, 5, 11b, 11c):
--   • Steps 4 & 5 add the reference_code columns (as nullable TEXT) and inspect any pre-existing
--     constraints or standalone indexes, but DELIBERATELY DEFER new UNIQUE constraint creation.
--   • This ensures that legacy rows containing NULL, empty strings (''), or whitespace ('   ')
--     do NOT trigger unique constraint violations during initial schema alteration.
--   • Steps 10 & 11 execute the backfill, assigning unique sequential codes to all unassigned rows
--     and enforcing NOT NULL on reference_code.
--   • Steps 11b & 11c perform an explicit duplicate check on non-NULL reference_code values:
--     - If duplicate values exist, halts immediately with a clear exception listing the duplicates.
--     - If 0 duplicates exist, safely enforces the UNIQUE constraint:
--       * Preserves existing correct constraint if already present.
--       * Skips if an equivalent constraint under a different name already exists.
--       * Attaches existing standalone index via USING INDEX if named *_reference_code_key.
--       * Skips creating duplicate index if another valid standalone unique index exists.
--       * Creates new UNIQUE constraint only if no equivalent constraint or index exists.
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
-- COLUMN TYPE VALIDATION (STEPS 1, 2, 4 & 5):
--   • Before skipping existing columns, their data type is verified:
--     - students.full_name must be TEXT (pg_catalog.text). Halts if type differs.
--     - students.guardian_profile_id must be UUID (pg_catalog.uuid). Halts if type differs.
--     - admissions.reference_code must be TEXT (pg_catalog.text). Halts if type differs.
--     - trial_bookings.reference_code must be TEXT (pg_catalog.text). Halts if type differs.
--   • This prevents silent acceptance of incompatible pre-existing schema objects.
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
--   3. Year extraction in trigger functions (consistent with backfill):
--      • Trigger functions derive the two-digit year from NEW.created_at when
--        available (non-NULL). If NEW.created_at is NULL (unusual but possible
--        for applications not setting the timestamp before INSERT), falls back
--        to pg_catalog.now() AT TIME ZONE 'UTC'. This matches the backfill
--        strategy (created_at) and avoids using now() for rows that have a
--        proper timestamp already set.
--   4. Execution & Path hardening:
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
--   If the column already exists, verify it is exactly TEXT (pg_catalog.text).
--   Halts with a clear exception if the existing type is unexpected.
-- ===========================================================================
DO $$
DECLARE
  v_typname TEXT;
BEGIN
  SELECT pg_catalog.format_type(a.atttypid, a.atttypmod)
  INTO   v_typname
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname  = 'students'
    AND  a.attname  = 'full_name'
    AND  a.attnum   > 0
    AND  NOT a.attisdropped;

  IF NOT FOUND THEN
    -- Column does not exist — add it
    ALTER TABLE public.students ADD COLUMN full_name TEXT;
    RAISE NOTICE 'STEP 1: Added students.full_name (TEXT)';
  ELSIF v_typname = 'text' THEN
    RAISE NOTICE 'STEP 1: students.full_name already exists as TEXT — skipped';
  ELSE
    RAISE EXCEPTION
      'STEP 1: students.full_name already exists but has unexpected type "%". '
      'Expected "text". Inspect and resolve manually before re-running.',
      v_typname;
  END IF;
END;
$$;


-- ===========================================================================
-- STEP 2 — ADD students.guardian_profile_id column + FK
--          FK: students.guardian_profile_id → profiles.id  ON DELETE SET NULL
--
-- Validation covers:
--   • Column type verified as UUID if already existing (halts on unexpected type)
--   • Constraint exists with contype = 'f'                     (FK type)
--   • conkey maps to guardian_profile_id attnum                (source column)
--   • confrelid is public.profiles                             (target table)
--   • confkey maps to profiles.id attnum                       (target column)
--   • confdeltype = 'n'                                        (ON DELETE SET NULL)
--   • convalidated = TRUE                                      (validated)
--   • confupdtype = 'a'                                        (ON UPDATE NO ACTION)
--   • confmatchtype = 's'                                      (MATCH SIMPLE)
--   • condeferrable = FALSE                                    (NOT DEFERRABLE)
--   • condeferred = FALSE                                      (INITIALLY IMMEDIATE)
-- ===========================================================================
DO $$
DECLARE
  v_col_exists    BOOLEAN;
  v_col_typname   TEXT;
  v_contype       CHAR(1);
  v_conkey        INT2[];
  v_confkey       INT2[];
  v_confdeltype   CHAR(1);
  v_convalidated  BOOLEAN;
  v_confupdtype   CHAR(1);
  v_confmatchtype CHAR(1);
  v_condeferrable BOOLEAN;
  v_condeferred   BOOLEAN;
  v_src_attnum    INT2;
  v_tgt_attnum    INT2;
BEGIN

  -- 2a. Add column if missing; if already exists, verify it is UUID
  SELECT pg_catalog.format_type(a.atttypid, a.atttypmod)
  INTO   v_col_typname
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname  = 'students'
    AND  a.attname  = 'guardian_profile_id'
    AND  a.attnum   > 0
    AND  NOT a.attisdropped;

  IF NOT FOUND THEN
    ALTER TABLE public.students ADD COLUMN guardian_profile_id UUID;
    v_col_exists := FALSE;
    RAISE NOTICE 'STEP 2a: Added students.guardian_profile_id column (UUID)';
  ELSIF v_col_typname = 'uuid' THEN
    v_col_exists := TRUE;
    RAISE NOTICE 'STEP 2a: students.guardian_profile_id already exists as UUID — skipped';
  ELSE
    RAISE EXCEPTION
      'STEP 2a: students.guardian_profile_id already exists but has unexpected type "%". '
      'Expected "uuid". Inspect and resolve manually before re-running.',
      v_col_typname;
  END IF;

  -- 2b. Inspect any constraint named fk_students_guardian_profile
  SELECT contype, conkey, confkey, confdeltype,
         convalidated, confupdtype, confmatchtype, condeferrable, condeferred
  INTO   v_contype, v_conkey, v_confkey, v_confdeltype,
         v_convalidated, v_confupdtype, v_confmatchtype, v_condeferrable, v_condeferred
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

    -- Verify: constraint is validated (convalidated = TRUE)
    IF v_convalidated IS DISTINCT FROM TRUE THEN
      RAISE EXCEPTION
        'STEP 2b: "fk_students_guardian_profile" exists but is not validated '
        '(convalidated = %, expected TRUE). Inspect manually.',
        v_convalidated;
    END IF;

    -- Verify: ON UPDATE NO ACTION (confupdtype = 'a')
    IF v_confupdtype IS DISTINCT FROM 'a' THEN
      RAISE EXCEPTION
        'STEP 2b: "fk_students_guardian_profile" exists but has confupdtype "%" '
        '(expected "a" = ON UPDATE NO ACTION). Inspect manually.',
        v_confupdtype;
    END IF;

    -- Verify: MATCH SIMPLE (confmatchtype = 's')
    IF v_confmatchtype IS DISTINCT FROM 's' THEN
      RAISE EXCEPTION
        'STEP 2b: "fk_students_guardian_profile" exists but has confmatchtype "%" '
        '(expected "s" = MATCH SIMPLE). Inspect manually.',
        v_confmatchtype;
    END IF;

    -- Verify: NOT DEFERRABLE (condeferrable = FALSE)
    IF v_condeferrable IS DISTINCT FROM FALSE THEN
      RAISE EXCEPTION
        'STEP 2b: "fk_students_guardian_profile" exists but has condeferrable = % '
        '(expected FALSE = NOT DEFERRABLE). Inspect manually.',
        v_condeferrable;
    END IF;

    -- Verify: INITIALLY IMMEDIATE (condeferred = FALSE)
    IF v_condeferred IS DISTINCT FROM FALSE THEN
      RAISE EXCEPTION
        'STEP 2b: "fk_students_guardian_profile" exists but has condeferred = % '
        '(expected FALSE = INITIALLY IMMEDIATE). Inspect manually.',
        v_condeferred;
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
-- STEP 3 — Normalise & validate profiles.role + CHECK constraint + PRESERVE NOT NULL
--
-- Strategy:
--   1. Determine attnum and attnotnull for profiles.role.
--   2. Preserve NOT NULL:
--        • Verify no existing rows have role IS NULL.
--        • If NULL rows exist, RAISE EXCEPTION.
--        • Enforce column-level NOT NULL via ALTER TABLE ... ALTER COLUMN role SET NOT NULL.
--   3. Guard BEFORE modifying CHECK constraints:
--        • Inspect all existing profiles.role values.
--        • Accept target lowercase roles ('admin', 'coach', 'student', 'parent')
--          and explicitly approved, unambiguous legacy case variants
--          ('Admin', 'Coach', 'Student', 'Parent').
--        • Do NOT silently map 'guardian', 'user', or any other role value.
--        • If any unsupported role value exists, RAISE EXCEPTION listing those
--          values and halt BEFORE dropping or adding any CHECK constraint.
--   4. Enumerate all single-column CHECK constraints on profiles.role:
--        • If normalized definition matches target → set v_already_correct = TRUE.
--        • If normalized definition matches known legacy → drop it.
--        • If unknown → RAISE EXCEPTION (halt for DBA review).
--   5. Normalise explicitly approved legacy values ('Admin' → 'admin', etc.).
--   6. Verify all existing rows satisfy the final lowercase CHECK constraint,
--      and add chk_profiles_role if v_already_correct is FALSE.
-- ===========================================================================
DO $$
DECLARE
  v_attnum             INT2;
  v_attnotnull         BOOLEAN;
  v_null_count         BIGINT;
  v_bad_vals           TEXT;
  v_rows               BIGINT;
  v_invalid_post_count BIGINT;
  v_conname            TEXT;
  v_condef             TEXT;
  v_condef_norm        TEXT;
  v_already_correct    BOOLEAN := FALSE;

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

  -- 3b. Guard: inspect existing profiles.role values BEFORE modifying CHECK constraints.
  --     Only target lowercase roles and explicitly approved, unambiguous title-case
  --     legacy values ('Admin', 'Coach', 'Student', 'Parent') are permitted.
  --     Values such as 'guardian' or 'user' are NEVER silently mapped.
  SELECT pg_catalog.string_agg(DISTINCT role, ', ' ORDER BY role)
  INTO   v_bad_vals
  FROM   public.profiles
  WHERE  role IS NOT NULL
    AND  role NOT IN (
           'admin', 'coach', 'student', 'parent',
           'Admin', 'Coach', 'Student', 'Parent'
         );

  IF v_bad_vals IS NOT NULL THEN
    RAISE EXCEPTION
      'STEP 3: Unsupported profiles.role value(s) found: [%]. '
      'Values such as "guardian" or "user" are not silently mapped. '
      'Resolve or explicitly migrate these records before re-running.',
      v_bad_vals;
  END IF;

  -- 3c. Enumerate single-column CHECK constraints on profiles.role
  --     Must run BEFORE normalization UPDATE so legacy CHECK constraints do not reject normalized values.
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

  -- 3d. Normalise explicitly approved, unambiguous legacy values → lowercase target roles
  UPDATE public.profiles
  SET    role = CASE role
    WHEN 'Admin'   THEN 'admin'
    WHEN 'Coach'   THEN 'coach'
    WHEN 'Student' THEN 'student'
    WHEN 'Parent'  THEN 'parent'
    ELSE role
  END
  WHERE  role IN ('Admin', 'Coach', 'Student', 'Parent');

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RAISE NOTICE 'STEP 3: Normalised profiles.role — % row(s) updated', v_rows;

  -- 3e. Verify all existing rows satisfy the final lowercase CHECK constraint
  SELECT pg_catalog.count(*)
  INTO   v_invalid_post_count
  FROM   public.profiles
  WHERE  role IS NULL
     OR  role NOT IN ('admin', 'coach', 'student', 'parent');

  IF v_invalid_post_count > 0 THEN
    RAISE EXCEPTION
      'STEP 3: Post-normalization verification failed: % row(s) in public.profiles '
      'do not satisfy the target lowercase role constraint.',
      v_invalid_post_count;
  END IF;

  -- 3f. Add the new constraint only if the correct one was not already present
  IF NOT v_already_correct THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT chk_profiles_role
      CHECK (role IN ('admin', 'coach', 'student', 'parent'));
    RAISE NOTICE 'STEP 3: Added chk_profiles_role constraint';
  END IF;

END;
$$;


-- ===========================================================================
-- STEP 4 — ADD admissions.reference_code column (INSPECT CONSTRAINTS/INDEXES)
--          Column is created as nullable TEXT.
--          If the column already exists, verify it is exactly TEXT (pg_catalog.text).
--          Halts with a clear exception if the existing type is unexpected.
--          Actual UNIQUE constraint creation/enforcement is DEFERRED to Step 11b
--          (after backfill in Step 10 has populated all legacy rows and enforced NOT NULL).
-- ===========================================================================
DO $$
DECLARE
  v_attnum          INT2;
  v_col_atttypid    OID;
  v_col_typname     TEXT;
  v_contype         CHAR(1);
  v_conkey          INT2[];
  v_other_conname   TEXT;
  v_existing_idx    TEXT;
BEGIN
  -- 4a. Add column if missing; if already exists, verify it is TEXT
  SELECT a.atttypid, pg_catalog.format_type(a.atttypid, a.atttypmod)
  INTO   v_col_atttypid, v_col_typname
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname  = 'admissions'
    AND  a.attname  = 'reference_code'
    AND  a.attnum   > 0 AND NOT a.attisdropped;

  IF NOT FOUND THEN
    ALTER TABLE public.admissions ADD COLUMN reference_code TEXT;
    RAISE NOTICE 'STEP 4a: Added admissions.reference_code column (TEXT)';
  ELSIF v_col_atttypid = 'pg_catalog.text'::pg_catalog.regtype THEN
    RAISE NOTICE 'STEP 4a: admissions.reference_code already exists as TEXT — skipped';
  ELSE
    RAISE EXCEPTION
      'STEP 4a: admissions.reference_code already exists but has unexpected type "%". '
      'Expected "text". Inspect and resolve manually before re-running.',
      v_col_typname;
  END IF;

  -- Resolve attnum for admissions.reference_code
  SELECT a.attnum INTO v_attnum
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname = 'admissions'
    AND  a.attname = 'reference_code'
    AND  a.attnum  > 0 AND NOT a.attisdropped;

  -- 4b. Inspect any existing unique constraints or standalone indexes
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
    RAISE NOTICE 'STEP 4b: Existing UNIQUE constraint "admissions_reference_code_key" validated — preserved';
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
        '(different name) — noted', v_other_conname;
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
        RAISE NOTICE
          'STEP 4b: Standalone unique index "%" already covers admissions.reference_code '
          '— constraint enforcement deferred to Step 11b (after backfill)',
          v_existing_idx;
      ELSE
        RAISE NOTICE
          'STEP 4b: admissions.reference_code has no unique constraint or index yet '
          '— creation deferred to Step 11b (after backfill)';
      END IF;
    END IF;
  END IF;
END;
$$;


-- ===========================================================================
-- STEP 5 — ADD trial_bookings.reference_code column (INSPECT CONSTRAINTS/INDEXES)
--          Column is created as nullable TEXT.
--          If the column already exists, verify it is exactly TEXT (pg_catalog.text).
--          Halts with a clear exception if the existing type is unexpected.
--          Actual UNIQUE constraint creation/enforcement is DEFERRED to Step 11c
--          (after backfill in Step 11 has populated all legacy rows and enforced NOT NULL).
-- ===========================================================================
DO $$
DECLARE
  v_attnum          INT2;
  v_col_atttypid    OID;
  v_col_typname     TEXT;
  v_contype         CHAR(1);
  v_conkey          INT2[];
  v_other_conname   TEXT;
  v_existing_idx    TEXT;
BEGIN
  -- 5a. Add column if missing; if already exists, verify it is TEXT
  SELECT a.atttypid, pg_catalog.format_type(a.atttypid, a.atttypmod)
  INTO   v_col_atttypid, v_col_typname
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname  = 'trial_bookings'
    AND  a.attname  = 'reference_code'
    AND  a.attnum   > 0 AND NOT a.attisdropped;

  IF NOT FOUND THEN
    ALTER TABLE public.trial_bookings ADD COLUMN reference_code TEXT;
    RAISE NOTICE 'STEP 5a: Added trial_bookings.reference_code column (TEXT)';
  ELSIF v_col_atttypid = 'pg_catalog.text'::pg_catalog.regtype THEN
    RAISE NOTICE 'STEP 5a: trial_bookings.reference_code already exists as TEXT — skipped';
  ELSE
    RAISE EXCEPTION
      'STEP 5a: trial_bookings.reference_code already exists but has unexpected type "%". '
      'Expected "text". Inspect and resolve manually before re-running.',
      v_col_typname;
  END IF;

  -- Resolve attnum for trial_bookings.reference_code
  SELECT a.attnum INTO v_attnum
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname = 'trial_bookings'
    AND  a.attname = 'reference_code'
    AND  a.attnum  > 0 AND NOT a.attisdropped;

  -- 5b. Inspect any existing unique constraints or standalone indexes
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
    RAISE NOTICE 'STEP 5b: Existing UNIQUE constraint "trial_bookings_reference_code_key" validated — preserved';
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
        '(different name) — noted', v_other_conname;
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
        RAISE NOTICE
          'STEP 5b: Standalone unique index "%" already covers trial_bookings.reference_code '
          '— constraint enforcement deferred to Step 11c (after backfill)',
          v_existing_idx;
      ELSE
        RAISE NOTICE
          'STEP 5b: trial_bookings.reference_code has no unique constraint or index yet '
          '— creation deferred to Step 11c (after backfill)';
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
-- STEP 9b — INSPECT AND TEMPORARILY DROP EXISTING REFERENCE CODE TRIGGERS (IF ANY)
--
-- CRITICAL SAFETY GUARD:
--   If triggers already exist (e.g. from an earlier migration attempt or rerun)
--   with a function definition that preserves OLD.reference_code on UPDATE,
--   running the backfill UPDATE in Steps 10 & 11 would cause the trigger to
--   overwrite the newly assigned reference_code back to NULL (or ''), defeating
--   the backfill and causing ALTER TABLE ... SET NOT NULL to fail.
--
--   Before dropping either trigger, inspect pg_trigger / pg_proc and
--   pg_get_triggerdef() to verify that any existing trigger with that name:
--     • is attached to the expected table (public.admissions or public.trial_bookings)
--     • is a non-internal, non-constraint BEFORE INSERT OR UPDATE FOR EACH ROW trigger
--     • has no WHEN predicate, column list (UPDATE OF), arguments, or transition tables
--     • is bound to the expected function (public.trg_admissions_set_ref_code() or
--       public.trg_trial_bookings_set_ref_code())
--   If an existing trigger with the same name has an unexpected definition, table,
--   or function binding, RAISE EXCEPTION immediately instead of dropping it.
--
--   Dropping the validated triggers here allows Steps 10 and 11 to safely execute
--   pure backfill updates. The hardened, permanent triggers are attached in Step 13.
--   Because the tables are locked in SHARE ROW EXCLUSIVE MODE, no concurrent
--   inserts or updates can occur in the interim.
-- ===========================================================================
DO $$
DECLARE
  v_trig_name          TEXT;
  v_table_name         TEXT;
  v_func_name          TEXT;
  v_found_relname      TEXT;
  v_found_func_ns      TEXT;
  v_found_func_name    TEXT;
  v_found_pronargs     INT2;
  v_is_internal        BOOLEAN;
  v_tgconstraint       OID;
  v_tgtype             INT2;
  v_tgnargs            INT2;
  v_tgattr_empty       BOOLEAN;
  v_has_qual           BOOLEAN;
  v_has_trans_tbl      BOOLEAN;
  v_trigdef            TEXT;
  v_expected_defs      TEXT[];
  v_match_count        INT;
BEGIN
  FOR v_trig_name, v_table_name, v_func_name IN
    SELECT t.trig_name, t.table_name, t.func_name
    FROM (VALUES
      ('set_admissions_ref_code'::TEXT,     'admissions'::TEXT,     'trg_admissions_set_ref_code'::TEXT),
      ('set_trial_bookings_ref_code'::TEXT, 'trial_bookings'::TEXT, 'trg_trial_bookings_set_ref_code'::TEXT)
    ) AS t(trig_name, table_name, func_name)
  LOOP
    v_match_count := 0;
    v_expected_defs := ARRAY[
      pg_catalog.format(
        'CREATE TRIGGER %I BEFORE INSERT OR UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.%I()',
        v_trig_name, v_table_name, v_func_name
      ),
      pg_catalog.format(
        'CREATE TRIGGER %I BEFORE INSERT OR UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION %I()',
        v_trig_name, v_table_name, v_func_name
      ),
      pg_catalog.format(
        'CREATE TRIGGER %I BEFORE INSERT OR UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION %I()',
        v_trig_name, v_table_name, v_func_name
      ),
      pg_catalog.format(
        'CREATE TRIGGER %I BEFORE INSERT OR UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION public.%I()',
        v_trig_name, v_table_name, v_func_name
      )
    ];

    FOR v_found_relname, v_found_func_ns, v_found_func_name, v_found_pronargs,
        v_is_internal, v_tgconstraint, v_tgtype, v_tgnargs, v_tgattr_empty,
        v_has_qual, v_has_trans_tbl, v_trigdef IN
      SELECT c.relname,
             pn.nspname,
             p.proname,
             p.pronargs,
             t.tgisinternal,
             t.tgconstraint,
             t.tgtype,
             t.tgnargs,
             (t.tgattr = ''::pg_catalog.int2vector),
             (t.tgqual IS NOT NULL),
             (t.tgoldtable IS NOT NULL OR t.tgnewtable IS NOT NULL),
             pg_catalog.pg_get_triggerdef(t.oid)
      FROM   pg_catalog.pg_trigger t
      JOIN   pg_catalog.pg_class c       ON c.oid  = t.tgrelid
      JOIN   pg_catalog.pg_namespace cn  ON cn.oid = c.relnamespace
      LEFT JOIN pg_catalog.pg_proc p     ON p.oid  = t.tgfoid
      LEFT JOIN pg_catalog.pg_namespace pn ON pn.oid = p.pronamespace
      WHERE  cn.nspname = 'public'
        AND  t.tgname   = v_trig_name
      ORDER BY c.relname
    LOOP
      v_match_count := v_match_count + 1;

      IF v_found_relname <> v_table_name THEN
        RAISE EXCEPTION
          'STEP 9b: Existing trigger "%" is attached to unexpected table public.% '
          '(expected public.%; definition: [%]). Refusing to drop; inspect and resolve manually.',
          v_trig_name, v_found_relname, v_table_name, v_trigdef;
      END IF;

      IF v_is_internal
         OR v_tgconstraint <> 0
         OR v_tgtype <> 23
         OR v_tgnargs <> 0
         OR NOT v_tgattr_empty
         OR v_has_qual
         OR v_has_trans_tbl
         OR v_found_func_ns IS DISTINCT FROM 'public'
         OR v_found_func_name IS DISTINCT FROM v_func_name
         OR v_found_pronargs IS DISTINCT FROM 0::INT2
         OR NOT (v_trigdef = ANY(v_expected_defs))
      THEN
        RAISE EXCEPTION
          'STEP 9b: Existing trigger "%" on public.% has an unexpected definition or function binding '
          '(bound to %.%(), definition: [%]). Expected BEFORE INSERT OR UPDATE FOR EACH ROW '
          'executing public.%(). Refusing to drop; inspect and resolve manually before re-running.',
          v_trig_name,
          v_table_name,
          COALESCE(v_found_func_ns, '<unknown>'),
          COALESCE(v_found_func_name, '<unknown>'),
          v_trigdef,
          v_func_name;
      END IF;
    END LOOP;

    IF v_match_count > 0 THEN
      EXECUTE pg_catalog.format(
        'DROP TRIGGER %I ON public.%I',
        v_trig_name, v_table_name
      );
      RAISE NOTICE
        'STEP 9b: Verified and dropped existing trigger % on public.% (bound to public.%()) prior to backfill',
        v_trig_name, v_table_name, v_func_name;
    ELSE
      RAISE NOTICE
        'STEP 9b: Trigger % on public.% does not exist — nothing to drop',
        v_trig_name, v_table_name;
    END IF;
  END LOOP;
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
-- STEP 11b — ENFORCE UNIQUE CONSTRAINT ON admissions.reference_code
--
-- Executed strictly AFTER:
--   • Step 9b dropped any conflicting legacy triggers.
--   • Step 10 backfilled all NULL, empty, and whitespace-only legacy codes.
--   • Step 10 enforced NOT NULL on admissions.reference_code.
--
-- Safety Guarantees:
--   1. Pre-constraint Duplicate Audit:
--      Verifies that ZERO duplicate non-NULL reference_code values exist.
--      If duplicates are detected, halts immediately with an exception listing them.
--   2. Redundancy Prevention & Index Reuse:
--      • Preserves existing admissions_reference_code_key if already present.
--      • Skips creation if an equivalent UNIQUE constraint exists under another name.
--      • Attaches existing standalone unique index if named admissions_reference_code_key
--        via USING INDEX, avoiding duplicate index builds.
--      • Skips creation if another valid standalone unique index already covers the column.
--      • Otherwise, creates the named UNIQUE constraint cleanly.
-- ===========================================================================
DO $$
DECLARE
  v_attnum          INT2;
  v_contype         CHAR(1);
  v_conkey          INT2[];
  v_other_conname   TEXT;
  v_existing_idx    TEXT;
  v_dup_summary     TEXT;
  v_dup_count       BIGINT;
BEGIN
  -- Resolve attnum for admissions.reference_code
  SELECT a.attnum INTO v_attnum
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname = 'admissions'
    AND  a.attname = 'reference_code'
    AND  a.attnum  > 0 AND NOT a.attisdropped;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'STEP 11b: admissions.reference_code column not found.';
  END IF;

  -- 11b-1. Pre-constraint duplicate check on non-NULL reference_code values
  SELECT pg_catalog.string_agg(
           pg_catalog.format('%s (count: %s)', reference_code, cnt),
           ', '
         ),
         pg_catalog.count(*)
  INTO   v_dup_summary, v_dup_count
  FROM (
    SELECT reference_code, pg_catalog.count(*) AS cnt
    FROM   public.admissions
    WHERE  reference_code IS NOT NULL
    GROUP  BY reference_code
    HAVING pg_catalog.count(*) > 1
    ORDER  BY reference_code
    LIMIT  10
  ) d;

  IF v_dup_count > 0 THEN
    RAISE EXCEPTION
      'STEP 11b: Cannot enforce UNIQUE constraint on admissions.reference_code: '
      'duplicate reference code(s) detected: [%]. Resolve duplicates before re-running.',
      v_dup_summary;
  END IF;

  RAISE NOTICE 'STEP 11b: Pre-constraint duplicate check passed: 0 duplicate admissions.reference_code values found';

  -- 11b-2. Check for named constraint admissions_reference_code_key
  SELECT contype, conkey
  INTO   v_contype, v_conkey
  FROM   pg_catalog.pg_constraint
  WHERE  conrelid = 'public.admissions'::pg_catalog.regclass
    AND  conname  = 'admissions_reference_code_key';

  IF FOUND THEN
    IF v_contype <> 'u' THEN
      RAISE EXCEPTION
        'STEP 11b: "admissions_reference_code_key" exists but has type "%" (expected "u"). '
        'Inspect manually.', v_contype;
    END IF;
    IF v_conkey <> ARRAY[v_attnum]::INT2[] THEN
      RAISE EXCEPTION
        'STEP 11b: "admissions_reference_code_key" exists but covers different column(s). '
        'Inspect manually.';
    END IF;
    RAISE NOTICE 'STEP 11b: UNIQUE constraint admissions_reference_code_key already exists and is correct — preserved';
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
        'STEP 11b: An equivalent UNIQUE constraint "%" on admissions.reference_code already exists '
        '(different name) — skipped creating duplicate constraint', v_other_conname;
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
          RAISE NOTICE 'STEP 11b: Attached existing standalone unique index "admissions_reference_code_key" as UNIQUE constraint';
        ELSE
          RAISE NOTICE
            'STEP 11b: An equivalent standalone unique index "%" already covers admissions.reference_code — skipped creating redundant unique index',
            v_existing_idx;
        END IF;
      ELSE
        ALTER TABLE public.admissions
          ADD CONSTRAINT admissions_reference_code_key UNIQUE (reference_code);
        RAISE NOTICE 'STEP 11b: Added UNIQUE admissions_reference_code_key constraint';
      END IF;
    END IF;
  END IF;
END;
$$;


-- ===========================================================================
-- STEP 11c — ENFORCE UNIQUE CONSTRAINT ON trial_bookings.reference_code
--
-- Executed strictly AFTER:
--   • Step 9b dropped any conflicting legacy triggers.
--   • Step 11 backfilled all NULL, empty, and whitespace-only legacy codes.
--   • Step 11 enforced NOT NULL on trial_bookings.reference_code.
--
-- Safety Guarantees:
--   1. Pre-constraint Duplicate Audit:
--      Verifies that ZERO duplicate non-NULL reference_code values exist.
--      If duplicates are detected, halts immediately with an exception listing them.
--   2. Redundancy Prevention & Index Reuse:
--      • Preserves existing trial_bookings_reference_code_key if already present.
--      • Skips creation if an equivalent UNIQUE constraint exists under another name.
--      • Attaches existing standalone unique index if named trial_bookings_reference_code_key
--        via USING INDEX, avoiding duplicate index builds.
--      • Skips creation if another valid standalone unique index already covers the column.
--      • Otherwise, creates the named UNIQUE constraint cleanly.
-- ===========================================================================
DO $$
DECLARE
  v_attnum          INT2;
  v_contype         CHAR(1);
  v_conkey          INT2[];
  v_other_conname   TEXT;
  v_existing_idx    TEXT;
  v_dup_summary     TEXT;
  v_dup_count       BIGINT;
BEGIN
  -- Resolve attnum for trial_bookings.reference_code
  SELECT a.attnum INTO v_attnum
  FROM   pg_catalog.pg_attribute a
  JOIN   pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE  c.relnamespace = 'public'::pg_catalog.regnamespace
    AND  c.relname = 'trial_bookings'
    AND  a.attname = 'reference_code'
    AND  a.attnum  > 0 AND NOT a.attisdropped;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'STEP 11c: trial_bookings.reference_code column not found.';
  END IF;

  -- 11c-1. Pre-constraint duplicate check on non-NULL reference_code values
  SELECT pg_catalog.string_agg(
           pg_catalog.format('%s (count: %s)', reference_code, cnt),
           ', '
         ),
         pg_catalog.count(*)
  INTO   v_dup_summary, v_dup_count
  FROM (
    SELECT reference_code, pg_catalog.count(*) AS cnt
    FROM   public.trial_bookings
    WHERE  reference_code IS NOT NULL
    GROUP  BY reference_code
    HAVING pg_catalog.count(*) > 1
    ORDER  BY reference_code
    LIMIT  10
  ) d;

  IF v_dup_count > 0 THEN
    RAISE EXCEPTION
      'STEP 11c: Cannot enforce UNIQUE constraint on trial_bookings.reference_code: '
      'duplicate reference code(s) detected: [%]. Resolve duplicates before re-running.',
      v_dup_summary;
  END IF;

  RAISE NOTICE 'STEP 11c: Pre-constraint duplicate check passed: 0 duplicate trial_bookings.reference_code values found';

  -- 11c-2. Check for named constraint trial_bookings_reference_code_key
  SELECT contype, conkey
  INTO   v_contype, v_conkey
  FROM   pg_catalog.pg_constraint
  WHERE  conrelid = 'public.trial_bookings'::pg_catalog.regclass
    AND  conname  = 'trial_bookings_reference_code_key';

  IF FOUND THEN
    IF v_contype <> 'u' THEN
      RAISE EXCEPTION
        'STEP 11c: "trial_bookings_reference_code_key" exists but has type "%" (expected "u"). '
        'Inspect manually.', v_contype;
    END IF;
    IF v_conkey <> ARRAY[v_attnum]::INT2[] THEN
      RAISE EXCEPTION
        'STEP 11c: "trial_bookings_reference_code_key" exists but covers different column(s). '
        'Inspect manually.';
    END IF;
    RAISE NOTICE 'STEP 11c: UNIQUE constraint trial_bookings_reference_code_key already exists and is correct — preserved';
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
        'STEP 11c: An equivalent UNIQUE constraint "%" on trial_bookings.reference_code already exists '
        '(different name) — skipped creating duplicate constraint', v_other_conname;
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
          RAISE NOTICE 'STEP 11c: Attached existing standalone unique index "trial_bookings_reference_code_key" as UNIQUE constraint';
        ELSE
          RAISE NOTICE
            'STEP 11c: An equivalent standalone unique index "%" already covers trial_bookings.reference_code — skipped creating redundant unique index',
            v_existing_idx;
        END IF;
      ELSE
        ALTER TABLE public.trial_bookings
          ADD CONSTRAINT trial_bookings_reference_code_key UNIQUE (reference_code);
        RAISE NOTICE 'STEP 11c: Added UNIQUE trial_bookings_reference_code_key constraint';
      END IF;
    END IF;
  END IF;
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
--   3. Year extraction — consistent with backfill:
--      • Derives two-digit year from COALESCE(NEW.created_at, pg_catalog.now())
--        AT TIME ZONE 'UTC'. Uses NEW.created_at when already set (matches backfill),
--        falls back to current timestamp only when NULL.
--   4. Overflow-safe formatting:
--      • LPAD(val, GREATEST(5, LENGTH(val)), '0') guarantees minimum 5 digits
--        without truncating values > 99999.
--   5. Execution & Path hardening:
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
        || pg_catalog.to_char(
             COALESCE(NEW.created_at, pg_catalog.now()) AT TIME ZONE 'UTC',
             'YY'
           )
        || '-'
        || pg_catalog.lpad(
             v_seq_val,
             GREATEST(5, pg_catalog.length(v_seq_val)),
             '0'
           );
    END IF;
    RETURN NEW;
  END IF;

  -- On INSERT: always overwrite with trusted server-generated sequence code.
  -- Year is derived from NEW.created_at when already set by the application,
  -- falling back to pg_catalog.now() when NEW.created_at is NULL.
  v_seq_val := pg_catalog.nextval('public.admissions_ref_seq'::pg_catalog.regclass)::pg_catalog.text;
  NEW.reference_code :=
    'ADM-'
    || pg_catalog.to_char(
         COALESCE(NEW.created_at, pg_catalog.now()) AT TIME ZONE 'UTC',
         'YY'
       )
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
        || pg_catalog.to_char(
             COALESCE(NEW.created_at, pg_catalog.now()) AT TIME ZONE 'UTC',
             'YY'
           )
        || '-'
        || pg_catalog.lpad(
             v_seq_val,
             GREATEST(5, pg_catalog.length(v_seq_val)),
             '0'
           );
    END IF;
    RETURN NEW;
  END IF;

  -- On INSERT: always overwrite with trusted server-generated sequence code.
  -- Year is derived from NEW.created_at when already set by the application,
  -- falling back to pg_catalog.now() when NEW.created_at is NULL.
  v_seq_val := pg_catalog.nextval('public.trial_bookings_ref_seq'::pg_catalog.regclass)::pg_catalog.text;
  NEW.reference_code :=
    'TRL-'
    || pg_catalog.to_char(
         COALESCE(NEW.created_at, pg_catalog.now()) AT TIME ZONE 'UTC',
         'YY'
       )
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
-- For each function, locate the exact zero-argument trigger function in
-- pg_proc (pronargs = 0, prorettype = pg_catalog.trigger) and verify that
-- exactly one matching function exists.
--
-- If the function owner is NOT a superuser, we verify they hold effective
-- USAGE or UPDATE privilege (either of which PostgreSQL nextval() permits)
-- on the specific sequence that the function actually uses:
--   • public.trg_admissions_set_ref_code()     → public.admissions_ref_seq
--   • public.trg_trial_bookings_set_ref_code() → public.trial_bookings_ref_seq
-- If neither privilege exists, we RAISE EXCEPTION — halting the migration
-- immediately so privileges can be granted.
-- ===========================================================================
DO $$
DECLARE
  v_func_name    TEXT;
  v_seq_name     TEXT;
  v_match_count  BIGINT;
  v_owner_oid    OID;
  v_owner        NAME;
  v_is_super     BOOLEAN;
  v_has_usage    BOOLEAN;
  v_has_update   BOOLEAN;
  v_priv_summary TEXT;
BEGIN
  FOR v_func_name, v_seq_name IN
    SELECT t.func_name, t.seq_name
    FROM (VALUES
      ('trg_admissions_set_ref_code'::TEXT,     'public.admissions_ref_seq'::TEXT),
      ('trg_trial_bookings_set_ref_code'::TEXT, 'public.trial_bookings_ref_seq'::TEXT)
    ) AS t(func_name, seq_name)
  LOOP
    -- Verify exact zero-argument trigger function exists uniquely in pg_proc
    SELECT pg_catalog.count(*)
    INTO   v_match_count
    FROM   pg_catalog.pg_proc p
    WHERE  p.pronamespace = 'public'::pg_catalog.regnamespace
      AND  p.proname      = v_func_name
      AND  p.pronargs     = 0
      AND  p.prorettype   = 'pg_catalog.trigger'::pg_catalog.regtype;

    IF v_match_count = 0 THEN
      RAISE EXCEPTION
        'STEP 14: Cannot find zero-argument trigger function public.%() returning trigger. '
        'Ensure Step 12 succeeded.',
        v_func_name;
    ELSIF v_match_count > 1 THEN
      RAISE EXCEPTION
        'STEP 14: Expected exactly 1 zero-argument trigger function public.%() returning trigger, '
        'but found % matching definitions in pg_proc. Inspect manually.',
        v_func_name, v_match_count;
    END IF;

    -- Determine function owner for the verified exact trigger function
    SELECT p.proowner, r.rolname, r.rolsuper
    INTO   STRICT v_owner_oid, v_owner, v_is_super
    FROM   pg_catalog.pg_proc p
    JOIN   pg_catalog.pg_roles r ON r.oid = p.proowner
    WHERE  p.pronamespace = 'public'::pg_catalog.regnamespace
      AND  p.proname      = v_func_name
      AND  p.pronargs     = 0
      AND  p.prorettype   = 'pg_catalog.trigger'::pg_catalog.regtype;

    IF v_is_super THEN
      RAISE NOTICE
        'STEP 14: Function public.%() owned by "%" (superuser) — access to % guaranteed',
        v_func_name, v_owner, v_seq_name;
    ELSE
      -- Non-superuser: PostgreSQL nextval() permits either effective USAGE or UPDATE
      -- on the specific sequence used by this function.
      v_has_usage := COALESCE(
        pg_catalog.has_sequence_privilege(
          v_owner_oid,
          v_seq_name::pg_catalog.regclass,
          'USAGE'
        ),
        FALSE
      );
      v_has_update := COALESCE(
        pg_catalog.has_sequence_privilege(
          v_owner_oid,
          v_seq_name::pg_catalog.regclass,
          'UPDATE'
        ),
        FALSE
      );

      IF v_has_usage OR v_has_update THEN
        v_priv_summary := CASE
          WHEN v_has_usage AND v_has_update THEN 'USAGE, UPDATE'
          WHEN v_has_usage THEN 'USAGE'
          ELSE 'UPDATE'
        END;
        RAISE NOTICE
          'STEP 14: Function public.%() owned by non-superuser "%" '
          'and has % privilege on % — OK',
          v_func_name, v_owner, v_priv_summary, v_seq_name;
      ELSE
        RAISE EXCEPTION
          'STEP 14: Function public.%() is owned by non-superuser role "%" '
          'which holds neither USAGE nor UPDATE privilege on % '
          '(nextval() requires USAGE or UPDATE). '
          'Execute the following before re-running this migration: '
          'GRANT USAGE ON SEQUENCE % TO %;',
          v_func_name, v_owner, v_seq_name, v_seq_name, pg_catalog.quote_ident(v_owner::TEXT);
      END IF;
    END IF;

  END LOOP;
END;
$$;


COMMIT;

-- =============================================================================
-- END OF MIGRATION SCRIPT — v15 FINAL REVIEW CANDIDATE
-- =============================================================================
