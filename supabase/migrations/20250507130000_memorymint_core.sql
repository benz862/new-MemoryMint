-- MemoryMint core schema: memorials, guestbook submissions, admins, storage buckets.
-- Apply via Supabase SQL Editor or: supabase db push (linked project).

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE public.memorial_status AS ENUM ('draft', 'published', 'archived');

CREATE TYPE public.memorial_style AS ENUM (
  'classic_elegant',
  'warm_family',
  'celebration_of_life',
  'faith_prayer',
  'modern_minimal',
  'floral_remembrance',
  'veteran_tribute'
);

CREATE TYPE public.hosting_plan AS ENUM ('tribute', 'legacy', 'heritage');

CREATE TYPE public.submission_kind AS ENUM ('message', 'photo', 'video', 'voice');

CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected', 'family_only');

CREATE TYPE public.admin_role AS ENUM ('owner', 'admin');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.memorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  status public.memorial_status NOT NULL DEFAULT 'draft',
  full_name text NOT NULL,
  birth_date date NOT NULL,
  passing_date date NOT NULL,
  funeral_date date,
  funeral_location text,
  family_contact_email text NOT NULL,
  style public.memorial_style NOT NULL,
  main_photo_path text,
  obituary text NOT NULL,
  ai_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  hosting_plan public.hosting_plan NOT NULL,
  hosting_expires_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_checkout_session_id text UNIQUE,
  accepts_guest_submissions boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  CONSTRAINT memorials_slug_format CHECK (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

CREATE INDEX memorials_status_idx ON public.memorials (status);

CREATE INDEX memorials_created_by_idx ON public.memorials (created_by);

CREATE TABLE public.memorial_admins (
  memorial_id uuid NOT NULL REFERENCES public.memorials (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.admin_role NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (memorial_id, user_id)
);

CREATE INDEX memorial_admins_user_idx ON public.memorial_admins (user_id);

CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id uuid NOT NULL REFERENCES public.memorials (id) ON DELETE CASCADE,
  kind public.submission_kind NOT NULL,
  status public.submission_status NOT NULL DEFAULT 'pending',
  guest_display_name text,
  body text,
  storage_object_key text,
  storage_bucket text DEFAULT 'memorial-images',
  client_offline_id text UNIQUE,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  moderated_at timestamptz,
  moderated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX submissions_memorial_status_idx ON public.submissions (memorial_id, status);

CREATE INDEX submissions_created_idx ON public.submissions (memorial_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER memorials_set_updated_at
  BEFORE UPDATE ON public.memorials
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.memorial_add_owner_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO public.memorial_admins (memorial_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'owner')
    ON CONFLICT (memorial_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER memorial_after_insert_owner
  AFTER INSERT ON public.memorials
  FOR EACH ROW
  EXECUTE FUNCTION public.memorial_add_owner_admin();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.memorial_admins ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "memorials_select_published"
  ON public.memorials FOR SELECT
  USING (status = 'published');

CREATE POLICY "memorials_select_admin"
  ON public.memorials FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.memorial_admins ma
      WHERE ma.memorial_id = memorials.id
        AND ma.user_id = auth.uid()
    )
  );

CREATE POLICY "memorial_admins_select_own"
  ON public.memorial_admins FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "submissions_insert_guest"
  ON public.submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.memorials m
      WHERE m.id = memorial_id
        AND m.status = 'published'
        AND m.accepts_guest_submissions = true
    )
    AND kind = 'message'
    AND status = 'pending'
  );

CREATE POLICY "submissions_select_public_approved"
  ON public.submissions FOR SELECT
  USING (
    status = 'approved'
    AND EXISTS (
      SELECT 1
      FROM public.memorials m
      WHERE m.id = memorial_id
        AND m.status = 'published'
    )
  );

CREATE POLICY "submissions_select_admin"
  ON public.submissions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.memorial_admins ma
      WHERE ma.memorial_id = submissions.memorial_id
        AND ma.user_id = auth.uid()
    )
  );

CREATE POLICY "submissions_update_admin"
  ON public.submissions FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.memorial_admins ma
      WHERE ma.memorial_id = submissions.memorial_id
        AND ma.user_id = auth.uid()
    )
  );

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.memorials TO anon, authenticated;

GRANT SELECT ON public.submissions TO anon, authenticated;

GRANT INSERT ON public.submissions TO anon, authenticated;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT ON public.memorial_admins TO authenticated;

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('memorial-images', 'memorial-images', false),
  ('memorial-videos', 'memorial-videos', false),
  ('memorial-audio', 'memorial-audio', false),
  ('memorial-documents', 'memorial-documents', false),
  ('qr-assets', 'qr-assets', false)
ON CONFLICT (id) DO NOTHING;

COMMIT;
