-- Trimrr database schema — run once in the Supabase SQL editor on a fresh
-- project (Dashboard → SQL Editor → New query → paste → Run).
--
-- Defines the two tables, indexes, uniqueness guarantees, row-level security,
-- and the public storage buckets the app uses. `id` is bigint identity, which
-- matches the backend's Java `Long` mapping (com.trimrr.entity.Url/Click).

-- =========================================================================
-- Tables
-- =========================================================================

create table if not exists public.urls (
    id           bigint generated always as identity primary key,
    created_at   timestamptz not null default now(),
    user_id      uuid not null references auth.users (id) on delete cascade,
    title        text not null,
    original_url text not null,
    short_url    text not null,
    custom_url   text,
    qr           text
);

create table if not exists public.clicks (
    id         bigint generated always as identity primary key,
    created_at timestamptz not null default now(),
    url_id     bigint not null references public.urls (id) on delete cascade,
    city       text,
    country    text,
    device     text
);

-- =========================================================================
-- Uniqueness + indexes
-- =========================================================================

-- The real guarantee behind the app-level collision check: no two links can
-- share a short_url or a custom_url. (Partial unique index on custom_url so
-- multiple NULLs are allowed but non-null values must be unique.)
alter table public.urls
    add constraint urls_short_url_key unique (short_url);

create unique index if not exists urls_custom_url_key
    on public.urls (custom_url)
    where custom_url is not null;

-- Redirect lookups resolve by short_url OR custom_url; index both.
create index if not exists urls_short_url_idx on public.urls (short_url);
create index if not exists urls_user_id_idx   on public.urls (user_id);
create index if not exists clicks_url_id_idx   on public.clicks (url_id);

-- =========================================================================
-- Row-level security
-- (The backend connects as the Postgres user and bypasses RLS. These policies
--  govern the frontend, which uses the anon key.)
-- =========================================================================

alter table public.urls   enable row level security;
alter table public.clicks enable row level security;

-- urls: a user may only see and manage their own links.
create policy "own urls - select" on public.urls
    for select using (auth.uid() = user_id);
create policy "own urls - insert" on public.urls
    for insert with check (auth.uid() = user_id);
create policy "own urls - update" on public.urls
    for update using (auth.uid() = user_id);
create policy "own urls - delete" on public.urls
    for delete using (auth.uid() = user_id);

-- clicks: a user may read analytics for links they own.
create policy "own clicks - select" on public.clicks
    for select using (
        exists (
            select 1 from public.urls
            where urls.id = clicks.url_id
              and urls.user_id = auth.uid()
        )
    );
-- Allow click inserts (used as a fallback if a click is ever logged from the
-- browser; the backend inserts via the service connection regardless).
create policy "clicks - insert" on public.clicks
    for insert with check (true);

-- =========================================================================
-- Storage buckets (public read) + upload policies
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('qrs', 'qrs', true), ('profile-pic', 'profile-pic', true)
on conflict (id) do nothing;

-- Public read for both buckets.
create policy "public read qrs" on storage.objects
    for select using (bucket_id = 'qrs');
create policy "public read profile-pic" on storage.objects
    for select using (bucket_id = 'profile-pic');

-- Uploads: QR codes are created by signed-in users; profile pictures are
-- uploaded during signup (before a session exists), so allow anon there.
create policy "upload qrs" on storage.objects
    for insert with check (bucket_id = 'qrs');
create policy "upload profile-pic" on storage.objects
    for insert with check (bucket_id = 'profile-pic');
