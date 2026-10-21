# Contexto integral del proyecto web ISIA

> Documento de transferencia para continuar el trabajo en otro chat o con otro desarrollador.
> Estado verificado el **16 de octubre de 2026** y actualizado el **21 de octubre de 2026** al integrar el fork en el repositorio principal. No contiene secretos.

## 1. Instrucción para el siguiente chat

Trabaja sobre el repositorio y el estado descritos aquí. Antes de modificar código:

1. Ejecuta `git status --short --branch` y confirma que no existan cambios ajenos.
2. Lee `README.md`, `IMPLEMENTACIONES.md`, `MANUAL_ADMIN.md` y este documento.
3. No sustituyas Supabase ni cambies autenticación, roles o despliegue sin una instrucción explícita.
4. No uses datos ficticios como si fueran información oficial del semillero.
5. Conserva el modo DEMO, `noindex` y el contenido ilustrativo hasta que el semillero valide los datos reales.
6. No publiques secretos, claves, tokens, contraseñas ni archivos `.env`.
7. Ejecuta `npm run typecheck`, `npm run lint`, `npm test` y `npm run build` después de cambios funcionales.

## 2. Identidad y objetivo

El portal corresponde al **Semillero de Investigación ISIA — Ingeniería de Sistemas Inteligentes y Autónomos**, de la Universidad Nacional de Colombia, sede Manizales.

La visión actual del producto es un portal académico de **networking, proyección y reclutamiento**. Busca conectar:

- Estudiantes de pregrado.
- Estudiantes de posgrado.
- Egresados.
- Docentes e investigadores.
- Empresas e instituciones.
- Personas externas interesadas.

El sitio presenta líneas, ideas, proyectos, actividades, oportunidades y capacidades de prototipado. También recibe manifestaciones de interés, preguntas, retos y propuestas de colaboración mediante formularios privados.

El portal no procesa pagos, contratos, inversiones ni propiedad intelectual. Una solicitud no garantiza participación, ejecución de un proyecto, confidencialidad ni relación contractual.

## 3. Repositorio y estado Git

- Repositorio principal: `https://github.com/josh0827/ISIA-Ingenieria-de-Sistemas-Inteligentes-y-Autonomos`. Su rama `main` es la que despliega Vercel.
- Fork de trabajo de Ismael: `https://github.com/sillHD/ISIA-Ingenieria-de-Sistemas-Inteligentes-y-Autonomos`. Los cambios del fork entran al repositorio principal mediante pull request, nunca empujando directamente a `main`.
- `main` está protegida: cada cambio va en una rama propia, pasa la CI (typecheck, lint, pruebas y build) y se fusiona desde GitHub.
- Antes de continuar, ejecutar `git status --short --branch` y sincronizar con `main` del repositorio principal.

Ramas relevantes:

- `main` (repositorio principal): versión integrada y desplegada.
- `integracion/fork-ismael`: trae al repositorio principal el trabajo del fork hasta `fdf2307`.
- `Prueba` y `feat/networking-fases-1-5` (fork): ramas históricas ya integradas.

Últimos hitos:

- `5842d97`: networking completado hasta la fase 9.
- `ea75bbd`: corrección de Server Actions; los archivos con `"use server"` dejaron de exportar objetos no permitidos.
- `0d2736d`: consentimiento de tratamiento de datos más visible y confirmaciones de estado en preguntas administrativas.
- `fdf2307`: la tanda de mejoras descrita en la sección 28, ya confirmada. Es la versión que estaba en producción el 21 de octubre de 2026 (`/api/salud` → `"version":"fdf2307"`), desplegada desde el fork antes de pasar por `main`.

## 4. Estado general del proyecto

### Implementado y validado por código

