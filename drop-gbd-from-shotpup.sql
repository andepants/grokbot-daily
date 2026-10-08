-- ShotPup PRODUCTION (project ref yphkaijfjykmambtyjsp)
-- Drop Grok Bot Daily rate-limit objects applied by mistake.
-- DO NOT RUN until Andrew + Independent Reviewer approve.
--
-- Migration ledger row:
--   supabase_migrations.schema_migrations
--   version = '20261008173717'
--   name    = 'gbd_rate_limit'
-- Follow-up execute_sql also created public.gbd_config and replaced the RPCs
-- to read the shared secret from that table (no second migration row).
--
-- IR Option A (after this drop):
--   supabase migration repair --status reverted 20261008173717
-- Then ShotPup #20 `db push` can run in order without --include-all.

BEGIN;

-- Purge any raw PII rows first (N1).
DELETE FROM public.gbd_rate_buckets;
DELETE FROM public.gbd_email_lifetime;
DELETE FROM public.gbd_config;

DROP FUNCTION IF EXISTS public.gbd_rate_consume(text, text, integer, integer);
DROP FUNCTION IF EXISTS public.gbd_email_lifetime_consume(text, text, integer);

DROP TABLE IF EXISTS public.gbd_rate_buckets;
DROP TABLE IF EXISTS public.gbd_email_lifetime;
DROP TABLE IF EXISTS public.gbd_config;

DELETE FROM supabase_migrations.schema_migrations
WHERE version = '20261008173717'
   OR name = 'gbd_rate_limit';

COMMIT;

-- After applying the transaction above (Andrew, from a machine with the ShotPup
-- Supabase CLI linked to prod), repair the remote migration history:
--
--   supabase migration repair --status reverted 20261008173717
