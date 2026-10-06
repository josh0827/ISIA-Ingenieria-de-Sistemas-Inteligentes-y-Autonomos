# Mantenimiento de la demo ISIA

Esta guía describe cómo editar la demo académica. El contenido publicado debe utilizar **semillero de investigación**. El proyecto conserva Next.js, TypeScript, CSS modular, PostgreSQL y Markdown como respaldo.

## Flujo local

```bash
git branch --show-current
npm run lint
npm run typecheck
npm run build
```

Trabaja en una rama de cambio y valida su Preview antes de integrarla a la rama de producción. Revisa los cambios con `git diff` y prueba la navegación antes de dar por terminada una edición. No publiques cambios sin completar la revisión funcional y editorial.

Coordina los archivos compartidos cuando varias personas trabajen a la vez. La configuración general vive en `lib/sitio.ts`; las reglas de lectura y los tipos, en `lib/contenido.ts`.

## Regla de veracidad

Todo archivo publicable debe declarar `confirmado: false` mientras contenga datos ilustrativos. El sistema solo reconoce como confirmación el booleano `true`, sin comillas. Su presencia significa que una persona responsable ya revisó la información; el programa no puede verificar por sí mismo que un proyecto o una identidad sean reales.

Para cambiar a `confirmado: true`:

1. Sustituye el texto de ejemplo por información confirmada.
2. Comprueba nombres, fechas, estados, participantes y destinos.
3. Revisa permisos de uso de fotografías y atribuciones.
4. Asegúrate de que la etiqueta y el contexto público correspondan al contenido.
5. Ejecuta las comprobaciones y revisa la página en navegador.

Conserva evidencia de la validación en el registro editorial que use el equipo. No publiques información privada dentro del frontmatter.

Las fechas de ejemplo se identifican junto a cada ficha. No presentes proyectos activos, resultados, cifras, fundación, requisitos de ingreso, beneficios, acceso a laboratorios ni convocatorias sin confirmación. Los perfiles ilustrativos muestran roles pendientes, no nombres inventados.

## Editar Markdown

Los archivos van en `contenido/<seccion>/`. Usa nombres en minúsculas y guiones. El nombre determina el slug de los detalles de proyectos y novedades. Los archivos cuyo nombre empieza con `_` son plantillas y no se publican.

El frontmatter va entre dos líneas `---`. Después se escribe el cuerpo Markdown. Usa títulos de segundo nivel (`##`) en el cuerpo: la página ya proporciona el `h1`.

### Proyecto

```yaml
---
titulo: Título de la propuesta ilustrativa
confirmado: false
estado: En formulación
linea: Percepción y visión por computador
resumen: Descripción explícitamente ilustrativa, sin resultados atribuidos.
integrantes: []
---
```

Campos opcionales: `portada`, con una imagen real y autorizada. Los estados admitidos son `En formulación`, `Prototipado` y `Fase inicial`; el panel los valida con Zod.

La línea debe coincidir con un título de `LINEAS` en `lib/sitio.ts`. `integrantes` admite slugs de perfiles confirmados. En proyectos ilustrativos no se vinculan participantes ni fotografías.

Describe la pregunta, el alcance, una posible forma de evaluación y los datos pendientes. No redactes métodos propuestos como si ya hubieran producido resultados.

### Novedad

```yaml
---
titulo: Título de la nota ilustrativa
confirmado: false
fecha: "2026-09-08"
tipo: divulgacion
resumen: Contenido de ejemplo para demostrar la presentación de novedades.
---
```

Tipos: `divulgacion`, `convocatoria`, `evento`, `logro` y `publicacion`. La demo utiliza divulgación para evitar anuncios ficticios. `imagen` y `autor` son opcionales y se omiten de la presentación mientras la ficha no esté confirmada.

La fecha debe ser válida y usar `YYYY-MM-DD`; escríbela entre comillas. Las novedades se ordenan de la más reciente a la más antigua. En una nota ilustrativa también debe quedar claro que la fecha es de ejemplo.

### Reunión

```yaml
---
titulo: Ejemplo de sesión de lectura
confirmado: false
fecha: "2026-09-19"
hora: "16:00"
modalidad: presencial
lugar: Lugar pendiente de confirmar
resumen: Agenda ilustrativa; no es una reunión convocada.
---
```

