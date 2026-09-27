-- Compatibilidad para proyectos que aplicaron la migración inicial cuando la
-- clave del editor todavía se llamaba uid.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'editores'
      and column_name = 'uid'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'editores'
      and column_name = 'id'
  ) then
    alter table public.editores rename column uid to id;
  end if;
end
$$;
