-- Fase 3: roles ampliados, grupos de trabajo y base del módulo de prácticas.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'rol_usuario') then
    create type public.rol_usuario as enum ('admin', 'editor', 'empresa');
  end if;
end
$$;

create table if not exists public.usuarios_autorizados (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  rol public.rol_usuario not null default 'editor',
  nombre_empresa_o_usuario text,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table if not exists public.grupos_trabajo (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text not null,
  descripcion text not null,
  imagen_portada text,
  integrantes jsonb not null default '[]'::jsonb,
  repositorios jsonb not null default '[]'::jsonb,
  documentos jsonb not null default '[]'::jsonb,
  galeria_imagenes jsonb not null default '[]'::jsonb,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists public.practicas_ofertas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  empresa_nombre text not null,
  empresa_id uuid references public.usuarios_autorizados(id),
  ubicacion text not null default 'Manizales, Caldas',
  modalidad text not null default 'Presencial'
    check (modalidad in ('Presencial', 'Híbrida', 'Remota')),
  descripcion text not null,
  requisitos jsonb not null default '[]'::jsonb,
  contacto_email text not null,
  url_postulacion text,
  activa boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Conserva los editores actuales al introducir la tabla de roles.
insert into public.usuarios_autorizados (id, email, rol, activo)
select e.id, u.email, 'editor'::public.rol_usuario, e.activo
from public.editores e
join auth.users u on u.id = e.id
where u.email is not null
on conflict (id) do nothing;

alter table public.usuarios_autorizados enable row level security;
alter table public.grupos_trabajo enable row level security;
alter table public.practicas_ofertas enable row level security;

drop policy if exists "Consulta del propio usuario autorizado" on public.usuarios_autorizados;
create policy "Consulta del propio usuario autorizado" on public.usuarios_autorizados
  for select to authenticated using (id = auth.uid());

drop policy if exists "Lectura publica de grupos" on public.grupos_trabajo;
create policy "Lectura publica de grupos" on public.grupos_trabajo
  for select to anon, authenticated using (true);

drop policy if exists "Lectura publica de practicas activas" on public.practicas_ofertas;
create policy "Lectura publica de practicas activas" on public.practicas_ofertas
  for select to anon, authenticated using (activa = true);

drop policy if exists "Escritura de grupos por editores y admins" on public.grupos_trabajo;
create policy "Escritura de grupos por editores y admins" on public.grupos_trabajo
  for all to authenticated
  using (
    exists (
      select 1 from public.usuarios_autorizados
      where id = auth.uid() and activo = true and rol in ('admin', 'editor')
    )
  )
  with check (
    exists (
      select 1 from public.usuarios_autorizados
      where id = auth.uid() and activo = true and rol in ('admin', 'editor')
    )
  );

drop policy if exists "Gestion de ofertas por rol" on public.practicas_ofertas;
create policy "Gestion de ofertas por rol" on public.practicas_ofertas
  for all to authenticated
  using (
    exists (
      select 1 from public.usuarios_autorizados
      where id = auth.uid() and activo = true
        and (rol in ('admin', 'editor') or id = empresa_id)
    )
  )
  with check (
    exists (
      select 1 from public.usuarios_autorizados
      where id = auth.uid() and activo = true
        and (rol in ('admin', 'editor') or id = empresa_id)
    )
  );

insert into public.grupos_trabajo (slug, nombre, descripcion, integrantes)
values
  (
    'robotica-drones',
    'Robótica y Drones',
    'Desarrollo e investigación en plataformas robóticas móviles, vehículos aéreos no tripulados (UAVs) y algoritmos de navegación autónoma.',
    '["Ismael", "Felipe", "Joshua", "Mateo", "Jaime Enrique"]'::jsonb
  ),
  (
    'hardware-firmware',
    'Hardware, Firmware y Sistemas Embebidos',
    'Diseño de hardware a la medida, desarrollo de firmware embebido, electrónica de potencia, sistemas de energía y redes de nodos sensores.',
    '["Juan Pablo", "Miguel"]'::jsonb
  ),
  (
    'redes-adquisicion',
    'Redes y Adquisición de Datos',
    'Infraestructura de comunicaciones, protocolos para transmisión de datos en tiempo real, instrumentación y sistemas de adquisición de señales.',
    '["Sebastián", "Miguel"]'::jsonb
  ),
  (
    'operaciones-autonomas-energia',
    'Operaciones Autónomas (Energía)',
    'Investigación y desarrollo de estrategias de control y gestión autónoma para sistemas energéticos y microredes inteligentes.',
    '[]'::jsonb
  )
on conflict (slug) do nothing;
