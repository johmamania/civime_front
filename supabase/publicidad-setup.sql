-- Ejecutar en Supabase → SQL Editor después de crear el bucket "publicidad" en Storage (público).
-- Revise las políticas antes de producción: la clave anon quedará expuesta en el navegador.

create table if not exists public.publicidad (
  id bigint generated always as identity primary key,
  titulo text,
  descripcion text not null,
  username text,
  fecha timestamptz not null default now(),
  estado smallint not null default 1 check (estado in (0, 1)),
  name_img text not null,
  url_archivo text not null
);

alter table public.publicidad
  add column if not exists username text;

create index if not exists idx_publicidad_estado_fecha
  on public.publicidad (estado, fecha desc);

alter table public.publicidad enable row level security;

drop policy if exists "publicidad_anon_all" on public.publicidad;
create policy "publicidad_anon_all"
  on public.publicidad for all
  to anon, authenticated
  using (true)
  with check (true);

-- Bucket: en Storage cree "publicidad" como público, o descomente:
-- insert into storage.buckets (id, name, public)
-- values ('publicidad', 'publicidad', true)
-- on conflict (id) do update set public = excluded.public;

drop policy if exists "storage_publicidad_select" on storage.objects;
drop policy if exists "storage_publicidad_insert" on storage.objects;
drop policy if exists "storage_publicidad_update" on storage.objects;
drop policy if exists "storage_publicidad_delete" on storage.objects;

create policy "storage_publicidad_select"
  on storage.objects for select
  to public
  using (bucket_id = 'publicidad');

create policy "storage_publicidad_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'publicidad');

create policy "storage_publicidad_update"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'publicidad');

create policy "storage_publicidad_delete"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'publicidad');
