# Despliegue de ISIA en Vercel

Esta guía prepara la demo para Vercel con Supabase Auth, PostgreSQL y Storage. No copies claves reales en el repositorio.

## 1. Crear o vincular el proyecto

Importa el repositorio de GitHub en Vercel y selecciona Next.js como framework. La rama de producción debe definirse explícitamente en **Project Settings → Git → Production Branch**.

El archivo `vercel.json` usa la región `gru1` (São Paulo). Vercel recomienda ejecutar las Functions en la misma región que la base de datos o lo más cerca posible. Si Supabase está alojado en otra región, cambia esta propiedad antes del despliegue definitivo.

## 2. Variables de entorno

Configura las siguientes variables desde **Project Settings → Environment Variables**:

| Variable | Production | Preview | Development | Tratamiento |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | Sí | Sí | Pública |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sí | Sí | Sí | Pública recomendada por Supabase |
| `SUPABASE_SECRET_KEY` | Sí | Sí | Sí | Secreto moderno `sb_secret_...`; solo servidor |
| `NEXT_PUBLIC_SITE_URL` | Dominio de producción | URL estable de preview o dominio de pruebas | `http://localhost:3000` | Pública |
| `NEXT_PUBLIC_SITIO_INDEXABLE` | Solo al salir de DEMO (`true`) | No definir | No definir | Pública; permite la indexación (ver `SALIR_DE_DEMO.md`) |
| `RESEND_API_KEY` | Opcional | Opcional | Opcional | Secreto; activa avisos del formulario |
| `RESEND_FROM_EMAIL` | Opcional | Opcional | Opcional | Remitente de un dominio verificado en Resend |
| `GITHUB_WEBHOOK_SECRET` | Opcional | Entorno de prueba separado | Opcional | Secreto aleatorio para verificar eventos de GitHub |
| `GITHUB_ALLOWED_OWNER` | Opcional | Entorno de prueba separado | Opcional | Cuenta u organización autorizada para originar borradores |

Marca `SUPABASE_SECRET_KEY` como **Sensitive** en Production y Preview. Las claves Legacy (`SUPABASE_SERVICE_ROLE_KEY`) ya no se leen. Vercel no permite esa clasificación en Development; limita el acceso al proyecto y evita compartir el valor.

La clave pública Legacy (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) ya no se lee: configura `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_...`) y elimina la variable antigua.

Mientras `NEXT_PUBLIC_SITIO_INDEXABLE` no valga `true` (o falte `NEXT_PUBLIC_SITE_URL`), el sitio envía `noindex` en metadatos y en la cabecera `X-Robots-Tag`, y el sitemap queda vacío. Al cambiar la variable hay que volver a desplegar porque la cabecera se calcula en la compilación.

El formulario de participación guarda solicitudes aunque Resend no esté configurado. Para activar avisos, el remitente debe pertenecer a un dominio verificado; no uses la contraseña del correo institucional como variable de entorno.

Los previews no deberían escribir en la base de producción. Cuando sea posible, usa un proyecto Supabase separado o variables de Preview limitadas a una rama de pruebas.

Si se activa GitHub, configura el webhook del repositorio de origen hacia `https://DOMINIO/api/integraciones/github/webhook`, selecciona `application/json`, limita los eventos a **Forks** y usa el mismo secreto de `GITHUB_WEBHOOK_SECRET`. Un evento válido solo crea un proyecto en borrador; la publicación sigue siendo editorial.

## 3. Callbacks OAuth

En Google Cloud, el cliente OAuth Web debe tener:

```text
Origen autorizado:
https://isia-ingenieria-de-sistemas-intelig.vercel.app

URI de redirección autorizada:
https://PROJECT_REF_AQUI.supabase.co/auth/v1/callback
```

En **Supabase → Authentication → URL Configuration**:

```text
Site URL:
https://isia-ingenieria-de-sistemas-intelig.vercel.app

Redirect URLs:
https://isia-ingenieria-de-sistemas-intelig.vercel.app/api/auth/callback
http://localhost:3000/api/auth/callback
```

El callback de Google termina en Supabase. El callback `/api/auth/callback` pertenece a la aplicación y recibe la sesión desde Supabase.

## 4. Verificación previa

Ejecuta:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Antes del despliegue aplica en Supabase, en orden, las migraciones de `supabase/migrations/`. La migración `202610050001_solicitudes_auditoria_editorial.sql` crea las solicitudes privadas y la auditoría del panel.

Después del despliegue verifica:

- `/` y `/practicas` en móvil y escritorio.
- `/admin/iniciar-sesion` y el inicio con Google.
- Redirección de `admin` y `editor` hacia `/admin`.
- Redirección de `empresa` hacia `/admin/practicas`.
- Creación, edición y desactivación de contenido.
- Carga de imágenes en Supabase Storage.
- Envío del formulario de Únete y aparición en `/admin/solicitudes`.
- Estados Borrador, Publicado y Programado.
- Descarga del respaldo administrativo.
- `/api/salud`: `estado` operativo, `version` igual al commit esperado y `correo` acorde con la configuración de Resend.
- Cabeceras de seguridad (HSTS, `Content-Security-Policy-Report-Only`) y consola del navegador sin informes de CSP inesperados.
- Ausencia de errores relevantes en Runtime Logs.

## 5. CI/CD

GitHub Actions (`.github/workflows/build.yml`) ejecuta en cada pull request y push a `main`: `npm ci`, `typecheck`, `lint`, `npm test`, `npm run build` y una auditoría informativa de dependencias (`npm audit`, no bloqueante). `.github/dependabot.yml` propone actualizaciones de npm (semanales, agrupadas) y de GitHub Actions (mensuales).

Con la integración Git de Vercel:

- Los cambios en ramas distintas de la rama de producción generan Preview Deployments.
- Los cambios en la rama de producción generan Production Deployments.
- Las nuevas variables solo llegan a despliegues creados después de guardarlas.

Valida primero un Preview de la rama de trabajo. Promueve ese mismo artefacto o integra la rama después de completar la prueba funcional.

## 6. Reversión

Si el despliegue presenta fallos, conserva el último despliegue estable como producción o usa **Rollback** desde Vercel. No elimines variables, clientes OAuth ni claves anteriores hasta confirmar el nuevo flujo de autenticación.