- Sitio público navegable y adaptable.
- Panel administrativo protegido.
- Supabase PostgreSQL, Auth y Storage.
- Autenticación con correo/contraseña y Google cuando el proveedor está habilitado.
- Autorización basada en la tabla `usuarios_autorizados`.
- Roles `admin`, `editor` y `empresa`.
- Gestión editorial de contenido.
- Estados Borrador, Publicado y Programado.
- Configuración dinámica de navegación y contenido ilustrativo.
- Cierre de sesión y páginas 401/403 estilizadas.
- Proyectos, ideas, servicios de prototipado, novedades, reuniones, integrantes, publicaciones y galería.
- Grupos de trabajo.
- Prácticas, oportunidades e histórico.
- Solicitudes de participación, colaboración y prototipado.
- Preguntas moderadas y respuestas públicas.
- Auditoría administrativa.
- Biblioteca multimedia y cargas a Supabase Storage.
- Exportación JSON de respaldo.
- Webhook de GitHub para forks autorizados.
- Endpoint de salud (`/api/salud`: estado, base de datos, versión, entorno y correo configurado).
- Aviso de privacidad (`/privacidad`).
- Interruptor único de indexación (`NEXT_PUBLIC_SITIO_INDEXABLE`) con robots, sitemap y datos estructurados.
- Límite de envíos por correo y por hora en los formularios.
- CI con typecheck, lint, pruebas, build y auditoría informativa; Dependabot.
- Vercel configurado para región `gru1`.

### Confirmado por el usuario

- La integración de Supabase y la autenticación quedaron validadas funcionalmente.
- El acceso local con Supabase funcionó y posteriormente se corrigió el flujo en Vercel.
- El proyecto está desplegado en Vercel.

### Pendiente de verificación manual final

- Repetir el recorrido completo en el último despliegue de producción.
- Confirmar en Vercel que el deployment activo corresponde al commit esperado (`/api/salud` informa `version`).
- Probar todos los formularios con registros reales de prueba y revisar Supabase.
- Verificar recepción de correos cuando Resend esté configurado.
- Revisar el panel autenticado en móvil y escritorio.
- Completar la lista de `VERIFICACION_FASES_1_9.md` con fecha y responsable.

### Pendiente para pasar de DEMO a FULL

- Validación oficial de presentación, objetivos y líneas.
- Proyectos reales con responsables, alcance y recursos.
- Integrantes reales y permisos para nombres, perfiles y fotografías.
- Reuniones y novedades reales.
- Publicaciones verificadas.
- Fotografías reales con atribución y texto alternativo.
- Procedimiento formal de vinculación.
- Facultad, departamento, ubicación específica y Campus La Nubia confirmados.
- Aval institucional para identidad, logos y dominio.
- Definición institucional de conservación y eliminación de datos personales (el texto de `/privacidad` lo deja como «pendiente de confirmar»).
- Completar `SALIR_DE_DEMO.md` antes de activar la indexación.

## 5. Producción y servicios externos

### Vercel

- Dominio actual conocido: `https://isia-ingenieria-de-sistemas-intelig.vercel.app`
- Framework detectado: Next.js.
- Región configurada: `gru1` (São Paulo).
- Instalación: `npm ci`.
- Build: `npm run build`.
- Las rutas `/api/auth/*` llevan `Cache-Control: no-store`.
- La rama de producción debe verificarse en Vercel; el código actual espera `main`.

### Supabase

- Backend actual: PostgreSQL, Auth y Storage.
- Producción usa todavía el proyecto antiguo `exycbvbiqpzlxvsftfzl` (comprobado el 21 de octubre de 2026 en la cabecera CSP), creado con una cuenta personal.
- El proyecto oficial es `lwchrqsrllwpgeumupbk`, en la cuenta institucional `isia_man@unal.edu.co`. Tiene las cinco migraciones hasta `202610050001`; antes de apuntar Vercel hacia él hay que aplicar `202610140001` y `202610140002` (sección 20) y decidir qué contenido del proyecto antiguo se conserva.
- Supabase fue validado por el usuario.
- El bucket público se llama `imagenes`.
- Las escrituras privilegiadas usan un cliente administrativo exclusivo del servidor.

### Google OAuth

