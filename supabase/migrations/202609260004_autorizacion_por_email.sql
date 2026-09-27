-- Permite preparar un usuario autorizado por correo antes de su primer acceso.
-- La callback OAuth vincula el UID de auth.users después de verificar la sesión.
alter table public.usuarios_autorizados
  add column if not exists registro_id uuid default gen_random_uuid();

update public.usuarios_autorizados
set registro_id = gen_random_uuid()
where registro_id is null;

alter table public.usuarios_autorizados
  alter column registro_id set default gen_random_uuid(),
  alter column registro_id set not null;

-- La referencia de prácticas debe soltarse temporalmente para cambiar la clave
-- primaria. El UID conserva unicidad y sigue siendo la referencia del usuario.
alter table public.practicas_ofertas
  drop constraint if exists practicas_ofertas_empresa_id_fkey;

alter table public.usuarios_autorizados
  drop constraint if exists usuarios_autorizados_pkey;

alter table public.usuarios_autorizados
  add constraint usuarios_autorizados_pkey primary key (registro_id);

alter table public.usuarios_autorizados
  alter column id drop not null;

alter table public.usuarios_autorizados
  drop constraint if exists usuarios_autorizados_id_key;

alter table public.usuarios_autorizados
  add constraint usuarios_autorizados_id_key unique (id);

alter table public.practicas_ofertas
  add constraint practicas_ofertas_empresa_id_fkey
  foreign key (empresa_id) references public.usuarios_autorizados(id)
  on update cascade on delete set null;

-- Se conserva la política de lectura del propio registro. No se habilita una
-- lectura global: el cliente service_role del servidor omite RLS de forma segura.
drop policy if exists "Consulta del propio usuario autorizado" on public.usuarios_autorizados;
create policy "Consulta del propio usuario autorizado" on public.usuarios_autorizados
  for select to authenticated using (id = auth.uid());

create unique index if not exists usuarios_autorizados_email_normalizado_key
  on public.usuarios_autorizados (lower(trim(email)));
