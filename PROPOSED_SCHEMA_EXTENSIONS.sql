-- =============================================================================
-- SK TAPE BALL ACADEMY — PROPOSED SUPABASE SCHEMA EXTENSIONS (UNEXECUTED)
-- =============================================================================
-- IMPORTANT:
--   1. This SQL file has NOT been executed against any database.
--   2. Review against your live Supabase project and existing Task 4 v15 schema
--      (TASK4_v15_DATABASE_DIAGNOSTICS.sql / task4_migration_v15_reviewed_candidate.sql)
--      before running in Supabase SQL Editor.
--   3. Preserves Task 4 v15 verified conventions:
--      - profiles.role IN ('admin', 'coach', 'student', 'parent')
--      - admissions.status IN ('pending', 'under_review', 'accepted', 'rejected', 'waitlisted')
--      - trial_bookings.status IN ('requested', 'confirmed', 'completed', 'cancelled')
--      - admissions.reference_code / trial_bookings.reference_code trigger generation
--      - students.guardian_profile_id UUID NULLABLE REFERENCES public.profiles(id) ON DELETE SET NULL
-- =============================================================================

-- Helper: Verify active authenticated user is an academy admin
CREATE OR REPLACE FUNCTION public.is_academy_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_academy_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_academy_admin() TO authenticated;

-- -----------------------------------------------------------------------------
-- 1. Extend verified core tables (students, admissions, trial_bookings)
--    with operational fields required by the public forms & admin portal.
-- -----------------------------------------------------------------------------
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS student_code TEXT,
  ADD COLUMN IF NOT EXISTS age_group TEXT DEFAULT 'Youth Division',
  ADD COLUMN IF NOT EXISTS contact TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS guardian_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS program TEXT DEFAULT 'Tape Ball Batting',
  ADD COLUMN IF NOT EXISTS batch_id TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS batch_name TEXT DEFAULT 'Unassigned',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
  ADD COLUMN IF NOT EXISTS attendance_rate INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

ALTER TABLE public.admissions
  ADD COLUMN IF NOT EXISTS applicant_name TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS is_minor BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS city_area TEXT,
  ADD COLUMN IF NOT EXISTS student_phone TEXT,
  ADD COLUMN IF NOT EXISTS student_email TEXT,
  ADD COLUMN IF NOT EXISTS guardian_name TEXT,
  ADD COLUMN IF NOT EXISTS relationship TEXT,
  ADD COLUMN IF NOT EXISTS guardian_phone TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS guardian_email TEXT,
  ADD COLUMN IF NOT EXISTS requested_program TEXT,
  ADD COLUMN IF NOT EXISTS experience_level TEXT,
  ADD COLUMN IF NOT EXISTS preferred_batch TEXT,
  ADD COLUMN IF NOT EXISTS additional_message TEXT,
  ADD COLUMN IF NOT EXISTS guardian_consent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS privacy_consent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS photography_consent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reviewer_notes TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS converted_to_student BOOLEAN DEFAULT FALSE;

ALTER TABLE public.trial_bookings
  ADD COLUMN IF NOT EXISTS player_name TEXT,
  ADD COLUMN IF NOT EXISTS dob_or_age TEXT,
  ADD COLUMN IF NOT EXISTS guardian_name TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS requested_program TEXT,
  ADD COLUMN IF NOT EXISTS preferred_date DATE,
  ADD COLUMN IF NOT EXISTS preferred_time_slot TEXT,
  ADD COLUMN IF NOT EXISTS previous_experience TEXT,
  ADD COLUMN IF NOT EXISTS additional_message TEXT,
  ADD COLUMN IF NOT EXISTS staff_note TEXT DEFAULT '';

-- -----------------------------------------------------------------------------
-- 2. RLS Policies for verified core tables
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_bookings ENABLE ROW LEVEL SECURITY;

-- Profiles: users read own profile; admins read/manage all
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_select_self_or_admin') THEN
    CREATE POLICY profiles_select_self_or_admin ON public.profiles
      FOR SELECT TO authenticated
      USING (id = auth.uid() OR public.is_academy_admin());
  END IF;
END $$;

-- Students: admins full access; guardians read linked students
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='students' AND policyname='students_admin_all') THEN
    CREATE POLICY students_admin_all ON public.students
      FOR ALL TO authenticated
      USING (public.is_academy_admin())
      WITH CHECK (public.is_academy_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='students' AND policyname='students_guardian_select') THEN
    CREATE POLICY students_guardian_select ON public.students
      FOR SELECT TO authenticated
      USING (guardian_profile_id = auth.uid());
  END IF;
END $$;

-- Admissions: public anon/authenticated can submit; ONLY admin can read/update/delete rows directly
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admissions' AND policyname='admissions_public_insert') THEN
    CREATE POLICY admissions_public_insert ON public.admissions
      FOR INSERT TO anon, authenticated
      WITH CHECK (status = 'pending');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admissions' AND policyname='admissions_admin_all') THEN
    CREATE POLICY admissions_admin_all ON public.admissions
      FOR ALL TO authenticated
      USING (public.is_academy_admin())
      WITH CHECK (public.is_academy_admin());
  END IF;
END $$;