- Google se usa como proveedor OAuth de Supabase cuando está habilitado.
- Google retorna a `https://<project-ref>.supabase.co/auth/v1/callback`.
- Supabase redirige a `/api/auth/callback` de la aplicación.
- La autorización final depende de `usuarios_autorizados`, no del dominio del correo.
- No existe ya una restricción obligatoria `@unal.edu.co`.

### Resend

- Es opcional.
- Envía avisos de participación, colaboración y prototipado al correo del semillero.
- La solicitud se guarda primero; una falla de Resend no elimina el registro.
- El remitente debe pertenecer a un dominio verificado.
- No se utiliza la contraseña de Google Workspace.

### GitHub

- Existe un webhook en `/api/integraciones/github/webhook`.
- Verifica firma HMAC SHA-256.
- Solo acepta el propietario definido en `GITHUB_ALLOWED_OWNER`.
- Un fork válido crea un proyecto como Borrador, no confirmado y En formulación.
- Las entregas son idempotentes mediante el identificador de GitHub.

## 6. Variables de entorno

Usar únicamente nombres vigentes:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
SUPABASE_SECRET_KEY=sb_secret_xxxxx
NEXT_PUBLIC_SITE_URL=https://dominio-del-entorno

# Opcionales
NEXT_PUBLIC_SITIO_INDEXABLE=true   # solo al salir de DEMO; sin ella el sitio es noindex
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL="Sitio ISIA <notificaciones@dominio-verificado>"
GITHUB_WEBHOOK_SECRET=secreto-aleatorio
GITHUB_ALLOWED_OWNER=cuenta-u-organizacion-autorizada
```

No usar como configuración nueva:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY`.
- Claves privadas con prefijo `NEXT_PUBLIC_`.

Los valores reales se administran en `.env.local` y Vercel. Nunca deben entrar al repositorio o a un chat.

## 7. Stack técnico

- Next.js `15.5.25`, App Router.
- React `19.1.1`.
- TypeScript `5.7.2`.
- Node.js `22` o superior.
- Zod `4.1.0`.
- `@supabase/ssr` y `@supabase/supabase-js`.
- CSS Modules y estilos globales; no utiliza Tailwind.
- Geist y Geist Mono mediante `next/font/google`.
- Markdown con `gray-matter`, `remark` y `remark-html`.
- Vercel para frontend y ejecución SSR.
- Supabase para datos, autenticación y archivos.

Comandos:

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

## 8. Arquitectura

```text
app/                        rutas públicas, admin y API
componentes/                UI reutilizable y formularios
componentes/admin/          formularios y shell administrativo
lib/                        dominio, seguridad y acceso a datos
lib/admin/                  Server Actions y consultas administrativas
lib/supabase/               configuración y clientes Supabase
lib/storage/                validación y carga a Supabase Storage
contenido/                  respaldo Markdown y datos ilustrativos
public/imagenes/logos/      logos de ISIA (PNG originales y WebP recortados)
scripts/                    migración de contenido y optimización de logos
supabase/migrations/        esquema y cambios versionados
tests/                      pruebas con node:test
```

### Lectura pública

1. Las páginas llaman funciones de `lib/contenido.ts`, `lib/grupos.ts`, `lib/practicas.ts` o `lib/preguntas.ts`.
2. El sistema intenta leer Supabase.
3. El contenido de `contenido/` funciona como respaldo cuando Supabase no está configurado o no responde.
4. El contenido se normaliza y filtra según confirmación, estado editorial y configuración DEMO.
5. Las páginas públicas usan revalidación de cinco minutos (`revalidate = 300`).

### Escritura administrativa

1. Los formularios llaman Server Actions.
2. La acción valida sesión y rol.
3. Zod valida los datos.
4. El cliente administrativo escribe en Supabase.
5. `revalidatePath` actualiza las rutas afectadas.
6. Las acciones relevantes registran auditoría.

Todo acceso privilegiado a Supabase debe permanecer en `lib/` y en el servidor. Los componentes cliente no deben importar el cliente administrativo.

## 9. Autenticación y autorización

### Sesión

