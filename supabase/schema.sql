-- Run once in the Supabase project's SQL Editor to set up the Journal CMS.
-- Then create an admin user under Authentication → Users (email + password).

-- 1. Articles
create table if not exists posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  category         text not null default 'Kitchen',
  excerpt          text,
  content          text,
  image_url        text,
  image_alt        text,
  author           text not null default 'Madò Onnà',
  reading_time     int  not null default 1,
  published        boolean not null default false,
  published_at     timestamptz,
  updated_at       timestamptz,
  created_at       timestamptz not null default now(),
  views            int  not null default 0,
  meta_title       text,
  meta_description text,
  focus_keyword    text,
  canonical_url    text,
  og_title         text,
  og_description   text,
  tags             text[] not null default '{}',
  schema_types     text[] not null default '{"Article"}',
  -- ids from ACTS in lib/data.ts, shown as "Make a night of it" under the story
  related_acts     text[] not null default '{}'
);

alter table posts enable row level security;

create policy "Public can read published posts"
  on posts for select
  using (published = true);

create policy "Authenticated users manage posts"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Explicit grants, so this works even with "Automatically expose new tables" off. RLS above still decides which rows.
grant select on posts to anon;
grant select, insert, update, delete on posts to authenticated;

-- 2. Public image bucket
insert into storage.buckets (id, name, public)
values ('journal-images', 'journal-images', true)
on conflict (id) do nothing;

create policy "Public can view journal images"
  on storage.objects for select
  using (bucket_id = 'journal-images');

create policy "Authenticated users upload journal images"
  on storage.objects for insert
  with check (bucket_id = 'journal-images' and auth.role() = 'authenticated');

-- 3. Per-view log with approximate location (no IP stored)
create table if not exists post_views (
  id         uuid primary key default gen_random_uuid(),
  post_slug  text not null,
  country    text,
  region     text,
  city       text,
  viewed_at  timestamptz not null default now()
);

create index if not exists post_views_slug_idx on post_views (post_slug);

alter table post_views enable row level security;

create policy "Authenticated users read post_views"
  on post_views for select
  using (auth.role() = 'authenticated');

grant select on post_views to authenticated;

-- Visitors can't touch post_views directly; they log a view only through this.
create or replace function record_post_view(
  p_slug    text,
  p_country text default null,
  p_region  text default null,
  p_city    text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from posts where slug = p_slug and published = true) then
    return;
  end if;
  insert into post_views (post_slug, country, region, city)
  values (p_slug, p_country, p_region, p_city);
  update posts set views = views + 1 where slug = p_slug;
end;
$$;

grant execute on function record_post_view(text, text, text, text) to anon;

-- 4. The six launch stories that used to live in lib/journal.ts
insert into posts (title, slug, category, excerpt, content, image_url, published, published_at, reading_time) values
  ('What a Mediterranean table looks like in Bali', 'a-mediterranean-table-in-bali', 'Kitchen', 'Our head chef on sourcing olive oil from Puglia, fish from Jimbaran and herbs from a farm twenty minutes up the road.', '<p>The first question every cook asks when they arrive in Bali is what they will have to give up. The answer turned out to be less than we expected. The island is full of beautiful seafood, citrus, chillies and herbs that feel completely at home on a Mediterranean plate.</p><p>We import only what Bali cannot do better: the olive oil, a few cheeses, the bomba rice for our paella. Everything else starts at the market. The red snapper on the grill tonight came off a boat in Jimbaran this morning.</p><p>The result is a menu that tastes of four coastlines and still feels rooted here. That balance is the whole point.</p>', 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=2000&q=80&auto=format&fit=crop', true, '2026-10-24T09:00:00.000Z', 5),
  ('Four weeks of rehearsals for Bodrum Nights', 'rehearsals-for-bodrum-nights', 'Behind the show', 'Twelve performers, three acts and one rule: the show has to work from every seat in the room.', '<p>A dinner show is a strange kind of theatre. The audience is eating, talking, turning around to order another bottle. The choreography has to earn attention without demanding it.</p><p>Our creative director spent the summer on the Turkish coast collecting music, costumes and stories. In rehearsal, the cast moved through the dining room night after night until every entrance felt natural.</p><p>On opening night, the finale lands at 22:15. By 22:30, the tables are clearing and the same performers are on the dance floor with everyone else.</p>', 'https://images.unsplash.com/photo-1495791185843-c73f2269f669?w=2000&q=80&auto=format&fit=crop', true, '2026-10-12T09:00:00.000Z', 7),
  ('The spritz, reconsidered with island botanicals', 'the-spritz-reconsidered', 'Bar', 'How our bar team rebuilt a Venetian classic around Bali lime, lemongrass and a pinch of sea salt.', '<p>The spritz is a simple drink, which makes it easy to get wrong. Ours took eleven versions before it reached the street bar.</p><p>The secret is balance: a little less bitter, a little more citrus, and a pinch of sea salt that makes the whole thing taste like the end of a beach day.</p>', 'https://images.unsplash.com/photo-1514362453360-8f94243c9996?w=2000&q=80&auto=format&fit=crop', true, '2026-09-30T09:00:00.000Z', 4),
  ('Meet the hosts who remember your name', 'the-hosts-who-remember-your-name', 'People', 'Hospitality is a skill. Our floor team on how they read a room, and when to leave you alone.', '<p>Every table at Madò Onnà has a host, and every host has a notebook. Birthdays, favourite drinks, the seat you liked last time.</p><p>The best service, they say, is the kind you barely notice until you realise everything you needed was already there.</p>', 'https://images.unsplash.com/photo-1569924995012-c4c706bfcd51?w=2000&q=80&auto=format&fit=crop', true, '2026-09-18T09:00:00.000Z', 6),
  ('Why afrohouse sounds right at midnight in Berawa', 'afrohouse-at-midnight', 'Music', 'Our music director on building a night that moves from dinner jazz to a full dance floor without a single hard cut.', '<p>The night starts at 90 beats per minute and ends somewhere around 124. The trick is getting there so slowly that nobody notices.</p><p>Afrohouse has the warmth of the earlier hours and the drive of the later ones. It is the bridge between the restaurant and the club.</p>', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=2000&q=80&auto=format&fit=crop', true, '2026-09-02T09:00:00.000Z', 5),
  ('Five shores: a travel diary behind the concept', 'five-shores-a-travel-diary', 'Places', 'Mykonos, Tulum, Ibiza, Dubai and Bodrum: what each one taught us about a perfect night out.', '<p>Before there was a building, there was a list. Five places where the night seemed to know exactly what it was doing.</p><p>From each we took one habit. Together, they became a house in Berawa.</p>', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=2000&q=80&auto=format&fit=crop', true, '2026-08-20T09:00:00.000Z', 8)
on conflict (slug) do nothing;
