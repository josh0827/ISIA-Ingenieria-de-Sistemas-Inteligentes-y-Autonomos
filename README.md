# ISIA · Demo académica

Sitio del **semillero de investigación ISIA — Ingeniería de Sistemas Inteligentes y Autónomos**, de la Universidad Nacional de Colombia, sede Manizales.

La versión actual es una demo navegable con contenido ilustrativo pendiente de validación. No corresponde a una convocatoria abierta ni a un directorio confirmado. Los cambios deben validarse primero mediante un despliegue Preview antes de promoverlos a producción.

## Revisar en local

Requisitos: Node.js 22 o superior y npm.

```bash
npm ci
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Si el puerto está ocupado, usa el que indique el servidor o inicia con `npm run dev -- --port 3001`.

Para una vista previa de la compilación:

```bash
npm run build
npm start
```

| Comando | Función |
| --- | --- |
| `npm run dev` | Servidor local con recarga de cambios |
| `npm run lint` | ESLint sobre `app`, `componentes` y `lib` |
| `npm run typecheck` | Comprobación TypeScript con `tsc --noEmit` |
| `npm run build` | Compilación de Next.js y generación de páginas |
| `npm start` | Vista previa local de la compilación |

## Páginas

- **Inicio**: identidad, presentación propuesta, objetivos, líneas, proyectos, novedades, integrantes y participación.
- **Líneas**: seis áreas de referencia, con carácter provisional.
- **Proyectos**: cuatro propuestas ilustrativas con páginas de detalle.
- **Novedades**: tres notas ilustrativas, ordenadas por fechas de ejemplo, con detalle.
- **Reuniones**: agenda e historial confirmados separados de las sesiones ilustrativas.
- **Integrantes**: categorías y perfiles pendientes de validación, sin nombres ni fotografías ficticias.
- **Publicaciones y recursos**: estado vacío hasta incorporar referencias confirmadas.
- **Galería**: estado pendiente hasta incorporar fotografías reales y autorizadas.
- **Únete**: intereses investigativos, correo institucional y formulario de manifestación de interés.

El aviso DEMO permanece visible y la demo configura `noindex`. El formulario de Únete registra manifestaciones de interés; no constituye una inscripción ni confirma una convocatoria. Los avisos por correo son opcionales y dependen de la configuración privada de Resend.

## Organización del proyecto

```text
app/                      rutas, metadatos y estilos compartidos
componentes/              navegación, pie, tarjetas y patrones reutilizables
lib/sitio.ts              identidad, modo, navegación y textos propuestos
lib/contenido.ts          lectura, clasificación y publicación editorial
lib/participacion-*       validación y registro de solicitudes
lib/storage/              carga y limpieza de multimedia en Supabase Storage
contenido/
  proyectos/              fichas con detalle
  novedades/              notas con detalle
  reuniones/              agendas en Markdown
  integrantes/            perfiles por rol
  publicaciones/          referencias reales; incluye _plantilla.md
  galeria/                fotografías reales; incluye _plantilla.md
public/imagenes/           recursos gráficos locales
supabase/migrations/       esquema PostgreSQL, seguridad y cambios versionados
```

El contenido se edita en Markdown. Las instrucciones y formatos completos están en [CONTRIBUTING.md](CONTRIBUTING.md).

La información pendiente que debe solicitarse al semillero está organizada en [PLANTILLA_INFORMACION_SEMILLERO.md](PLANTILLA_INFORMACION_SEMILLERO.md). El uso del panel y la matriz de permisos se describen en [MANUAL_ADMIN.md](MANUAL_ADMIN.md).

La entrega de Supabase, Vercel y Google OAuth a una cuenta institucional está documentada en [TRANSFERENCIA_INSTITUCIONAL.md](TRANSFERENCIA_INSTITUCIONAL.md). La guía incluye inventario, permisos, pruebas de aceptación y reversión; no contiene secretos reales.

La configuración y comprobación del despliegue continuo se describe en [DESPLIEGUE_VERCEL.md](DESPLIEGUE_VERCEL.md).

El trámite institucional para obtener una dirección `unal.edu.co` se encuentra en [SOLICITUD_DOMINIO_UNAL.md](SOLICITUD_DOMINIO_UNAL.md).

## Identidad y movimiento

La paleta está centralizada en `app/globals.css`. El verde provisional `#456A3E` y el verde de apoyo `#35522F` se coordinan con la identidad visual disponible. Estos valores **no constituyen un manual institucional oficial**. La tipografía principal es Geist.

La marca de ISIA utiliza dos variantes PNG transparentes en `public/imagenes/logos`: la versión horizontal en el encabezado y como icono, y la versión con texto en la portada y el pie. Sus rutas y recortes están centralizados en `lib/marca.ts`, de modo que puedan reemplazarse sin modificar los componentes de navegación.

No se utilizan apariciones, fade-in, desplazamientos, zoom ni parallax asociados al scroll. El contenido es visible desde el renderizado. El componente `Revelar` se conserva únicamente como envoltorio compatible, sin ocultamiento ni animaciones de entrada. Las transiciones de interacción respetan movimiento reducido.

## Sustituir el contenido de ejemplo

El campo `confirmado: true` indica que una ficha ha sido validada editorialmente. El campo `estadoEditorial` controla si el elemento permanece como borrador, se publica o queda programado. No se debe confirmar contenido como trámite para ocultar la etiqueta DEMO: primero hay que reemplazarlo, revisar sus fuentes y comprobar los datos.

Si falta el campo o no es el booleano `true`, proyectos, novedades, reuniones, integrantes y publicaciones se consideran ilustrativos. Las reuniones ilustrativas nunca aparecen como próximas reuniones reales ni como encuentros ya celebrados. Las publicaciones ilustrativas se identifican y no activan enlaces externos. Todo el contenido ilustrativo puede ocultarse desde la configuración sin eliminar los registros. Las fotografías sin confirmación no se listan.

Falta confirmar para preparar una versión FULL:

- Presentación, objetivos y líneas aprobadas.
- Proyectos reales, alcance, estado, responsables y recursos.
- Novedades y reuniones reales con fecha, hora, modalidad y lugar.
- Identidades, roles, perfiles y fotografías autorizadas de integrantes.
- Publicaciones y enlaces bibliográficos, si existen.
- Fotografías reales con pie, alternativa textual y atribución.
- Procedimiento formal y periodos de vinculación. El canal de contacto confirmado es `isia_man@unal.edu.co`.
- Ubicación específica: facultad y Campus La Nubia permanecen pendientes.
- Recurso institucional oficial y dirección de publicación autorizada.

No hay cifras de integrantes, año de fundación, dominio ni correo de ejemplo en la configuración final. La ubicación confirmada es **Manizales, Colombia — Universidad Nacional de Colombia, sede Manizales**.

La publicación de una versión FULL requiere una solicitud posterior y una nueva revisión; cambiar datos de contenido no autoriza un despliegue remoto.