- Supabase Auth mantiene la sesión mediante cookies SSR.
- `middleware.ts` procesa `/admin`, `/api/auth` y `/api/sesion`.
- `supabase.auth.getClaims()` verifica el JWT y permite refrescar cookies.
- `/api/sesion/cerrar` cierra sesión.

### Autorización

Una sesión no basta. La persona debe existir en `public.usuarios_autorizados` y tener `activo = true`.

Roles:

| Función | Admin | Editor | Empresa |
| --- | :---: | :---: | :---: |
| Panel general y contenido | Sí | Sí | No |
| Configuración y grupos | Sí | Sí | No |
| Prácticas | Todas | Todas sin eliminación | Solo propias |
| Eliminar prácticas | Sí | No | No |
| Bandeja | Sí | Sí | No |
| Preguntas | Sí | Sí | No |
| Eliminar solicitudes/preguntas | Sí | No | No |
| Auditoría e integraciones | Sí | No | No |

El rol `empresa` entra a un panel limitado a prácticas. La protección se aplica en el servidor; ocultar opciones del menú no es el único control.

## 10. Datos y tablas principales

- `contenido`: contenido editorial por `coleccion` y `slug`, con JSONB `datos` y Markdown `cuerpo`.
- `configuracion`: navegación y modo de contenido ilustrativo.
- `usuarios_autorizados`: correo, UID de Auth, rol y estado activo.
- `grupos_trabajo`: grupos, integrantes, repositorios, documentos e imágenes.
- `practicas_ofertas`: prácticas, empleos, convocatorias y retos externos.
- `solicitudes_participacion`: formularios de Únete.
- `solicitudes_colaboracion`: apoyo, alianzas y colaboración con proyectos o ideas.
- `solicitudes_prototipado`: retos externos y pruebas de concepto.
- `preguntas_comunidad`: preguntas privadas, respuestas y estado de publicación.
- `auditoria_admin`: acciones administrativas.
- `integraciones_github_eventos`: entregas verificadas y deduplicación.
- Storage `imagenes`: multimedia pública cargada desde el panel.

RLS está habilitado. Las tablas privadas revocan acceso directo a `anon` y `authenticated`; las operaciones se hacen desde el servidor después de autorizar al usuario.

La tabla antigua `editores` aparece en migraciones históricas, pero la autorización vigente usa `usuarios_autorizados`.

## 11. Colecciones editoriales

`lib/contenido.ts` administra estas colecciones:

- `proyectos`.
- `ideas`.
- `servicios`.
- `novedades`.
- `reuniones`.
- `integrantes`.
- `publicaciones`.
- `galeria`.

Los estados editoriales generales son:

- Borrador.
- Publicado.
- Programado.

Los proyectos usan además:

- En formulación.
- Fase inicial.
- Prototipado.

Una idea aprobada puede convertirse en proyecto, pero el proyecto resultante queda como borrador y requiere revisión editorial.

## 12. Rutas públicas

Navegación principal simplificada:

- `/` — Inicio.
- `/semillero` — Hub académico.
- `/proyectos` — Proyectos.
- `/oportunidades` — Hub de oportunidades.
- `/comunidad` — Hub de comunidad.
- `/actividades` — Hub de actividades.
- `/unete` — Participación.

Rutas especializadas:

- `/lineas`.
- `/grupos` y `/grupos/[slug]`.
- `/ideas` y `/ideas/[slug]`.
- `/innovacion`.
- `/prototipado` y `/prototipado/[slug]`.
- `/practicas`.
- `/preguntas`.
- `/novedades` y `/novedades/[slug]`.
- `/reuniones`.
- `/integrantes`.
- `/publicaciones`.
- `/galeria`.

Las secciones desactivadas desaparecen de la navegación y sus páginas aplican `notFound()`. Una pestaña ya abierta necesita navegar o recargarse; no existe sincronización en tiempo real entre pestañas.

## 13. Panel administrativo

Rutas principales:

