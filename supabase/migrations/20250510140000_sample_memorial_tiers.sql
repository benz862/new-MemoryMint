-- Published sample memorials (one per hosting tier) for design / QA.
-- Safe to re-run: skips when slugs already exist. Unique client_offline_id for sample memories.

BEGIN;

INSERT INTO public.memorials (
  slug,
  status,
  full_name,
  birth_date,
  passing_date,
  funeral_date,
  funeral_location,
  family_contact_email,
  style,
  main_photo_path,
  obituary,
  hosting_plan,
  hosting_expires_at,
  stripe_checkout_session_id,
  accepts_guest_submissions,
  published_at
)
VALUES
  (
    'sample-memorymint-tribute',
    'published',
    'Sample Memorial — Tribute tier',
    '1940-03-15',
    '2025-11-20',
    '2025-12-01',
    'Sample Community Chapel',
    'info@skillbinder.com',
    'warm_family',
    NULL,
    'This is a demonstration memorial on the MemoryMint Tribute plan (30-day hosting, guestbook, photos, written memories, and moderation). Replace this text when you create a real memorial.' || E'\n\n' ||
    'Use this page to preview how families and guests experience MemoryMint before going live.',
    'tribute',
    (now() + interval '30 days'),
    'cs_seed_sample_mm_tribute_v1',
    true,
    now()
  ),
  (
    'sample-memorymint-legacy',
    'published',
    'Sample Memorial — Legacy tier',
    '1952-07-08',
    '2025-10-10',
    NULL,
    NULL,
    'info@skillbinder.com',
    'classic_elegant',
    NULL,
    'This sample reflects the MemoryMint Legacy plan: ongoing hosting, video and voice memories, enhanced themes, and multiple family admins. The stainless steel card is included in the real product.' || E'\n\n' ||
    'Guests still submit to moderation first—this is the same respectful flow as every tier.',
    'legacy',
    NULL,
    'cs_seed_sample_mm_legacy_v1',
    true,
    now()
  ),
  (
    'sample-memorymint-heritage',
    'published',
    'Sample Memorial — Heritage tier',
    '1938-01-22',
    '2025-09-05',
    NULL,
    NULL,
    'info@skillbinder.com',
    'modern_minimal',
    NULL,
    'This sample reflects the MemoryMint Heritage plan: ten-year hosting, archive download, AI writing assistance, premium themes, private family vault, and three MemoryMint cards in the live offering.' || E'\n\n' ||
    'Typography and spacing follow the Heritage presentation style.',
    'heritage',
    (now() + interval '10 years'),
    'cs_seed_sample_mm_heritage_v1',
    true,
    now()
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.submissions (
  memorial_id,
  kind,
  status,
  guest_display_name,
  body,
  client_offline_id
)
SELECT m.id, 'message', 'approved', 'Jordan Lee',
  'We will always remember the warmth of their laugh and the care they showed every neighbor.',
  'seed-sample-tribute-approved-1'
FROM public.memorials m
WHERE m.slug = 'sample-memorymint-tribute'
ON CONFLICT (client_offline_id) DO NOTHING;

INSERT INTO public.submissions (
  memorial_id,
  kind,
  status,
  guest_display_name,
  body,
  client_offline_id
)
SELECT m.id, 'message', 'approved', 'Sam Rivera',
  'Thank you for the stories you shared at holidays—our children will carry them forward.',
  'seed-sample-legacy-approved-1'
FROM public.memorials m
WHERE m.slug = 'sample-memorymint-legacy'
ON CONFLICT (client_offline_id) DO NOTHING;

INSERT INTO public.submissions (
  memorial_id,
  kind,
  status,
  guest_display_name,
  body,
  client_offline_id
)
SELECT m.id, 'message', 'approved', 'Taylor Kim',
  'Your kindness shaped our community. Rest peacefully.',
  'seed-sample-heritage-approved-1'
FROM public.memorials m
WHERE m.slug = 'sample-memorymint-heritage'
ON CONFLICT (client_offline_id) DO NOTHING;

INSERT INTO public.submissions (
  memorial_id,
  kind,
  status,
  guest_display_name,
  body,
  client_offline_id
)
SELECT m.id, 'message', 'pending', NULL,
  'This message is waiting in the moderation queue (visible to admins only until approved).',
  'seed-sample-tribute-pending-1'
FROM public.memorials m
WHERE m.slug = 'sample-memorymint-tribute'
ON CONFLICT (client_offline_id) DO NOTHING;

COMMIT;
