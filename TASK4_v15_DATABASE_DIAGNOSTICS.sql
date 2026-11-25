-- SK Tape Ball Academy — read-only Task 4 preflight diagnostics
-- All statements are SELECT only. Run only against the intended Supabase project.
-- These queries can read/group table rows and consume database I/O; run at low traffic.
-- Stop if expected tables/columns are missing. Do not paste keys or credentials with results.

-- 1) Server version and required relation presence.
SELECT current_setting('server_version') AS server_version,
       to_regclass('public.profiles') AS profiles_table,
       to_regclass('public.students') AS students_table,
       to_regclass('public.admissions') AS admissions_table,
       to_regclass('public.trial_bookings') AS trial_bookings_table;

-- 2) Relevant column types, nullability, and defaults.
SELECT n.nspname AS schema_name,
       c.relname AS table_name,
       a.attname AS column_name,
       pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
       a.attnotnull AS is_not_null,
       pg_catalog.pg_get_expr(d.adbin, d.adrelid) AS column_default
FROM pg_catalog.pg_attribute a
JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE n.nspname = 'public'
  AND c.relname IN ('profiles', 'students', 'admissions', 'trial_bookings')
  AND a.attname IN ('id', 'role', 'full_name', 'guardian_profile_id', 'status', 'created_at', 'reference_code')
  AND a.attnum > 0
  AND NOT a.attisdropped
ORDER BY c.relname, a.attnum;

-- 3) Distinct role/status values and counts. This does not return names or contact details.
SELECT 'profiles.role' AS field_name, COALESCE(role::text, '<NULL>') AS value, count(*) AS row_count
FROM public.profiles
GROUP BY role::text
UNION ALL
SELECT 'admissions.status', COALESCE(status::text, '<NULL>'), count(*)
FROM public.admissions
GROUP BY status::text
UNION ALL
SELECT 'trial_bookings.status', COALESCE(status::text, '<NULL>'), count(*)
FROM public.trial_bookings
GROUP BY status::text
ORDER BY field_name, value;

-- 4) NULL timestamp and missing reference-code counts.
SELECT 'admissions' AS table_name,
       count(*) FILTER (WHERE created_at IS NULL) AS null_created_at,
       count(*) FILTER (WHERE reference_code IS NULL OR pg_catalog.btrim(reference_code::text) = '') AS missing_reference_code
FROM public.admissions
UNION ALL
SELECT 'trial_bookings',
       count(*) FILTER (WHERE created_at IS NULL),
       count(*) FILTER (WHERE reference_code IS NULL OR pg_catalog.btrim(reference_code::text) = '')
FROM public.trial_bookings;

-- 5) Duplicate non-NULL reference codes (up to 20 per table).
SELECT table_name, reference_code, row_count
FROM (
  (SELECT 'admissions'::text AS table_name, reference_code::text, count(*) AS row_count
   FROM public.admissions
   WHERE reference_code IS NOT NULL
   GROUP BY reference_code
   HAVING count(*) > 1
   ORDER BY reference_code
   LIMIT 20)
  UNION ALL
  (SELECT 'trial_bookings'::text AS table_name, reference_code::text, count(*) AS row_count
   FROM public.trial_bookings
   WHERE reference_code IS NOT NULL
   GROUP BY reference_code
   HAVING count(*) > 1
   ORDER BY reference_code
   LIMIT 20)
) duplicates
ORDER BY table_name, reference_code;

-- 6) Relevant FK, CHECK, and UNIQUE constraints with validation state.
SELECT c.relname AS table_name,
       con.conname AS constraint_name,
       con.contype AS constraint_type,
       con.convalidated AS is_validated,
       con.condeferrable AS is_deferrable,
       con.condeferred AS initially_deferred,
       pg_catalog.pg_get_constraintdef(con.oid, true) AS definition
FROM pg_catalog.pg_constraint con
JOIN pg_catalog.pg_class c ON c.oid = con.conrelid
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('students', 'profiles', 'admissions', 'trial_bookings')
  AND con.contype IN ('f', 'c', 'u')
ORDER BY c.relname, con.contype, con.conname;

-- 7) Index definitions on the two reference-code tables.
SELECT schemaname, tablename, indexname, indexdef
FROM pg_catalog.pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('admissions', 'trial_bookings')
ORDER BY tablename, indexname;

-- 8) Triggers and their bound function metadata, owner, and ACL.
SELECT c.relname AS table_name,
       t.tgname AS trigger_name,
       t.tgisinternal AS is_internal,
       pg_catalog.pg_get_triggerdef(t.oid, true) AS trigger_definition,
       pn.nspname AS function_schema,
       p.proname AS function_name,
       p.pronargs AS argument_count,
       p.prorettype::pg_catalog.regtype AS return_type,
       p.prosecdef AS security_definer,
       p.proconfig AS function_settings,
       owner.rolname AS function_owner,
       p.proacl AS function_acl
FROM pg_catalog.pg_trigger t
JOIN pg_catalog.pg_class c ON c.oid = t.tgrelid
JOIN pg_catalog.pg_namespace cn ON cn.oid = c.relnamespace
JOIN pg_catalog.pg_proc p ON p.oid = t.tgfoid
JOIN pg_catalog.pg_namespace pn ON pn.oid = p.pronamespace
JOIN pg_catalog.pg_roles owner ON owner.oid = p.proowner
WHERE cn.nspname = 'public'
  AND c.relname IN ('admissions', 'trial_bookings', 'students')
ORDER BY c.relname, t.tgname;

-- 9) The two Task 4 trigger functions, including ACL and any zero-argument overloads.
SELECT pn.nspname AS function_schema,
       p.proname AS function_name,
       p.pronargs AS argument_count,
       p.prorettype::pg_catalog.regtype AS return_type,
       p.prosecdef AS security_definer,
       p.proconfig AS function_settings,
       owner.rolname AS function_owner,
       p.proacl AS function_acl
FROM pg_catalog.pg_proc p
JOIN pg_catalog.pg_namespace pn ON pn.oid = p.pronamespace
JOIN pg_catalog.pg_roles owner ON owner.oid = p.proowner
WHERE pn.nspname = 'public'
  AND p.proname IN ('trg_admissions_set_ref_code', 'trg_trial_bookings_set_ref_code')
ORDER BY p.proname, p.pronargs;

-- 10) Sequence settings and visible state; last_value can be NULL without sequence privileges.
SELECT schemaname, sequencename, start_value, min_value, max_value,
       increment_by, cache_size, cycle, last_value
FROM pg_catalog.pg_sequences
WHERE schemaname = 'public'
  AND sequencename IN ('admissions_ref_seq', 'trial_bookings_ref_seq')
ORDER BY sequencename;

-- 11) RLS settings and policies. Policy expressions may contain application logic;
-- inspect them only in the intended database context.
SELECT n.nspname AS schema_name,
       c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS force_rls
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('profiles', 'students', 'admissions', 'trial_bookings')
ORDER BY c.relname;

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_catalog.pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'students', 'admissions', 'trial_bookings')
ORDER BY tablename, policyname;

-- 12) Estimated table sizes/row counts to help plan the lock window (statistics estimates).
SELECT c.relname AS table_name,
       c.reltuples::bigint AS estimated_rows,
       pg_catalog.pg_size_pretty(pg_catalog.pg_total_relation_size(c.oid)) AS total_size
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('profiles', 'students', 'admissions', 'trial_bookings')
ORDER BY c.relname;