- `/admin` — resumen.
- `/admin/[coleccion]` — listados editoriales.
- `/admin/[coleccion]/nuevo` — creación.
- `/admin/[coleccion]/[id]` — edición.
- `/admin/[coleccion]/[id]/vista-previa` — vista previa privada.
- `/admin/grupos`.
- `/admin/practicas`.
- `/admin/bandeja`.
- `/admin/preguntas`.
- `/admin/multimedia`.
- `/admin/configuracion`.
- `/admin/auditoria`.
- `/admin/integraciones`.
- `/api/admin/exportar`.

El panel usa rutas dinámicas sin caché. El shell incluye navegación lateral, identificación de sesión, enlace al sitio y cierre de sesión.

## 14. Formularios y privacidad

Formularios públicos:

- Manifestación de interés en `/unete`.
- Colaboración en proyectos e ideas confirmados.
- Propuesta de reto de prototipado.
- Preguntas de la comunidad.

Medidas vigentes:

- Validación Zod.
- Consentimiento obligatorio.
- Campo trampa antispam.
- Límite por correo durante quince minutos y tope global de 30 solicitudes por hora y tabla (`lib/limite-solicitudes.ts`; la regla pura está en `lib/limite-regla.ts`).
- Enlace al aviso de privacidad (`/privacidad`) en los formularios.
- Correos e identidades no se publican.
- Los bloques de tratamiento de datos se resaltan con fondo verde claro, borde verde oscuro y título en negrilla.

## 15. Bandeja y preguntas: estado real

### Bandeja

`/admin/bandeja` consolida:

- Participación.
- Colaboración.
- Retos de prototipado.

El menú lateral muestra cuántas solicitudes están en estado Nueva y la página avisa si alguna tabla no pudo consultarse (ya no se muestra como lista vacía).

Estados administrativos:

- Nueva.
- En revisión.
- Contactada.
- Cerrada.

### Preguntas

Las preguntas se administran en `/admin/preguntas`, no dentro de la bandeja unificada.

Estados:

- Pendiente.
- Publicada (`respondida` en base de datos).
- Archivada.

La última implementación:

- Muestra el estado como una etiqueta visible.
- Confirma cuando una respuesta se guardó pendiente.
- Confirma cuando la respuesta se publicó.
- Confirma cuando la pregunta se archivó o eliminó.
- Revalida `/preguntas` y `/admin/preguntas`.
- El menú lateral muestra cuántas preguntas están pendientes.

## 16. Notificaciones por correo: estado real y limitaciones

Implementado:

- Participación, colaboración y prototipado pueden avisar a `isia_man@unal.edu.co` mediante Resend.
- El remitente usa `RESEND_FROM_EMAIL`.
- El correo del solicitante se usa como `reply_to`.
- La persistencia no depende del éxito del correo.

No implementado todavía:

- Las preguntas de comunidad no generan correo.
- No se notifica al responsable o propietario de un proyecto.
- El modelo de proyecto no define todavía un destinatario privado para notificaciones.
- No se guarda el estado del envío (`pendiente`, `enviado`, `fallido`); `lib/correo.ts` solo registra los fallos en los logs del servidor.
- No existe reintento desde el panel.
- El valor booleano devuelto por Resend no se muestra en el panel.

## 17. Limitaciones técnicas conocidas

1. Las preguntas están separadas de la bandeja general (el menú muestra ambos contadores de pendientes).
2. El límite de envíos no distingue direcciones IP; un atacante con muchos correos puede agotar el tope horario.
3. Falta modelar un responsable privado de notificaciones por proyecto.
4. La entrega de correos no tiene trazabilidad ni reintento.
5. Sentry no está instalado ni configurado actualmente.
6. Algolia está documentado solo como posibilidad futura; PostgreSQL sigue siendo la fuente de verdad.
7. El portal continúa en `noindex` y no debe indexarse mientras sea DEMO; el interruptor es `NEXT_PUBLIC_SITIO_INDEXABLE`.
8. El contenido ilustrativo aún necesita reemplazo o validación.
9. La inspección visual automatizada del último ajuste falló por una restricción local del sandbox de Windows; la compilación sí terminó correctamente.

## 18. Diseño e identidad