-- Trial Bookings: public anon/authenticated can submit; ONLY admin can read/update/delete rows
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trial_bookings' AND policyname='trial_bookings_public_insert') THEN
    CREATE POLICY trial_bookings_public_insert ON public.trial_bookings
      FOR INSERT TO anon, authenticated
      WITH CHECK (status = 'requested');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='trial_bookings' AND policyname='trial_bookings_admin_all') THEN
    CREATE POLICY trial_bookings_admin_all ON public.trial_bookings
      FOR ALL TO authenticated
      USING (public.is_academy_admin())
      WITH CHECK (public.is_academy_admin());
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 3. Privacy-Safe RPCs for Public Application Submission & Status Lookup
--    Allows returning DB-generated reference_code without exposing PII tables
--    via open SELECT policies to anonymous visitors.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.lookup_application_status(
  p_reference_code TEXT,
  p_contact_digits TEXT DEFAULT NULL
)
RETURNS TABLE (
  reference_code TEXT,
  applicant_name TEXT,
  requested_program TEXT,
  status TEXT,
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_clean_ref TEXT := pg_catalog.upper(pg_catalog.btrim(COALESCE(p_reference_code, '')));
  v_clean_digits TEXT := pg_catalog.regexp_replace(COALESCE(p_contact_digits, ''), '\D', '', 'g');
BEGIN
  IF v_clean_ref = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    a.reference_code,
    a.applicant_name,
    a.requested_program,
    a.status,
    a.reviewer_notes,
    a.created_at
  FROM public.admissions a
  WHERE pg_catalog.upper(a.reference_code) = v_clean_ref
    AND (
      v_clean_digits = ''
      OR pg_catalog.right(pg_catalog.regexp_replace(COALESCE(a.whatsapp_number, a.guardian_phone, ''), '\D', '', 'g'), 7)
         = pg_catalog.right(v_clean_digits, 7)
    )
  LIMIT 1;
END;
$$;

REVOKE ALL ON FUNCTION public.lookup_application_status(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_application_status(TEXT, TEXT) TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 4. Proposed Operational & CMS Tables (not yet present in Task 4 v15 baseline)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  assigned_programs TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Active',
  experience_label TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  image_url TEXT,
  image_transform JSONB DEFAULT '{"fit":"cover","posX":50,"posY":50,"scale":1}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  image_transform JSONB DEFAULT '{"fit":"cover","posX":50,"posY":50,"scale":1}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  program_title TEXT NOT NULL,
  coach_id UUID REFERENCES public.coaches(id) ON DELETE SET NULL,
  coach_name TEXT DEFAULT 'To Be Assigned',
  capacity INTEGER NOT NULL DEFAULT 15,
  assigned_student_ids UUID[] NOT NULL DEFAULT '{}',
  timing_label TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week TEXT NOT NULL,
  time_label TEXT NOT NULL,
  batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
  batch_name TEXT DEFAULT 'General Training Group',
  coach_name TEXT DEFAULT 'To Be Assigned',
  program_title TEXT DEFAULT '',
  ground_zone TEXT DEFAULT 'Main Practice Nets',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  match_type TEXT NOT NULL,
  academy_team TEXT NOT NULL,
  opponent_team TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location_label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  academy_score TEXT DEFAULT '',
  opponent_score TEXT DEFAULT '',
  result_summary TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  player_name TEXT NOT NULL,
  category TEXT NOT NULL,
  achievement_date TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT,
  image_transform JSONB DEFAULT '{"fit":"cover","posX":50,"posY":50,"scale":1}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type TEXT NOT NULL DEFAULT 'image',
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  caption TEXT DEFAULT '',
  asset_url TEXT NOT NULL,
  image_transform JSONB DEFAULT '{"fit":"cover","posX":50,"posY":50,"scale":1}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  content TEXT NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'Pending Review',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  featured_image TEXT DEFAULT '',
  image_transform JSONB DEFAULT '{"fit":"cover","posX":50,"posY":50,"scale":1}'::jsonb,
  body_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fee_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  program_scope TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  amount_label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fee_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_code TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  program TEXT NOT NULL,
  package_name TEXT NOT NULL,
  amount_label TEXT NOT NULL,
  due_date_label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  last_payment_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_code TEXT NOT NULL,
  student_name TEXT NOT NULL,
  amount_label TEXT NOT NULL,
  method_label TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.website_sections (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  body_notes TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS across all CMS/operational tables
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;

-- Public read access for published public content; Admin write/read access for all
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'coaches','programs','batches','schedules','matches','achievements',
    'gallery_items','testimonials','blog_posts','fee_packages','fee_records',
    'payments','site_settings','website_sections'
  ]
  LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname=t||'_admin_all') THEN
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_academy_admin()) WITH CHECK (public.is_academy_admin())',
        t || '_admin_all', t
      );
    END IF;
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- 5. Storage Bucket Setup for ImageManager (academy-media)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('academy-media', 'academy-media', TRUE)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='academy_media_public_read') THEN
    CREATE POLICY academy_media_public_read ON storage.objects
      FOR SELECT TO anon, authenticated
      USING (bucket_id = 'academy-media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='academy_media_admin_write') THEN
    CREATE POLICY academy_media_admin_write ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'academy-media' AND public.is_academy_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='academy_media_admin_update') THEN
    CREATE POLICY academy_media_admin_update ON storage.objects
      FOR UPDATE TO authenticated
      USING (bucket_id = 'academy-media' AND public.is_academy_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='academy_media_admin_delete') THEN
    CREATE POLICY academy_media_admin_delete ON storage.objects
      FOR DELETE TO authenticated
      USING (bucket_id = 'academy-media' AND public.is_academy_admin());
  END IF;
END $$;