Modalidades: `presencial`, `virtual`, `hibrida` y `pendiente`. Si falta una modalidad válida, se utiliza `pendiente`. La hora debe usar `HH:mm`. Campos opcionales: `ponente` y `enlace`; no se activan en reuniones ilustrativas.

La agenda de ejemplo puede demostrar fecha, hora y modalidad, siempre con la advertencia junto al bloque. La agenda real usa únicamente fichas confirmadas. `proximaReunion()` y `reunionesPasadas()` excluyen todos los ejemplos y comparan las fechas con el día actual en Colombia.

### Integrante

```yaml
---
nombre: Perfil por confirmar
confirmado: false
rol: estudiante
area: Intereses pendientes de validación
enlaces: {}
---
```

Roles: `director`, `investigador`, `estudiante` y `egresado`; son categorías de presentación y deben validarse. El rol técnico `director` puede mostrarse públicamente como coordinación.

Solo los perfiles confirmados pueden mostrar `foto` y `enlaces.github`, `enlaces.linkedin` o `enlaces.correo`. No añadas destinos genéricos de redes sociales ni correos de prueba.

### Publicaciones y recursos

Parte de [contenido/publicaciones/_plantilla.md](contenido/publicaciones/_plantilla.md). Campos requeridos para una referencia visible:

- `confirmado: true`.
- `titulo`.
- `anio` numérico válido.
- `autores`, como lista no vacía.
- `tipo`, por ejemplo el tipo real del material.
- `enlace` opcional, hacia el recurso real.

El listado se organiza de año más reciente a más antiguo. No se generan DOI ni enlaces de descarga. Sin referencias confirmadas se mantiene el estado vacío.

### Galería

Parte de [contenido/galeria/_plantilla.md](contenido/galeria/_plantilla.md). Campos requeridos:

- `confirmado: true`.
- `titulo`.
- `imagen`, como ruta a un archivo existente en `public/imagenes/`.
- `alt`, descripción textual de la imagen.
- `pie`, contexto confirmado y atribución cuando corresponda.

`anio` es opcional. No uses el escudo ni ilustraciones conceptuales como si fueran fotografías del semillero. Sin fotografías reales se mantiene el estado pendiente.

## Recursos y destinos

Los Markdown pueden conservar imágenes existentes dentro de `public/imagenes/`. Desde el panel se aceptan AVIF, WebP, PNG y JPEG de máximo 8 MB; las cargas se guardan en el bucket público `imagenes` de Supabase Storage y PostgreSQL registra su URL pública. Optimiza las fotografías y confirma sus permisos de uso antes de publicarlas.

Los enlaces de contenido admiten HTTPS, páginas internas existentes y archivos PDF reales bajo `public/recursos/`. Las rutas a PDF se escriben como `/recursos/nombre.pdf`. Se descartan protocolos ejecutables, dominios reservados para ejemplos, redes sociales genéricas y archivos locales inexistentes.

Esta validación comprueba el formato y la existencia local; no garantiza que un destino externo siga disponible. Compruébalo manualmente antes de confirmar la ficha.

## Panel de administración (/admin)

Además de editar los archivos Markdown, el sitio incluye un panel protegido en `/admin` para crear, editar y eliminar proyectos, novedades, reuniones, integrantes, publicaciones y galería desde el navegador, con inicio de sesión por correo y contraseña.

### Cómo funciona

- El contenido se guarda en la tabla **`contenido` de PostgreSQL**. Cada fila se identifica mediante `coleccion` y `slug`, y conserva los datos editables en JSONB.
- Si Supabase no está configurado o no responde, el sitio público sigue leyendo `contenido/*.md`; `/admin` muestra un aviso de configuración pendiente.
- Tener una cuenta no basta para editar: la cuenta necesita una fila activa en la tabla `usuarios_autorizados` con rol `admin` o `editor` (el rol `empresa` solo gestiona prácticas). Esta tabla se administra desde Supabase Dashboard, fuera del sitio; los permisos de cada rol están en [MANUAL_ADMIN.md](MANUAL_ADMIN.md).
- Las páginas públicas se regeneran como máximo cada 5 minutos (`revalidate = 300`), y cada guardado en `/admin` las revalida al momento con `revalidatePath`. Lo publicado aparece sin un nuevo despliegue.