- Idioma: español de Colombia.
- Tono: académico, formal, claro y cercano.
- Verde principal provisional: `#456A3E`.
- Verde oscuro: `#35522F`.
- Fondo claro: `#F5F5F7`.
- Texto principal: `#1D1D1F`.
- Tipografía: Geist.
- Logos: PNG originales y versiones WebP recortadas (las que usa el sitio) en `public/imagenes/logos`, generadas con `scripts/optimizar-logos.mjs`.
- Configuración central de marca: `lib/marca.ts`.
- Se retiraron logos de la Universidad del sitio para evitar usos no autorizados.
- No asumir que la paleta constituye un manual oficial de identidad.

Principios visuales:

- Predominio de superficies claras.
- Verde para jerarquía, navegación, acciones y estados.
- Gris para texto normal.
- Verde oscuro y negrilla para títulos relevantes.
- Evitar sobrecarga de logos.
- Diseño adaptable y foco visible.
- Respetar `prefers-reduced-motion`.
- No ocultar contenido mediante animaciones de entrada al hacer scroll.

## 19. Metadatos, indexación y seguridad web

- `lang="es-CO"`.
- Metadatos por página.
- `noindex`, `nofollow` y `noarchive` desde metadata y cabeceras mientras `NEXT_PUBLIC_SITIO_INDEXABLE` no sea `true` (`lib/indexacion.ts`, `next.config.mjs`).
- Con la variable activa: sin `X-Robots-Tag`, `robots.txt` con sitemap, sitemap dinámico y JSON-LD de organización.
- `Strict-Transport-Security`, `Permissions-Policy` y `Content-Security-Policy-Report-Only` (pasar a bloqueante cuando el informe salga limpio); sin `X-Powered-By`.
- Open Graph y Twitter Card con el logo de ISIA.
- `X-Content-Type-Options: nosniff`.
- `X-Frame-Options: SAMEORIGIN`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- En DEMO, `robots.txt` permite el rastreo técnico para que los buscadores lean el `noindex`, y el sitemap queda vacío.
- Tamaño máximo de Server Actions: 10 MB.
- Las imágenes aceptadas son JPG, PNG, WebP y AVIF, con límite funcional de 8 MB.
- Next Image solo acepta el host Supabase configurado.

## 20. Migraciones de Supabase

Aplicar en este orden:

1. `202609260001_backend_inicial.sql`.
2. `202609260002_editores_id.sql`.
3. `202609260003_grupos_roles_practicas.sql`.
4. `202609260004_autorizacion_por_email.sql`.
5. `202610050001_solicitudes_auditoria_editorial.sql`.
6. `202610140001_networking_fases_1_5.sql`.
7. `202610140002_networking_fases_6_9.sql`.

No crear tablas manualmente si una migración ya las define. Verificar primero qué migraciones están aplicadas en el entorno de producción.

## 21. Última verificación técnica conocida

Realizada el 16 de octubre de 2026 sobre el árbol de trabajo (commit base `0d2736d` más los cambios sin confirmar):

- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- `npm test`: **32 pruebas aprobadas, 0 fallos**.
- `npm run build`: correcto; 36 páginas estáticas generadas y rutas dinámicas compiladas.

`package.json` no declara `"type": "module"`; el script de pruebas suprime la advertencia `MODULE_TYPELESS_PACKAGE_JSON` con `--disable-warning`. No se debe cambiar el tipo de módulo sin evaluar todo el proyecto.

Las pruebas de `node:test` no resuelven el alias `@/`: la lógica que se quiera probar debe estar en archivos sin esa importación.

## 22. Error de producción recientemente corregido

Vercel registró:

```text
Error: A "use server" file can only export async functions, found object.
```

Afectaba formularios como `/unete` y colaboración en proyectos. La causa era exportar estados iniciales como objetos desde módulos con `"use server"`. Los estados se movieron a módulos de esquemas y los archivos de acciones ahora exportan únicamente funciones asíncronas en tiempo de ejecución.

La compilación posterior fue correcta. Si el error reaparece, verificar que Vercel esté ejecutando un deployment posterior a `ea75bbd`.

