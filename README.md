# ISIA · Demo académica

Sitio del **semillero de investigación ISIA — Ingeniería de Sistemas Inteligentes y Autónomos**, de la Universidad Nacional de Colombia, sede Manizales.

Esta versión se trabaja en la rama local **Prueba**. Es una demo navegable con contenido ilustrativo pendiente de validación. No corresponde a una convocatoria abierta ni a un directorio confirmado. El trabajo actual no incluye publicación en producción, push ni modificación del repositorio remoto.

## Revisar en local

Requisitos: Node.js 20 o superior y npm.

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
- **Únete**: orientación sobre la sección y estado pendiente del procedimiento y contacto.

El aviso DEMO permanece visible. La demo configura `noindex`, no activa correos ni canales sociales de ejemplo y no incorpora formularios de inscripción, analítica ni integraciones externas de contacto.

## Organización del proyecto

```text
app/                      rutas, metadatos y estilos compartidos
componentes/              navegación, pie, tarjetas y patrones reutilizables
lib/sitio.ts              identidad, modo, navegación y textos propuestos
lib/contenido.ts          lectura, clasificación y validación de Markdown
contenido/
  proyectos/              fichas con detalle
  novedades/              notas con detalle
  reuniones/              agendas en Markdown
  integrantes/            perfiles por rol
  publicaciones/          referencias reales; incluye _plantilla.md
  galeria/                fotografías reales; incluye _plantilla.md
public/imagenes/           recursos gráficos locales
```

El contenido se edita en Markdown. Las instrucciones y formatos completos están en [CONTRIBUTING.md](CONTRIBUTING.md).

## Identidad y movimiento

La paleta está centralizada en `app/globals.css`. El verde provisional `#456A3E` coincide con el relleno `.st2` del escudo SVG disponible; `#35522F` sirve de apoyo. Estos valores **no constituyen un manual institucional oficial**. La tipografía principal es Geist.

El escudo se conserva sin alterar. El recurso provisional procede de [Wikimedia Commons: Escudo de la Universidad Nacional de Colombia (2016)](https://commons.wikimedia.org/wiki/File:Escudo_de_la_Universidad_Nacional_de_Colombia_(2016).svg); la documentación de origen atribuye su autoría a **César Puertas Céspedes**. Se mantiene la atribución visible en el sitio. Antes de sustituirlo, confirma el archivo institucional y sus condiciones de uso.

No se utilizan apariciones, fade-in, desplazamientos, zoom ni parallax asociados al scroll. El contenido es visible desde el renderizado. El componente `Revelar` se conserva únicamente como envoltorio compatible, sin ocultamiento ni animaciones de entrada. Las transiciones de interacción respetan movimiento reducido.

## Sustituir el contenido de ejemplo

El campo `confirmado: true` indica que una ficha ha sido validada editorialmente. No se debe cambiar como trámite para ocultar la etiqueta DEMO: primero hay que reemplazar el contenido, revisar sus fuentes y comprobar los datos.

Si falta el campo o no es el booleano `true`, proyectos, novedades, reuniones e integrantes se consideran ilustrativos. Las reuniones ilustrativas nunca aparecen como próximas reuniones reales ni como encuentros ya celebrados. Las publicaciones y fotografías sin confirmación no se listan.

Falta confirmar para preparar una versión FULL:

- Presentación, objetivos y líneas aprobadas.
- Proyectos reales, alcance, estado, responsables y recursos.
- Novedades y reuniones reales con fecha, hora, modalidad y lugar.
- Identidades, roles, perfiles y fotografías autorizadas de integrantes.
- Publicaciones y enlaces bibliográficos, si existen.
- Fotografías reales con pie, alternativa textual y atribución.
- Procedimiento de vinculación y canal de contacto.
- Ubicación específica: facultad y Campus La Nubia permanecen pendientes.
- Recurso institucional oficial y dirección de publicación autorizada.

No hay cifras de integrantes, año de fundación, dominio ni correo de ejemplo en la configuración final. La ubicación confirmada es **Manizales, Colombia — Universidad Nacional de Colombia, sede Manizales**.

La publicación de una versión FULL requiere una solicitud posterior y una nueva revisión; cambiar datos de contenido no autoriza un despliegue remoto.
