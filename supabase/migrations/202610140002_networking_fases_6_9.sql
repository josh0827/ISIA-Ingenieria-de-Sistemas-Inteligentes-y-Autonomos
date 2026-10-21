-- Networking ISIA, fases 6 a 9.
-- Añade preguntas moderadas e ingestión auditable de forks de GitHub.
-- Ninguna de estas tablas admite acceso directo desde los clientes web.

create table if not exists public.preguntas_comunidad (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 100),
  correo text not null check (char_length(correo) between 5 and 160),
  categoria text not null check (categoria in (
    'Participación', 'Proyectos e ideas', 'Prototipado',
    'Oportunidades', 'Investigación', 'Otra'
  )),
  pregunta text not null check (char_length(pregunta) between 15 and 1200),
  respuesta text check (respuesta is null or char_length(respuesta) between 10 and 3000),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'respondida', 'archivada')),
  consentimiento boolean not null check (consentimiento = true),
  respondida_por uuid references auth.users(id) on delete set null,
  respondida_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint pregunta_publicada_con_respuesta check (
    estado <> 'respondida' or (respuesta is not null and respondida_en is not null)
  )
);

create table if not exists public.integraciones_github_eventos (
  entrega_id text primary key check (char_length(entrega_id) between 1 and 100),
  evento text not null,
  propietario text not null check (char_length(propietario) between 1 and 100),
  repositorio_origen text not null check (char_length(repositorio_origen) between 3 and 220),
  repositorio_creado text not null check (char_length(repositorio_creado) between 12 and 500),
  estado text not null check (estado in ('recibido', 'borrador_creado', 'ignorado', 'rechazado')),
  detalle jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now()
);

create index if not exists preguntas_comunidad_estado_idx
  on public.preguntas_comunidad (estado, creado_en desc);
create index if not exists integraciones_github_estado_idx
  on public.integraciones_github_eventos (estado, creado_en desc);

alter table public.preguntas_comunidad enable row level security;
alter table public.integraciones_github_eventos enable row level security;
revoke all on table public.preguntas_comunidad from anon, authenticated;
revoke all on table public.integraciones_github_eventos from anon, authenticated;

comment on table public.preguntas_comunidad is
  'Preguntas privadas hasta que una persona editora responda y apruebe su publicación.';
comment on table public.integraciones_github_eventos is
  'Metadatos mínimos de webhooks firmados; evita duplicados y permite auditar borradores.';