## 23. Trabajo recomendado a continuación

### Prioridad 0 — Verificación del último deployment

1. Confirmar en `/api/salud` que producción sirve el commit de `main` que integra este trabajo.
2. Probar `/unete`, una colaboración, un reto y una pregunta.
3. Revisar que cada registro aparezca en Supabase y en el panel.
4. Probar publicar, guardar pendiente, archivar y eliminar una pregunta.
5. Confirmar que no haya nuevos errores `invalid-use-server-value`.

### Prioridad 1 — Confiabilidad de bandeja (parcialmente resuelta)

Ya implementado: la bandeja muestra un aviso cuando una consulta falla, registra el error en logs y el menú muestra contadores de pendientes (bandeja y preguntas).

Pendiente:

1. Decidir si las preguntas deben integrarse como cuarto origen en `/admin/bandeja` o mantenerse separadas.
2. Añadir pruebas para tablas ausentes, error de consulta y estado vacío real (requiere extraer lógica sin alias `@/`).

### Prioridad 2 — Notificaciones completas

1. Definir responsable privado de notificaciones por proyecto.
2. Notificar por separado al semillero y al responsable cuando exista colaboración o apoyo.
3. Evitar revelar destinatarios entre sí.
4. Añadir correo para preguntas si el semillero lo aprueba.
5. Guardar estado y fecha de entrega del correo.
6. Añadir reintento administrativo.

### Prioridad 3 — Ajustes visuales solicitados

1. Usar verde oscuro y negrilla en títulos de descripciones; conservar gris en párrafos.
2. Convertir el selector de Proyectos / Ideas y retos / Prototipado en una barra verde oscura con estado activo accesible.
3. Dar más presencia al verde en proyectos, oportunidades y comunidad mediante bordes, etiquetas y fondos suaves.
4. Revisar contraste y comportamiento móvil sin convertir todas las tarjetas en bloques verdes sólidos.

### Prioridad 4 — Paso institucional

1. Completar responsables técnico, editorial y docente.
2. Preparar información real mediante `PLANTILLA_INFORMACION_SEMILLERO.md`.
3. Solicitar aval, plantilla y dominio siguiendo `SOLICITUD_DOMINIO_UNAL.md`.
4. Transferir Supabase, Vercel, Google Cloud y repositorio a control institucional siguiendo `TRANSFERENCIA_INSTITUCIONAL.md`.
5. Solo después retirar `noindex` (definiendo `NEXT_PUBLIC_SITIO_INDEXABLE=true` según `SALIR_DE_DEMO.md`) y cambiar de DEMO a FULL.

## 24. Verificación manual mínima

### Público

- Inicio, hubs y navegación móvil.
- Proyectos, ideas, prototipado y oportunidades.
- Secciones desactivadas inaccesibles también por URL directa.
- Formularios con validación, consentimiento destacado y mensajes accesibles.
- Ausencia de correos privados y contenido ficticio presentado como real.
- Estados vacíos de publicaciones y galería.

### Admin

- Login por correo/contraseña y Google.
- Rechazo de usuario inexistente o inactivo.
- Permisos de admin, editor y empresa.
- CRUD editorial y vista previa.
- Carga y eliminación segura de multimedia.
- Bandeja y cambio de estados.
- Preguntas: pendiente, publicada, archivada y eliminada.
- Cierre de sesión sin acceso por caché.
- Auditoría, integraciones y respaldo.

### Servicios

- `/api/salud` (200 operativo; `version` y `correo` coherentes con el entorno).
- `/privacidad`, `/robots.txt` y `/sitemap.xml`.
- Supabase Auth, PostgreSQL y Storage.
- Resend, si se habilita.
- Webhook GitHub, si se habilita.
- Logs de Runtime de Vercel sin errores relevantes.

## 25. Documentación que debe consultarse

