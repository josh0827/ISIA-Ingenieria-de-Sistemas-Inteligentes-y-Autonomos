# Implementaciones del sitio ISIA

## Estado actual

La rama `Prueba` mantiene la interfaz pública y el panel `/admin` en Next.js App Router. La capa de backend usa Supabase:

- **PostgreSQL:** tablas `contenido`, `configuracion`, `usuarios_autorizados`, `grupos_trabajo` y `practicas_ofertas`.
- **Supabase Auth:** inicio de sesión con Google mediante PKCE y cookies SSR.
- **Supabase Storage:** bucket público `imagenes` para las cargas del panel.
- **Server Actions:** validación con Zod, autorización y escritura desde el servidor.
- **Actualización pública:** `revalidatePath` después de cada mutación.
- **Grupos de trabajo:** tabla dedicada, páginas públicas y CRUD con integrantes, repositorios, documentos e imágenes.
- **Prácticas e iniciativas:** listado público filtrable, gestión por empresas autorizadas y administración global por roles ISIA.

El contenido Markdown de `contenido/` continúa como respaldo de lectura si Supabase no está configurado o no responde. Las mutaciones del panel requieren la configuración completa y nunca escriben directamente desde componentes de cliente.

## Seguridad

El acceso administrativo exige dos comprobaciones:

1. Una sesión válida de Supabase Auth.
2. Una fila activa en `public.usuarios_autorizados` cuyo `id` coincida con el usuario autenticado.

Las tablas tienen RLS habilitado y no conceden acceso a los roles `anon` ni `authenticated`. El servidor utiliza `SUPABASE_SERVICE_ROLE_KEY`, que nunca debe exponerse con el prefijo `NEXT_PUBLIC_`. Las cargas verifican extensión, MIME, tamaño y firma binaria antes de llegar a Storage.

## Puesta en marcha

1. Crear un proyecto en Supabase.
2. Ejecutar `supabase/migrations/202609260001_backend_inicial.sql` desde SQL Editor o mediante Supabase CLI.
3. Habilitar Google en **Authentication > Providers** y configurar las URLs de redirección.
4. Copiar `.env.local.example` a `.env.local` y completar las tres variables.
5. Iniciar sesión una vez para crear el usuario y copiar su UUID desde **Authentication > Users**.
6. Ejecutar `supabase/migrations/202609260003_grupos_roles_practicas.sql` y crear una fila en `public.usuarios_autorizados` con ese UUID, correo, rol y `activo = true`.
7. Ejecutar `npm run migrar-contenido` si se desea importar el contenido Markdown inicial.

## Datos y archivos

`public.contenido` usa `coleccion` y `slug` como clave compuesta. La columna JSONB `datos` conserva los campos editables y `cuerpo` almacena Markdown. `public.configuracion` guarda la visibilidad del menú. Las imágenes se almacenan bajo carpetas del bucket `imagenes` y la base solo conserva la URL pública.

`public.grupos_trabajo` conserva la estructura de cada equipo. `public.usuarios_autorizados` controla los roles `admin`, `editor` y `empresa`; `public.practicas_ofertas` conserva las ofertas y su empresa propietaria. La migración `202609260003_grupos_roles_practicas.sql` crea estas tres estructuras.

## Pendiente de validación humana

- Configurar el proyecto real y sus secretos en cada entorno.
- Probar inicio con un usuario sin registro, uno inactivo, un editor y una empresa activa en `usuarios_autorizados`.
- Confirmar una carga real a Storage y la publicación de un proyecto.
- Verificar que desactivar Galería en el panel la retire del menú público.

## Plan futuro de búsqueda

Si el volumen de contenido crece, la búsqueda puede migrarse a Algolia. La integración futura deberá indexar únicamente contenido confirmado, sincronizar altas y cambios desde el servidor y conservar PostgreSQL como fuente de verdad.

## Transferencia institucional

El procedimiento para trasladar el control de Supabase, Vercel, Google OAuth, DNS y accesos del repositorio está definido en `TRANSFERENCIA_INSTITUCIONAL.md`. La transferencia requiere inventario previo, dos responsables durante el cambio, verificación funcional y aprobación institucional antes de retirar accesos personales.
