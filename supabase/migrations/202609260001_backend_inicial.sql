-- Backend inicial de ISIA: contenido editorial, configuración, editores y multimedia.
create table if not exists public.contenido (
  coleccion text not null check (coleccion in (
    'proyectos', 'novedades', 'reuniones', 'integrantes', 'publicaciones', 'galeria'
  )),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  datos jsonb not null default '{}'::jsonb,
  cuerpo text not null default '',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  primary key (coleccion, slug)
);

create table if not exists public.configuracion (
  clave text primary key,
  datos jsonb not null default '{}'::jsonb,
  actualizado_en timestamptz not null default now()
);

create table if not exists public.editores (
  id uuid primary key references auth.users(id) on delete cascade,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

alter table public.contenido enable row level security;
alter table public.configuracion enable row level security;
alter table public.editores enable row level security;

revoke all on table public.contenido from anon, authenticated;
revoke all on table public.configuracion from anon, authenticated;
revoke all on table public.editores from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'imagenes',
  'imagenes',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Lectura publica de imagenes ISIA" on storage.objects;
create policy "Lectura publica de imagenes ISIA"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'imagenes');

-- No se crean políticas de escritura para clientes. Las Server Actions usan
-- SUPABASE_SERVICE_ROLE_KEY después de validar la sesión y el editor activo.