- `README.md`: visión general y ejecución local.
- `IMPLEMENTACIONES.md`: arquitectura y funciones actuales.
- `MANUAL_ADMIN.md`: operación y permisos.
- `PLANTILLA_INFORMACION_SEMILLERO.md`: datos reales pendientes.
- `PLAN_NETWORKING_FASES_0_5.md`: arquitectura, networking, ideas, prototipado y oportunidades.
- `PLAN_NETWORKING_FASES_6_9.md`: innovación, GitHub, preguntas y operación.
- `VERIFICACION_FASES_1_9.md`: aceptación funcional acumulada.
- `DESPLIEGUE_VERCEL.md`: variables, OAuth y CI/CD.
- `SALIR_DE_DEMO.md`: lista para retirar el modo DEMO y activar la indexación.
- `TRANSFERENCIA_INSTITUCIONAL.md`: entrega de plataformas.
- `SOLICITUD_DOMINIO_UNAL.md`: trámite institucional.
- `CONTRIBUTING.md`: estructura del contenido Markdown.

## 26. Restricciones y decisiones que deben conservarse

- Usar “semillero de investigación”, no “grupo de investigación”, para referirse a ISIA.
- Mantener español de Colombia y estilo formal.
- No inventar integrantes, publicaciones, reuniones, cifras, fechas de fundación, convocatorias ni beneficios.
- No usar imágenes de stock o generadas como evidencia de personas, laboratorios o proyectos reales.
- No activar enlaces de correo o redes ficticias.
- No publicar correos de propietarios o remitentes.
- No exponer SDK administrativo o claves privadas al cliente.
- No convertir un fork en publicación automática.
- No procesar pagos o promesas de inversión.
- No modificar infraestructura remota, producción o secretos sin autorización explícita.
- Resolver decisiones reversibles con criterio técnico y validar antes de desplegar.

## 27. Resumen para iniciar la siguiente tarea

El proyecto está funcionalmente avanzado, conectado a Supabase y desplegado en Vercel (producción sirve `fdf2307`, que ya incluye las mejoras de la sección 28). Las nueve fases de networking están implementadas en código. La autenticación y Supabase fueron validadas por el usuario; las comprobaciones automatizadas pasan. Los últimos cambios corrigieron las Server Actions que fallaban en Vercel y mejoraron consentimiento y confirmaciones administrativas.

El siguiente trabajo debería comenzar por pasar producción al Supabase oficial (sección 5), verificar el deployment y luego resolver las notificaciones a responsables de proyectos. Los ajustes visuales de mayor presencia del verde siguen siendo una mejora solicitada, no una implementación confirmada. El sitio debe permanecer en modo DEMO y `noindex` hasta completar contenido, avales y dominio institucional.

## 28. Mejoras posteriores a `0d2736d`

Confirmadas en `fdf2307` y publicadas en producción. Resumen:

- Seguridad y operación: HSTS, Permissions-Policy, CSP en modo informe, `/api/salud` ampliado, fallo del webhook de GitHub devuelve 500 y permite reintento, correo con registro de errores, exportación sin correos de contacto para editores.
- Anti-abuso: límite por correo y por hora (`lib/limite-solicitudes.ts`, `lib/limite-regla.ts`, con pruebas).
- Indexación: `lib/indexacion.ts`, `app/robots.ts`, `app/sitemap.ts`, JSON-LD y Open Graph; `SALIR_DE_DEMO.md`.
- Privacidad: `app/privacidad/page.tsx` y enlaces en pie y formularios.
- Panel: contadores de pendientes, mensajes de resultado, aviso de errores en bandeja, auditoría paginada con filtros.
- Público: `app/error.tsx`, página 404 con salidas útiles, filtros en URL, sección de colaboración en inicio, iconos por línea, avisos de nueva pestaña para lectores de pantalla, `generateStaticParams` en detalles.
- Marca: logos WebP recortados y `scripts/optimizar-logos.mjs`.
- Calidad: CI ampliada, `.github/dependabot.yml`, script de pruebas sin advertencia.

Decisiones que siguen abiertas: límite por IP, ajustes de paleta, persistencia del estado de envío de correos (requiere migración) y cualquier cambio de textos institucionales.
