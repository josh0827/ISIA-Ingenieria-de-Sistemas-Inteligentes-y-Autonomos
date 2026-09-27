# Transferencia institucional de la plataforma ISIA

Esta guía describe cómo entregar la administración de Supabase, Vercel y Google Cloud a la cuenta institucional del semillero sin publicar secretos ni interrumpir el sitio. La transferencia debe realizarse cuando exista una cuenta institucional confirmada y con recuperación administrada por la Universidad.

La transferencia cambia responsables y permisos. No autoriza por sí sola el paso de DEMO a FULL ni la publicación de datos pendientes de validación.

## 1. Responsables y condiciones previas

Antes de empezar, registra estos responsables:

| Responsabilidad | Cuenta o persona | Confirmado |
| --- | --- | --- |
| Cuenta institucional principal | `CORREO_INSTITUCIONAL_AQUI` | ☐ |
| Responsable técnico ISIA | Pendiente | ☐ |
| Responsable de contenido | Pendiente | ☐ |
| Contacto OTIC | Pendiente | ☐ |
| Propietario temporal actual | Pendiente | ☐ |

La cuenta institucional debe tener autenticación multifactor, métodos de recuperación institucionales y acceso probado a Supabase, Vercel y Google Cloud. Es recomendable conservar dos propietarios institucionales durante la operación normal para evitar depender de una sola cuenta.

No retires al propietario actual hasta completar toda la lista de verificación de la sección 7.

## 2. Inventario antes de transferir

Registra el estado inicial sin copiar valores secretos en este documento:

| Recurso | Identificador | Entorno o ubicación |
| --- | --- | --- |
| Repositorio Git | `ORGANIZACION/REPOSITORIO` | Rama de producción pendiente |
| Proyecto Supabase | `PROJECT_REF_AQUI` | Región y plan pendientes |
| Organización Supabase origen | `ORG_ORIGEN_AQUI` | — |
| Organización Supabase destino | `ORG_DESTINO_AQUI` | — |
| Proyecto Vercel | `PROYECTO_VERCEL_AQUI` | Equipo destino pendiente |
| Dominio de producción | `DOMINIO_AQUI` | DNS pendiente |
| Proyecto Google Cloud | `PROJECT_ID_AQUI` | Organización pendiente |
| Cliente OAuth de Google | Solo identificador, nunca el secreto | Aplicación web |

Guarda por separado:

- Exportación o respaldo verificable de PostgreSQL.
- Inventario del bucket `imagenes` y una muestra descargada.
- Lista de dominios, aliases y variables de Vercel por entorno.
- Lista de usuarios con rol Owner en cada plataforma.
- Identificador del cliente OAuth, pantalla de consentimiento y URIs autorizadas.
- Último commit estable y última URL de despliegue validada.

Los valores reales de `.env.local`, claves de servicio, secretos OAuth y tokens personales no deben copiarse en Markdown, incidencias ni chats.

## 3. Transferencia de Supabase

La opción recomendada es mover el proyecto a una organización institucional. Añadir un segundo Owner a la organización actual solo es adecuado cuando esa organización ya pertenece exclusivamente a ISIA.

### Preparación

1. Inicia sesión con la cuenta institucional y crea o selecciona la organización de destino.
2. Añade la cuenta institucional como miembro de la organización origen cuando corresponda.
3. Comprueba que el propietario actual es Owner de la organización origen y miembro de la organización destino.
4. Revisa los bloqueos de transferencia indicados por Supabase: conexión activa con GitHub, roles limitados al proyecto y log drains configurados.
5. Confirma que el plan de destino soporta el proyecto y sus complementos. Un cambio de plan puede afectar disponibilidad y funciones.

### Ejecución

1. Abre el proyecto en Supabase.
2. Entra a **Project Settings → General** y localiza **Transfer project**.
3. Selecciona la organización institucional de destino.
4. Revisa región, plan, facturación y complementos antes de confirmar.
5. Ejecuta la transferencia y espera a que el panel indique que terminó.

La transferencia entre organizaciones no cambia la región. Si la Universidad exige otra región, se necesita una migración de datos diferente.

### Validación inmediata

Comprueba en la organización destino:

- Tablas `contenido`, `configuracion`, `usuarios_autorizados`, `grupos_trabajo` y `practicas_ofertas`.
- Políticas RLS y migraciones aplicadas.
- Proveedores de Supabase Auth y URLs autorizadas.
- Bucket público `imagenes`, archivos y políticas.
- Project URL, claves públicas y clave del servidor utilizadas por la aplicación.
- Inicio de sesión de un `admin`, un `editor` y una `empresa` activos.

No presupongas que las claves siguen siendo correctas: compáralas desde el panel y actualiza los entornos solo si cambiaron.

## 4. Transferencia de Vercel

El propietario actual debe ser Owner del equipo origen y miembro del equipo destino. La cuenta institucional debe pertenecer al equipo institucional antes de iniciar.

1. Crea o selecciona el equipo institucional de destino.
2. Desde el proyecto abre **Settings → General → Transfer Project**.
3. Selecciona el equipo destino y revisa el nombre, dominios, aliases y variables que Vercel muestra como transferibles.
4. Confirma que el equipo destino tiene plan y método de pago adecuados, si aplica.
5. Ejecuta la transferencia y espera su finalización antes de modificar ajustes o desplegar.

Vercel transfiere despliegues, configuración, dominios, variables del panel, enlace Git y ajustes principales. Debes revisar o reconstruir por separado:

- Integraciones instaladas.
- Log drains, registros históricos y datos de monitoreo.
- Recursos Blob o Edge Config, si se incorporan en el futuro.
- Variables declaradas dentro de `env` o `build.env` en `vercel.json`.

