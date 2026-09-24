-- ============================================================================
-- Academic hierarchy + canonical subject mapping (review-only, additive)
--
-- Purpose (one statement at a time, see inline comments and the summary at
-- the bottom):
--   1. Create reference tables: branches, sections, subjects.
--   2. Seed the single canonical branch (ECE), its three sections, and the six
--      Semester 5 subjects (dsp, me, dcn, efe, twa, cs).
--   3. Add storage columns so resources / important_questions / announcements
--      can reference canonical subjects and (optionally) sections.
--   4. Map the already-approved legacy identities to canonical subject ids:
--      Digital Signal Processing -> dsp, Digital Communication -> dcn,
--      Computer Networks -> cs, Antenna & Wave Propagation -> twa
--      while preserving every original row, id, timestamp, creator and file.
--
-- Safety properties:
--   * Additive only. No DROP, no TRUNCATE, no DELETE.
--   * CREATE TABLE / ALTER TABLE are idempotent ("if not exists").
--   * UPDATEs only touch rows whose subject reference currently equals an
--     approved legacy value, so re-running is a no-op.
--   * Existing resources keep section_id = NULL (section ownership is never
--     guessed). Only newly uploaded files may carry section_id.
--   * Existing storage files are never modified, only referenced.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Reference tables
-- ----------------------------------------------------------------------------

create table if not exists public.branches (
  id text primary key,
  name text not null,
  code text not null,
  slug text not null unique
);

create table if not exists public.sections (
  id text primary key,
  branch_id text not null references public.branches(id) on delete restrict,
  name text not null,
  slug text not null unique
);

create table if not exists public.subjects (
  id text primary key,
  branch_id text not null references public.branches(id) on delete restrict,
  semester smallint not null check (semester between 1 and 8),
  code text not null,
  name text,
  slug text not null,
  unique (branch_id, semester, id)
);

create index if not exists subjects_branch_semester_idx
  on public.subjects (branch_id, semester);

-- ----------------------------------------------------------------------------
-- 2. Seed canonical academic data (idempotent)
-- ----------------------------------------------------------------------------

insert into public.branches (id, name, code, slug)
values (
  'ece',
  'Electronics & Communication Engineering',
  'ECE',
  'ece'
)
on conflict (id) do nothing;

insert into public.sections (id, branch_id, name, slug)
values
  ('ece-morning-1', 'ece', 'Morning 1', 'ece-morning-1'),
  ('ece-morning-2', 'ece', 'Morning 2', 'ece-morning-2'),
  ('ece-evening',   'ece', 'Evening',   'ece-evening')
on conflict (id) do nothing;

-- Only Semester 5 is active. EFE intentionally has no full form (name NULL).
insert into public.subjects (id, branch_id, semester, code, name, slug)
values
  ('dsp', 'ece', 5, 'DSP', 'Digital Signal Processing', 'dsp'),
  ('me',  'ece', 5, 'ME',  'Microelectronics', 'me'),
  ('dcn', 'ece', 5, 'DCN', 'Digital Communication', 'dcn'),
  ('efe', 'ece', 5, 'EFE', null, 'efe'),
  ('twa', 'ece', 5, 'TWA', 'Antenna & Wave Propagation', 'twa'),
  ('cs',  'ece', 5, 'CS',  'Computer Networks', 'cs')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 3. New nullable storage columns (resources)
-- ----------------------------------------------------------------------------

alter table public.resources
  add column if not exists subject_id text references public.subjects(id);

alter table public.resources
  add column if not exists section_id text references public.sections(id);

alter table public.resources
  add column if not exists legacy_subject_name text;

-- ----------------------------------------------------------------------------
-- 3b. New nullable storage columns (important_questions, announcements)
-- ----------------------------------------------------------------------------

alter table public.important_questions
  add column if not exists section_id text references public.sections(id);

alter table public.important_questions
  add column if not exists legacy_subject_id text;

alter table public.announcements
  add column if not exists section_id text references public.sections(id);

alter table public.announcements
  add column if not exists legacy_subject_id text;

-- ----------------------------------------------------------------------------
-- 4. Approved subject mapping (idempotent, no-op on re-run)
-- ----------------------------------------------------------------------------

-- 4a. resources: previous `subject` text -> canonical subject_id + canonical
--     name. Only rows with no subject_id yet are touched; the original subject
--     text is preserved in legacy_subject_name.
update public.resources as r
set
  subject_id = m.subject_id,
  subject = m.canonical_name,
  legacy_subject_name = r.subject
from (
  values
    ('digital signal processing',  'dsp', 'Digital Signal Processing'),
    ('digital-signal-processing',  'dsp', 'Digital Signal Processing'),
    ('digital_signal_processing',  'dsp', 'Digital Signal Processing'),
    ('digital communication',      'dcn', 'Digital Communication'),
    ('digital-communication',      'dcn', 'Digital Communication'),
    ('digital_communication',      'dcn', 'Digital Communication'),
    ('computer networks',          'cs',  'Computer Networks'),
    ('computer-networks',          'cs',  'Computer Networks'),
    ('computer_networks',          'cs',  'Computer Networks'),
    ('antenna & wave propagation', 'twa', 'Antenna & Wave Propagation'),
    ('antenna and wave propagation','twa', 'Antenna & Wave Propagation'),
    ('antenna-and-wave-propagation','twa', 'Antenna & Wave Propagation'),
    ('antenna_and_wave_propagation','twa', 'Antenna & Wave Propagation')
) as m(legacy_value, subject_id, canonical_name)
where
  r.subject_id is null
  and lower(btrim(r.subject)) = m.legacy_value;

-- 4b. important_questions: legacy subject_id slug -> canonical slug.
update public.important_questions as iq
set
  subject_id = m.canonical_slug,
  legacy_subject_id = lower(btrim(iq.subject_id))
from (
  values
    ('digital-signal-processing',  'dsp'),
    ('digital-communication',      'dcn'),
    ('computer-networks',          'cs'),
    ('antenna-and-wave-propagation','twa')
) as m(legacy_slug, canonical_slug)
where lower(btrim(iq.subject_id)) = m.legacy_slug;

-- 4c. announcements: legacy subject_id slug -> canonical slug.
update public.announcements as ann
set
  subject_id = m.canonical_slug,
  legacy_subject_id = lower(btrim(ann.subject_id))
from (
  values
    ('digital-signal-processing',  'dsp'),
    ('digital-communication',      'dcn'),
    ('computer-networks',          'cs'),
    ('antenna-and-wave-propagation','twa')
) as m(legacy_slug, canonical_slug)
where lower(btrim(ann.subject_id)) = m.legacy_slug;

-- ----------------------------------------------------------------------------
-- Review summary (expected after applying this migration):
--   resources.subject          -> 0 mapped rows (none matched the approved set)
--   important_questions        -> 2 rows mapped: digital-communication -> dcn
--   announcements.subject_id   -> 1 row mapped:  digital-communication -> dcn
--   remaining unscoped rows keep section_id NULL.
--
-- Verification queries (run manually if desired):
--   select subject_id, count(*) from public.resources group by subject_id;
--   select subject_id, legacy_subject_id   from public.important_questions where legacy_subject_id is not null;
--   select subject_id, legacy_subject_id   from public.announcements where legacy_subject_id is not null;
-- ============================================================================