### Puesta en marcha (una sola vez por entorno)

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard).
2. Ejecuta en orden los archivos de `supabase/migrations/` desde SQL Editor o con Supabase CLI. Crean las tablas (entre ellas `usuarios_autorizados`, las solicitudes de participación y la auditoría), activan RLS y preparan el bucket `imagenes`.
3. En **Authentication → Sign In / Providers**, deja activo Email y desactiva **Allow new users to sign up**: las cuentas las crea un administrador en **Authentication → Users**. Google es opcional; si lo activas (cliente OAuth web en Google Cloud con el callback de Supabase y `/api/auth/callback` en las URLs autorizadas), el botón aparece solo en la pantalla de acceso.
4. Copia [.env.local.example](.env.local.example) a `.env.local` y completa la URL, la clave publishable (`sb_publishable_...`) y la secret (`sb_secret_...`). `.env.local` está excluido por `.gitignore`; nunca lo subas.
5. Crea la cuenta de cada persona en **Authentication → Users** (con **Auto Confirm User**) y añade su correo en `public.usuarios_autorizados` con su `rol` (`admin`, `editor` o `empresa`) y `activo = true`. En su primer inicio de sesión, la cuenta se vincula sola a esa fila.
6. En la fila `configuracion/navegacion`, el mapa `secciones` controla qué enlaces aparecen en el menú público. También puede editarse desde **Panel Admin → Navegación pública**.
7. (Opcional) Si quieres partir del contenido Markdown existente en vez de capturarlo de nuevo, ejecuta una sola vez:
   ```bash
   npm run migrar-contenido
   ```
   Esto importa `contenido/**/*.md` a PostgreSQL. La operación actualiza por colección y slug, así que **sobrescribe lo que se haya editado desde `/admin`** en los elementos con el mismo slug. Con el panel en uso, la fuente es PostgreSQL y los Markdown quedan como respaldo.
8. Reinicia `npm run dev` (o el despliegue) para cargar las variables. Entra a `/admin/iniciar-sesion`.

Los campos de imagen usan `lib/storage/upload.ts` y el bucket público `imagenes`. Para conservar una imagen al editar, deja el selector vacío. No expongas `SUPABASE_SECRET_KEY` al navegador.


El cuerpo Markdown pasa por saneamiento HTML y un filtro de recursos. No añadas HTML interactivo, scripts, iframes, formularios ni instrucciones internas de desarrollo a los archivos publicados.

El correo de contacto confirmado es `isia_man@unal.edu.co`. El enlace al repositorio debe identificarse como **Repositorio del sitio**, sin atribuirle un carácter institucional no verificado.

Las manifestaciones de interés se gestionan desde `/admin/solicitudes`. No exportes ni reutilices estos datos fuera del propósito informado en el formulario. Los originales de fotografías y respaldos editoriales pueden conservarse en el Drive institucional; las copias publicadas deben permanecer en Supabase Storage.

## Presentación y accesibilidad

- Conserva la paleta centralizada de `app/globals.css` y la tipografía Geist.
- No modifiques el escudo provisional ni retires la atribución de [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Escudo_de_la_Universidad_Nacional_de_Colombia_(2016).svg), autor atribuido **César Puertas Céspedes**.
- No incorpores apariciones al scroll, opacidad inicial cero, transformaciones de entrada, escalonamientos ni parallax.
- `Revelar` es un envoltorio sin efectos; no reintroduzcas observadores para ocultar contenido.
- Usa encabezados jerárquicos, foco visible, enlaces descriptivos y alternativas textuales.
- Revisa escritorio, tableta y móvil, incluyendo teclado y menú móvil.
- Mantén `noindex` en modo DEMO y evita datos ficticios en metadatos o datos estructurados.

## Comprobación antes de entregar

Ejecuta lint, TypeScript y compilación. Después revisa en navegador la portada, el menú, los CTA **Ver los proyectos** y **Quiero participar**, todos los listados y detalles, y los estados pendientes.

Comprueba que no existan desbordamientos horizontales, errores relevantes de consola ni destinos ficticios activos. Todo el contenido debe ser visible desde el renderizado, incluso antes de desplazarse.

Para preparar una versión FULL, confirma primero la información indicada en [README.md](README.md). No basta con retirar el aviso DEMO.
