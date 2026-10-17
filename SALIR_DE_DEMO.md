# Lista de verificación para salir del modo DEMO

El sitio es DEMO mientras no exista validación del semillero. Este documento
enumera lo que debe cumplirse antes de permitir la indexación. Ninguna casilla
se marca sin evidencia (acta, correo o respuesta de quien valida).

## 1. Contenido

- [ ] Presentación, objetivos y líneas de investigación validados (`lib/sitio.ts`).
- [ ] Proyectos, ideas, novedades y reuniones con `confirmado: true` y datos reales.
- [ ] Integrantes y grupos con autorización de cada persona para publicar su nombre y foto.
- [ ] Procedimiento de vinculación y fechas de ingreso definidos (`/unete`).
- [ ] Contenido ilustrativo ocultado o eliminado (Configuración → contenido de ejemplo).

## 2. Legal y datos personales

- [ ] Aviso de privacidad (`/privacidad`) revisado por la Universidad, incluido el plazo de conservación.
- [ ] Texto de autorización de los formularios revisado.
- [ ] Responsable del tratamiento y canal de derechos confirmados.

## 3. Operación

- [ ] Dominio definitivo y `NEXT_PUBLIC_SITE_URL` actualizado (HTTPS, sin `/` final).
- [ ] Correo de avisos (Resend) configurado y probado: `/api/salud` muestra `"correo": true`.
- [ ] Al menos dos administradores activos en `usuarios_autorizados`.
- [ ] Respaldo descargado desde el panel y guardado fuera de Vercel.
- [ ] Cabecera `Content-Security-Policy-Report-Only` revisada sin errores en la consola; si está limpia, pasar a `Content-Security-Policy` (`next.config.mjs`).

## 4. Activación

1. Definir `NEXT_PUBLIC_SITIO_INDEXABLE=true` en Vercel (producción) y volver a desplegar.
2. Comprobar: sin `noindex` en el HTML, sin `X-Robots-Tag`, `/robots.txt` con `Sitemap:` y `/sitemap.xml` con URLs.
3. Registrar el dominio en Google Search Console y enviar el sitemap.

Para volver a DEMO basta quitar la variable y redesplegar.
