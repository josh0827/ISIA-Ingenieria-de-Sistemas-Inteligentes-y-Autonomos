-- Networking ISIA, fases 1 a 5.
-- Amplía el contenido editorial, centraliza solicitudes privadas y conserva
-- el histórico de oportunidades sin exponer datos personales al navegador.

alter table public.contenido drop constraint if exists contenido_coleccion_check;
alter table public.contenido add constraint contenido_coleccion_check check (
  coleccion in (
    'proyectos', 'ideas', 'servicios', 'novedades', 'reuniones',
    'integrantes', 'publicaciones', 'galeria'
  )
);

create table if not exists public.solicitudes_colaboracion (
  id uuid primary key default gen_random_uuid(),
  destino_tipo text not null check (destino_tipo in ('proyecto', 'idea')),
  destino_slug text not null check (destino_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  destino_titulo text not null check (char_length(destino_titulo) between 2 and 180),
  nombre text not null check (char_length(nombre) between 2 and 100),
  correo text not null check (char_length(correo) between 5 and 160),
  tipo_participante text not null check (tipo_participante in (
    'pregrado', 'posgrado', 'egresado', 'docente_investigador',
    'empresa_institucion', 'externo'
  )),
  tipo_colaboracion text not null check (tipo_colaboracion in (
    'integrar_equipo', 'mentoria', 'conocimiento_tecnico',
    'equipos_infraestructura', 'alianza', 'apoyo_material_financiero', 'informacion'
  )),
  organizacion text check (organizacion is null or char_length(organizacion) <= 180),
  mensaje text not null check (char_length(mensaje) between 20 and 1800),
  consentimiento boolean not null check (consentimiento = true),
  estado public.estado_solicitud not null default 'nueva',
  responsable_id uuid references auth.users(id) on delete set null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists public.solicitudes_prototipado (
  id uuid primary key default gen_random_uuid(),
  servicio_slug text check (servicio_slug is null or servicio_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text not null check (char_length(nombre) between 2 and 100),
  correo text not null check (char_length(correo) between 5 and 160),
  tipo_participante text not null check (tipo_participante in (
    'pregrado', 'posgrado', 'egresado', 'docente_investigador',
    'empresa_institucion', 'externo'
  )),
  organizacion text check (organizacion is null or char_length(organizacion) <= 180),
  titulo_reto text not null check (char_length(titulo_reto) between 3 and 180),
  descripcion_reto text not null check (char_length(descripcion_reto) between 30 and 3000),
  resultado_esperado text not null check (char_length(resultado_esperado) between 10 and 1200),
  areas text[] not null check (cardinality(areas) between 1 and 8),
  requiere_confidencialidad boolean not null default false,
  consentimiento boolean not null check (consentimiento = true),
  estado public.estado_solicitud not null default 'nueva',
  responsable_id uuid references auth.users(id) on delete set null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

alter table public.practicas_ofertas
  add column if not exists tipo_oportunidad text not null default 'práctica',
  add column if not exists estado text,
  add column if not exists fecha_cierre date,
  add column if not exists contacto_publico boolean not null default false;

update public.practicas_ofertas
set estado = case when activa then 'abierta' else 'cerrada' end
where estado is null;

alter table public.practicas_ofertas alter column estado set default 'borrador';
alter table public.practicas_ofertas alter column estado set not null;
alter table public.practicas_ofertas drop constraint if exists practicas_ofertas_estado_check;
alter table public.practicas_ofertas add constraint practicas_ofertas_estado_check
  check (estado in ('borrador', 'abierta', 'cerrada', 'archivada'));
alter table public.practicas_ofertas drop constraint if exists practicas_ofertas_tipo_oportunidad_check;
alter table public.practicas_ofertas add constraint practicas_ofertas_tipo_oportunidad_check
  check (tipo_oportunidad in ('práctica', 'empleo', 'convocatoria', 'reto'));

create index if not exists solicitudes_colaboracion_estado_idx
  on public.solicitudes_colaboracion (estado, creado_en desc);
create index if not exists solicitudes_prototipado_estado_idx
  on public.solicitudes_prototipado (estado, creado_en desc);
create index if not exists practicas_ofertas_estado_idx
  on public.practicas_ofertas (estado, fecha_cierre desc, creado_en desc);

alter table public.solicitudes_colaboracion enable row level security;
alter table public.solicitudes_prototipado enable row level security;
revoke all on table public.solicitudes_colaboracion from anon, authenticated;
revoke all on table public.solicitudes_prototipado from anon, authenticated;

drop policy if exists "Lectura publica de practicas activas" on public.practicas_ofertas;
drop policy if exists "Lectura publica de oportunidades" on public.practicas_ofertas;
revoke all on table public.practicas_ofertas from anon, authenticated;

-- La aplicación pública lee desde el servidor y entrega una proyección sin
-- correos privados. No se habilita lectura REST directa de la tabla.

comment on table public.solicitudes_colaboracion is
  'Bandeja privada de solicitudes relacionadas con proyectos e ideas.';
comment on table public.solicitudes_prototipado is
  'Retos externos recibidos para evaluación académica; no constituyen contratos.';

-- Registros de interfaz claramente ilustrativos. Pueden ocultarse mediante
-- configuracion.contenido_demo o eliminarse cuando exista contenido validado.
insert into public.contenido (coleccion, slug, datos, cuerpo)
values
  (
    'ideas',
    'monitoreo-distribuido-de-entorno',
    jsonb_build_object(
      'titulo', 'Monitoreo distribuido de un entorno',
      'resumen', 'Ejemplo de cómo presentar una idea que busca equipo para validar sensores, comunicación y análisis de datos.',
      'problema', 'Se necesita observar una variable ambiental en varios puntos y conocer las limitaciones de la medición.',
      'solucion', 'Explorar nodos de bajo consumo y un tablero mínimo para revisar la calidad de los datos.',
      'proceso', 'Definir la pregunta, seleccionar sensores, construir un nodo y comparar mediciones.',
      'area', 'Sistemas embebidos e IoT',
      'estado', 'Abierta',
      'madurez', 'Idea',
      'autor', 'Equipo ilustrativo',
      'necesidades', jsonb_build_array('Revisión de sensores', 'Diseño de experimento'),
      'confirmado', false,
      'estadoEditorial', 'Publicado'
    ),
    'Esta ficha demuestra la estructura editorial. No representa un proyecto ni una convocatoria vigente.'
  ),
  (
    'servicios',
    'exploracion-de-pruebas-de-concepto',
    jsonb_build_object(
      'titulo', 'Exploración de pruebas de concepto',
      'resumen', 'Ejemplo de una capacidad para convertir una necesidad acotada en un experimento técnico evaluable.',
      'areas', jsonb_build_array('Robótica', 'Internet de las cosas', 'Software', 'Inteligencia artificial'),
      'responsable', 'Equipo por confirmar',
      'condiciones', 'La viabilidad, el equipo, los tiempos, la confidencialidad y la propiedad intelectual se acuerdan antes de iniciar.',
      'activo', true,
      'confirmado', false,
      'estadoEditorial', 'Publicado'
    ),
    'Este contenido es ilustrativo y no constituye una oferta comercial.'
  )
on conflict (coleccion, slug) do nothing;
