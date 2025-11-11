-- =========================================================
--  Extensions
-- =========================================================

-- Pour gen_random_uuid()
create extension if not exists "pgcrypto";

-- =========================================================
--  Types
-- =========================================================

-- Rôle applicatif : simple user ou admin (qui pourra publier des œuvres)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'admin');
  end if;
end $$;

-- =========================================================
--  Table profiles (lié à auth.users)
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

-- =========================================================
--  Table works (films / séries)
-- =========================================================

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  -- petit slug lisible (ex: "w1", "w2") 
  slug text unique,
  title text not null,
  year integer,
  -- film / serie (type d’œuvre)
  kind text not null check (kind in ('film', 'serie')),
  genre text,
  description text,
  -- soit chemin local ("/posters/w1.jpg"), soit URL externe plus tard
  poster_path text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

create index if not exists works_slug_idx  on public.works (slug);
create index if not exists works_genre_idx on public.works (genre);
create index if not exists works_kind_idx  on public.works (kind);

-- =========================================================
--  Table endings (fins alternatives)
-- =========================================================

create table if not exists public.endings (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works (id) on delete cascade,
  title text,
  author_name text,
  content text not null,
  votes_count integer not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

create index if not exists endings_work_id_idx on public.endings (work_id);

-- =========================================================
--  Table votes (un vote max par user/fin)
-- =========================================================

create table if not exists public.votes (
  user_id  uuid not null references public.profiles (id) on delete cascade,
  ending_id uuid not null references public.endings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, ending_id)
);

create index if not exists votes_ending_id_idx on public.votes (ending_id);

-- =========================================================
--  RLS (Row Level Security)
-- =========================================================

alter table public.profiles enable row level security;
alter table public.works    enable row level security;
alter table public.endings  enable row level security;
alter table public.votes    enable row level security;

-- -------------------------
--  Policies : profiles
-- -------------------------

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Anyone can insert profiles (demo)"
  on public.profiles
  for insert
  with check (true);


-- -------------------------
--  Policies : works
--  (films / séries)
-- -------------------------

drop policy if exists "Works are readable by everyone" on public.works;
create policy "Works are readable by everyone"
  on public.works
  for select
  using (true);

-- Seuls les admins peuvent créer / modifier / supprimer des œuvres
drop policy if exists "Admins can insert works" on public.works;
create policy "Admins can insert works"
  on public.works
  for insert
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

drop policy if exists "Admins can update works" on public.works;
create policy "Admins can update works"
  on public.works
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

drop policy if exists "Admins can delete works" on public.works;
create policy "Admins can delete works"
  on public.works
  for delete
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

-- -------------------------
--  Policies : endings
--  (fins proposées)
-- -------------------------

drop policy if exists "Endings are readable by everyone" on public.endings;
create policy "Endings are readable by everyone"
  on public.endings
  for select
  using (true);

-- Pour l’instant : tout le monde peut proposer une fin

drop policy if exists "Anyone can insert endings (demo)" on public.endings;
create policy "Anyone can insert endings (demo)"
  on public.endings
  for insert
  with check (true);

-- On garde des règles strictes pour update/delete,


drop policy if exists "Author can update their endings" on public.endings;
create policy "Author can update their endings"
  on public.endings
  for update
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "Author can delete their endings" on public.endings;
create policy "Author can delete their endings"
  on public.endings
  for delete
  using (created_by = auth.uid());


-- -------------------------
--  Policies : votes
-- -------------------------

drop policy if exists "Users can see their votes" on public.votes;
create policy "Users can see their votes"
  on public.votes
  for select
  using (true);

drop policy if exists "Users can insert their votes" on public.votes;
create policy "Users can insert their votes"
  on public.votes
  for insert
  with check (true);

drop policy if exists "Users can delete their votes" on public.votes;
create policy "Users can delete their votes"
  on public.votes
  for delete
  using (true);

-- =========================================================
--  Données d’exemple (Œuvres + fins)
--  (AUCUN utilisateur inséré ici)
-- =========================================================

-- 3 œuvres d’exemple
insert into public.works (id, slug, title, year, kind, genre, description, poster_path)
values
  -- w1
  ('24bbf1d9-f615-412c-8d04-3aa6f6c4025f',
   'w1',
   'Interstellar — fin alternative',
   2014,
   'film',
   'science-fiction',
   'Une exploration spatiale où la fin peut prendre plusieurs chemins…',
   '/posters/w1.jpg'),

  -- w2
  ('93950e40-13e0-4d85-8458-f8988fae0088',
   'w2',
   'Inception — fin alternative',
   2010,
   'film',
   'science-fiction',
   'Totem qui tombe, qui ne tombe pas ? Ici, la communauté propose ses versions.',
   '/posters/w2.jpg'),

  -- w3
  ('cc73dc97-b574-4e4f-8e36-16ea57d5e7cf',
   'w3',
   'Star Wars VI',
   1986,
   'film',
   'space opera',
   'Et si Walter White avait pris une autre décision dans le dernier épisode ?',
   '/posters/w3.jpg');

-- Fins d’exemple
insert into public.endings (id, work_id, title, author_name, content, votes_count)
values
  -- e1 pour w1
  ('3cf4629c-0681-459e-99fb-9c287e161c21',
   '24bbf1d9-f615-412c-8d04-3aa6f6c4025f',
   'Cooper reste sur la planète',
   'Omar',
   'Dans cette fin, Cooper décide de rester sur la planète pour aider la prochaine mission, au lieu de repartir...',
   5),

  -- e2 pour w1
  ('a45efce2-ed3f-4dec-b4e9-9a031a6b4f10',
   '24bbf1d9-f615-412c-8d04-3aa6f6c4025f',
   'Murph part dans l’espace',
   'Luc',
   'Murph prend la relève et devient à son tour astronaute, bouclant la boucle familiale...',
   3),

  -- e3 pour w2
  ('15173a3a-3210-4e21-994a-45d172e0947d',
   '93950e40-13e0-4d85-8458-f8988fae0088',
   'Le totem tombe clairement',
   'Clément',
   'Le film se termine sur le totem qui tombe sans ambiguïté, mais Cobb doute toujours de sa réalité...',
   7);
