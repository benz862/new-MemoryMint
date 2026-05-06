# Sample memorial URLs (`/remember/sample-memorymint-*`)

These pages only work **after** the rows exist in **your Supabase project** (production included).

## Fix “Memorial not found” on production

1. Open **Supabase Dashboard** → your **production** project → **SQL Editor**.
2. Paste and run the full contents of:

   `supabase/migrations/20250510140000_sample_memorial_tiers.sql`

3. Confirm rows exist:

   ```sql
   select slug, status from public.memorials
   where slug like 'sample-memorymint-%';
   ```

   You should see three rows, each with `status = published`.

4. Reload:

   - `https://memorymint.app/remember/sample-memorymint-tribute`
   - `https://memorymint.app/remember/sample-memorymint-legacy`
   - `https://memorymint.app/remember/sample-memorymint-heritage`

The migration is safe to run more than once (`ON CONFLICT` guards).

## Why this happens

Deploying the Next.js app **does not** run SQL against Supabase. Migrations must be applied in the Supabase project your production env vars point at (`NEXT_PUBLIC_SUPABASE_URL`).
