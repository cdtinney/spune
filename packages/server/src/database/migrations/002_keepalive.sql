-- Prevent Supabase free-tier project from pausing due to inactivity.
-- pg_cron inserts a row once per day, keeping the project active.

CREATE TABLE IF NOT EXISTS _keepalive (
  id SERIAL PRIMARY KEY,
  pinged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pg_cron is pre-installed on Supabase but must be explicitly enabled.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Insert a keepalive row every day at 00:00 UTC.
SELECT cron.schedule(
  'keepalive-ping',
  '0 0 * * *',
  $$INSERT INTO _keepalive (pinged_at) VALUES (now())$$
);

-- Purge rows older than 7 days every day at 00:05 UTC.
SELECT cron.schedule(
  'keepalive-cleanup',
  '5 0 * * *',
  $$DELETE FROM _keepalive WHERE pinged_at < now() - interval '7 days'$$
);
