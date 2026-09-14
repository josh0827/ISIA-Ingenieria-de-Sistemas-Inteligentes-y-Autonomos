# Mantenimiento de la demo ISIA

Esta guía describe cómo editar la demo académica en la rama local **Prueba**. El contenido publicado debe utilizar **semillero de investigación**. El proyecto conserva Next.js, TypeScript, CSS modular y Markdown.

## Flujo local

```bash
git branch --show-current
npm run lint
npm run typecheck
npm run build
```

La rama de este trabajo debe ser `Prueba`. Revisa los cambios con `git diff` y prueba la navegación antes de dar por terminada una edición. No hagas push, merges a `main` ni despliegues sin una solicitud posterior. Esta demo no presupone un flujo automático de publicación.

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
estado: propuesta
linea: Percepción y visión por computador
resumen: Descripción explícitamente ilustrativa, sin resultados atribuidos.
integrantes: []
---
```

Campos opcionales: `portada`, con ruta local de una imagen real. Los estados admitidos son `propuesta`, `activo`, `en-curso`, `completado` y `pausado`; conserva `propuesta` para los ejemplos actuales.

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

Las imágenes editoriales deben existir dentro de `public/imagenes/`. Se aceptan AVIF, WebP, PNG, JPEG y SVG locales. Optimiza las fotografías, conserva sus proporciones y utiliza dimensiones explícitas en los componentes para evitar saltos de disposición.

Los enlaces de contenido admiten HTTPS, páginas internas existentes y archivos PDF reales bajo `public/recursos/`. Las rutas a PDF se escriben como `/recursos/nombre.pdf`. Se descartan protocolos ejecutables, dominios reservados para ejemplos, redes sociales genéricas y archivos locales inexistentes.

Esta validación comprueba el formato y la existencia local; no garantiza que un destino externo siga disponible. Compruébalo manualmente antes de confirmar la ficha.

## Panel de administración (/admin)

Además de editar los archivos Markdown, el sitio incluye un panel protegido en `/admin` para crear, editar y eliminar proyectos, novedades, reuniones, integrantes, publicaciones y galería desde el navegador, con inicio de sesión mediante GitHub.

### Cómo funciona

- El contenido se guarda en **Firestore** (una colección por tipo de contenido, con el mismo `slug` como ID de documento). Las validaciones de `lib/contenido.ts` (fechas, enlaces, imágenes locales, etc.) se aplican igual que con Markdown.
- Si el entorno **no** tiene configuradas las credenciales de Firebase, el sitio sigue funcionando leyendo `contenido/*.md` como hasta ahora, y `/admin` muestra un aviso de configuración pendiente en vez de fallar.
- Iniciar sesión con GitHub no basta para editar: el UID de la cuenta debe estar en la colección `editores` de Firestore (documento `editores/<uid>` con, por ejemplo, `{ activo: true }`). Esa colección se administra a mano desde la consola de Firebase, nunca desde el sitio, para controlar quién puede publicar.
- Las páginas que muestran contenido (`/`, `/proyectos`, `/novedades`, `/lineas`, `/integrantes`, `/publicaciones`, `/galeria`, `/reuniones` y sus fichas) se renderizan de forma dinámica (`export const dynamic = 'force-dynamic'`) para que lo publicado desde `/admin` aparezca de inmediato, sin necesidad de un nuevo despliegue.

### Puesta en marcha (una sola vez por entorno)

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/) y habilita **Firestore** (modo nativo).
2. En **Authentication → Sign-in method**, habilita el proveedor **GitHub**. Necesitas una GitHub OAuth App (Settings → Developer settings → OAuth Apps) con el *Authorization callback URL* que Firebase indica en esa misma pantalla; pega ahí el *Client ID* y *Client secret* de esa OAuth App.
3. En **Configuración del proyecto → Tus apps**, registra una Web app para obtener la configuración pública (`apiKey`, `authDomain`, etc.).
4. En **Configuración del proyecto → Cuentas de servicio**, genera una clave privada nueva para el Admin SDK.
5. Copia [.env.local.example](.env.local.example) a `.env.local` y completa ambos bloques de variables. `.env.local` ya está excluido por `.gitignore`: nunca lo subas al repositorio.
6. Añade manualmente en Firestore, colección `editores`, un documento cuyo ID sea el UID de cada persona autorizada a editar (se ve en Authentication tras su primer inicio de sesión), con el campo `activo: true`.
7. (Opcional) Si quieres partir del contenido Markdown existente en vez de capturarlo de nuevo, ejecuta una sola vez:
   ```bash
   npm run migrar-contenido
   ```
   Esto importa `contenido/**/*.md` a Firestore tal cual. Vuelve a ejecutarlo si cambias los Markdown y quieres reflejarlos otra vez (sobrescribe por slug).
8. Reinicia `npm run dev` (o el despliegue) para que las variables de entorno se carguen. Entra a `/admin/iniciar-sesion`.

La subida de imágenes no está incluida en esta primera versión: los campos de imagen siguen esperando una ruta ya existente en `public/imagenes/` (súbela por Git como hasta ahora). El panel valida que el archivo exista antes de guardar.


El cuerpo Markdown pasa por saneamiento HTML y un filtro de recursos. No añadas HTML interactivo, scripts, iframes, formularios ni instrucciones internas de desarrollo a los archivos publicados.

El canal de contacto permanece como **Canal de contacto pendiente de confirmar**. El enlace al repositorio debe identificarse como **Repositorio del sitio**, sin atribuirle un carácter institucional no verificado.

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