Este proyecto no guarda secretos en `vercel.json`. Las variables requeridas deben configurarse en Vercel para Production, Preview y Development según corresponda:

| Variable | Exposición | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Pública | Cliente web y Auth SSR |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor | Operaciones administrativas |

La clave `SUPABASE_SERVICE_ROLE_KEY` nunca debe llevar el prefijo `NEXT_PUBLIC_`. Después de modificar variables, crea un nuevo despliegue; los despliegues anteriores no reciben cambios retroactivos.

## 5. Google Cloud y OAuth

### Entrega administrativa

Para un proyecto que todavía no pertenece a una organización institucional:

1. Abre **Google Cloud Console → IAM y administración → IAM**.
2. Añade el correo institucional con el rol **Owner** desde la consola.
3. La cuenta institucional debe aceptar la invitación de propiedad.
4. Accede con esa cuenta y verifica el proyecto, la pantalla de consentimiento y el cliente OAuth.

Si OTIC dispone de una organización de Google Cloud o Cloud Identity, solicita su acompañamiento antes de mover el proyecto. Migrar un proyecto a una organización institucional puede heredar políticas IAM y de organización, y no debe tratarse como un simple cambio de correo.

### Configuración OAuth que debe conservarse

En el cliente OAuth de tipo **Web application**, la URI de retorno de Google debe coincidir exactamente con el callback mostrado por Supabase:

```text
https://PROJECT_REF_AQUI.supabase.co/auth/v1/callback
```

En **Supabase Auth → URL Configuration**, registra la URL pública del sitio y sus callbacks permitidos:

```text
https://DOMINIO_AQUI/api/auth/callback
http://localhost:3000/api/auth/callback
```

Añade previews únicamente cuando sea necesario y con un patrón restringido. El protocolo, dominio, puerto, ruta y barra final deben coincidir con la configuración utilizada; una diferencia produce `redirect_uri_mismatch`.

El Client ID y Client Secret de Google se almacenan en la configuración del proveedor Google de Supabase Auth. No pertenecen a `.env.local` ni a variables `NEXT_PUBLIC_`.

## 6. Repositorio, DNS y accesos personales

1. Otorga a la cuenta o equipo institucional acceso administrativo al repositorio Git.
2. Verifica que Vercel pueda seguir leyendo el repositorio después del cambio de equipo.
3. Coordina con OTIC el subdominio, registros DNS y certificados requeridos.
4. Conserva la rama `Prueba` hasta que el flujo institucional defina la rama de producción.
5. Documenta quién puede aprobar despliegues, migraciones y cambios de secretos.

Cuando todo esté validado:

- Retira tokens personales de automatización que ya no sean necesarios.
- Revoca sesiones y accesos de colaboradores que no deban continuar.
- Conserva al menos dos Owners institucionales cuando el plan lo permita.
- Rota secretos solamente con una ventana controlada y un despliegue preparado; evita rotaciones simultáneas en las tres plataformas.

## 7. Prueba de aceptación

La transferencia se considera terminada cuando la cuenta institucional puede realizar estas comprobaciones:

- [ ] Acceder a Supabase y consultar tablas, Auth y Storage.
- [ ] Acceder a Vercel y crear un despliegue Preview desde la rama acordada.
- [ ] Consultar y modificar las variables de entorno sin revelar secretos en registros.
- [ ] Abrir la web pública y navegar en móvil y escritorio.
- [ ] Iniciar sesión con Google como `admin` o `editor` y entrar a `/admin`.
- [ ] Iniciar sesión como `empresa` y entrar a `/admin/practicas`.
- [ ] Crear y desactivar una oferta de prueba identificada claramente como prueba.
- [ ] Crear o editar contenido y comprobar `revalidatePath` en la web pública.
- [ ] Subir una imagen de prueba al bucket `imagenes` y comprobar su URL pública.
- [ ] Cerrar sesión y confirmar que las rutas administrativas quedan bloqueadas.
- [ ] Revisar errores de funciones y compilación en el nuevo equipo Vercel.
- [ ] Confirmar dominio, HTTPS, callback OAuth y política `noindex` de la demo.

Registra la fecha, responsables, resultados y cualquier excepción. El propietario anterior puede retirarse únicamente después de que el responsable institucional apruebe esta lista.

## 8. Reversión y contingencia

Si falla Supabase, conserva el acceso de ambos Owners, pausa mutaciones desde el panel y decide si se corrige en destino o se transfiere nuevamente al origen. No importes un respaldo sobre una base con escrituras activas.

Si falla Vercel, usa el último despliegue estable y corrige variables o integraciones antes de promover otro despliegue. La transferencia de proyecto puede repetirse hacia un equipo donde se cumplan nuevamente los permisos requeridos.

Si falla Google OAuth, conserva el cliente anterior, revisa primero la URI exacta de Supabase y la configuración de URL en Supabase Auth. No elimines el cliente OAuth hasta probar el inicio y cierre de sesión en producción.

Una migración de Google Cloud hacia una organización institucional puede tener restricciones de reversión. OTIC debe aprobar esa operación y su plan de contingencia antes de ejecutarla.

## 9. Referencias oficiales

- [Transferencia de proyectos en Supabase](https://supabase.com/docs/guides/platform/project-transfer)
- [Control de acceso y propietarios en Supabase](https://supabase.com/docs/guides/platform/access-control)
- [Transferencia de proyectos en Vercel](https://vercel.com/docs/projects/transferring-projects)
- [Roles y miembros de Vercel](https://vercel.com/docs/rbac/access-roles)
- [OAuth 2.0 para aplicaciones web de Google](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Configuración de organizaciones y migración en Google Cloud](https://docs.cloud.google.com/resource-manager/docs/organization-setup)
