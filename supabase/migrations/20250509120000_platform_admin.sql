-- Platform-wide admins (SkillBinder / operations). Checked via JWT email.
-- After applying: create auth user info@skillbinder.com in Supabase Dashboard (Authentication).

BEGIN;

CREATE TABLE public.platform_admins (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.platform_admins (email)
VALUES ('info@skillbinder.com')
ON CONFLICT (email) DO NOTHING;

ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.platform_admins pa
    WHERE lower(pa.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

REVOKE ALL ON public.platform_admins FROM PUBLIC;
GRANT ALL ON public.platform_admins TO service_role;

GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;

CREATE POLICY "memorials_all_platform_admin"
  ON public.memorials FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

CREATE POLICY "submissions_all_platform_admin"
  ON public.submissions FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

CREATE POLICY "memorial_admins_all_platform_admin"
  ON public.memorial_admins FOR ALL TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

CREATE POLICY "profiles_select_platform_admin"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.is_platform_admin());

GRANT INSERT, UPDATE, DELETE ON public.memorials TO authenticated;

GRANT DELETE ON public.submissions TO authenticated;

GRANT INSERT, UPDATE, DELETE ON public.memorial_admins TO authenticated;

COMMIT;
