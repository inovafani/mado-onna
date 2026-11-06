-- Restores the SEO fields and adds "Make a night of it" links. Safe to run more than once.
alter table posts
  add column if not exists tags             text[] not null default '{}',
  add column if not exists focus_keyword    text,
  add column if not exists canonical_url    text,
  add column if not exists schema_types     text[] not null default '{"Article"}',
  add column if not exists og_title         text,
  add column if not exists og_description   text,
  add column if not exists related_acts     text[] not null default '{}';
