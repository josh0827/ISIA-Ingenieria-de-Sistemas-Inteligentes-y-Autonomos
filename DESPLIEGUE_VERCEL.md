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

Marca `SUPABASE_SECRET_KEY` como **Sensitive** en Production y Preview. El código conserva compatibilidad con `SUPABASE_SERVICE_ROLE_KEY`, pero la clave moderna es la opción recomendada. Vercel no permite esa clasificación en Development; limita el acceso al proyecto y evita compartir el valor.

El código conserva compatibilidad con `NEXT_PUBLIC_SUPABASE_ANON_KEY` para proyectos antiguos, pero basta con configurar una de las dos claves públicas. En instalaciones nuevas usa `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Los previews no deberían escribir en la base de producción. Cuando sea posible, usa un proyecto Supabase separado o variables de Preview limitadas a una rama de pruebas.

## 3. Callbacks OAuth

En Google Cloud, el cliente OAuth Web debe tener:

```text
Origen autorizado:
https://isia-gamma.vercel.app

URI de redirección autorizada:
https://PROJECT_REF_AQUI.supabase.co/auth/v1/callback
```

En **Supabase → Authentication → URL Configuration**:

```text
Site URL:
https://isia-gamma.vercel.app

Redirect URLs:
https://isia-gamma.vercel.app/api/auth/callback
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

Después del despliegue verifica:

- `/` y `/practicas` en móvil y escritorio.
- `/admin/iniciar-sesion` y el inicio con Google.
- Redirección de `admin` y `editor` hacia `/admin`.
- Redirección de `empresa` hacia `/admin/practicas`.
- Creación, edición y desactivación de contenido.
- Carga de imágenes en Supabase Storage.
- Ausencia de errores relevantes en Runtime Logs.

## 5. CI/CD

Con la integración Git de Vercel:

- Los cambios en ramas distintas de la rama de producción generan Preview Deployments.
- Los cambios en la rama de producción generan Production Deployments.
- Las nuevas variables solo llegan a despliegues creados después de guardarlas.

Valida primero el Preview de la rama `Prueba`. Promueve ese mismo artefacto o integra la rama después de completar la prueba funcional.

## 6. Reversión

Si el despliegue presenta fallos, conserva el último despliegue estable como producción o usa **Rollback** desde Vercel. No elimines variables, clientes OAuth ni claves anteriores hasta confirmar el nuevo flujo de autenticación.
