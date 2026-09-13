# Implementaciones de la demo ISIA

Este documento resume **todo lo que se implementó** en la rama de trabajo actual: las mejoras visuales/UX, la nueva interfaz de administración basada en Firebase, cómo está organizado el proyecto, cómo funciona cada pieza y qué pasos quedan pendientes para dejar el panel operativo en los próximos días.

> Para la guía puramente técnica de configuración de Firebase paso a paso, ver también la sección *"Panel de administración (/admin)"* en [CONTRIBUTING.md](./CONTRIBUTING.md). Este documento es un resumen ejecutivo/global de todo el trabajo realizado.

---

## 1. Resumen general

El sitio es una demo institucional del semillero **ISIA (Ingeniería de Sistemas Inteligentes y Autónomos)** construida con **Next.js 15 (App Router) + React 19 + TypeScript**. Originalmente todo el contenido (proyectos, novedades, reuniones, integrantes, publicaciones, galería) vivía como archivos Markdown estáticos en [contenido/](./contenido). En esta fase de trabajo se hicieron dos grandes bloques de cambios:

1. **Mejoras visuales y de experiencia de usuario** sobre el sitio público existente.
2. **Un panel de administración web** (`/admin`) que permite crear, editar y borrar todo ese contenido sin tocar código ni Markdown, respaldado por **Firebase (Firestore + Authentication)**.

Ambos bloques están commiteados por separado en el historial de git:

| Commit | Contenido |
|---|---|
| `42f6b9e` | Filtros de contenido, transición de rutas y ajustes de marca/nav |
| `e97f9b7` | Panel de administración completo con Firebase |

---

## 2. Mejoras visuales y de experiencia de usuario

### 2.1 Identidad visual y paleta
- Ajustes de paleta de colores, fondos diagonales y transiciones respetando `prefers-reduced-motion` (`app/globals.css`).
- Nuevo token de color `--gris-nav` para la barra de navegación.

### 2.2 Barra de navegación (`componentes/Nav.tsx` / `Nav.module.css`)
- La barra de navegación (Inicio, Líneas, Proyectos, Novedades, Reuniones, Integrantes, Publicaciones, Galería) ahora es **completamente gris** y los enlaces están en **negrilla**.
- Al estar en una sección, esa opción se resalta en **verde oscuro** (color institucional), indicando claramente en qué parte del sitio se encuentra el usuario.
- En la barra superior se reemplazó la sigla **"ISIA"** por su **nombre completo**: *"Ingeniería de Sistemas Inteligentes y Autónomos"*.
- El botón **"Quiero participar"** ahora está en **negrilla** para destacar la llamada a la acción.

### 2.3 Transición entre páginas (`componentes/Transicion.tsx` / `.module.css`)
- Se añadió una animación de **difuminado (fade/blur)** al cambiar de una sección a otra (Inicio → Líneas → Proyectos, etc.), envolviendo el contenido (`{children}`) en `app/layout.tsx`.
- Mejora la sensación de fluidez sin afectar el rendimiento ni la accesibilidad (respeta *reduced motion*).

### 2.4 Filtros de contenido (`componentes/FiltrosContenido.tsx` / `.module.css`)
- Nuevo componente de cliente reutilizable que agrega **filtros en vivo** a los listados:
  - En **Proyectos**: filtro por *estado* y por *línea de investigación*.
  - En **Novedades**: filtro por *tipo de novedad*.
- Muestra el conteo de resultados y un estado vacío cuando el filtro no arroja resultados.
- Se integró en `app/proyectos/page.tsx` y `app/novedades/page.tsx`.

---

## 3. Panel de administración (`/admin`)

### 3.1 ¿Qué resuelve?
Antes de esta implementación, agregar o editar un proyecto, una novedad, una reunión, un integrante, una publicación o un elemento de galería requería **editar archivos Markdown manualmente y hacer un commit/despliegue**. Ahora existe una interfaz web sencilla en `/admin` donde cualquier persona autorizada (sin conocimientos técnicos) puede:

- Ver listados de cada tipo de contenido.
- Crear nuevos elementos mediante un formulario.
- Editar elementos existentes.
- Eliminar elementos.
- Ver los cambios reflejados **de inmediato** en el sitio público, sin necesidad de un nuevo despliegue.

### 3.2 ¿Cómo funciona por dentro?

**Fuente de datos con respaldo automático (Firestore → Markdown):**
- [lib/contenido.ts](./lib/contenido.ts) es el módulo central de lectura de contenido. Ahora es **asíncrono** y decide de dónde leer:
  - Si el proyecto tiene credenciales de **Firebase configuradas** (variables de entorno `FIREBASE_*`), lee los datos desde **Firestore** (`leerColeccion()`).
  - Si **no** hay credenciales configuradas, sigue leyendo los archivos Markdown de `contenido/` como hasta ahora (`leerCarpeta()`), tal como funcionaba el sitio originalmente.
  - Esto significa que el sitio **nunca se rompe**: funciona igual de bien con o sin Firebase configurado, y la migración es progresiva.
- Cada documento de Firestore tiene exactamente la misma forma que un archivo Markdown parseado (`{slug, datos, cuerpo}`), por lo que toda la lógica de validación existente (fechas, enlaces, imágenes, etc.) se reutiliza sin duplicar código.

**Autenticación (¿quién puede entrar a /admin?):**
- El inicio de sesión se hace con **GitHub** mediante **Firebase Authentication** (`lib/firebase/client.ts`, `componentes/admin/BotonGithub.tsx`).
- Al iniciar sesión, el navegador obtiene un *token* de Firebase y lo envía a `app/api/sesion/route.ts`, que crea una **cookie de sesión segura (httpOnly)** válida por 5 días usando el *Admin SDK* de Firebase (`lib/sesion.ts`).
- Esta cookie es la que el servidor valida en cada visita a `/admin` para saber quién es el usuario.

**Autorización (¿quién puede editar contenido?):**
- Iniciar sesión con GitHub **no es suficiente** para poder guardar cambios. Existe una segunda validación: el UID de la cuenta de GitHub debe estar registrado en una colección de Firestore llamada **`editores`** (`lib/editores.ts`).
- Esto se revisa en dos lugares por seguridad: en la pantalla (`app/admin/(protegido)/layout.tsx`, que muestra "acceso pendiente" si el usuario no está en la lista) y **de nuevo** dentro de cada acción de guardado/borrado en el servidor (`lib/admin/acciones.ts`), para que nadie pueda saltarse el control aunque manipule la interfaz.
- Es decir: **GitHub confirma quién eres, Firestore confirma si puedes editar.**

**Interfaz genérica dirigida por esquema (evita duplicar 6 pantallas):**
- En lugar de construir una pantalla distinta para proyectos, otra para novedades, otra para reuniones, etc., se creó un **único formulario** (`componentes/admin/FormularioContenido.tsx`) y una **única tabla de listado** (`componentes/admin/TablaAdmin.tsx`) que se adaptan según el tipo de contenido.
- Esa adaptación la define [lib/admin/esquemas.ts](./lib/admin/esquemas.ts): por cada colección (proyectos, novedades, reuniones, integrantes, publicaciones, galería) se especifica qué campos tiene, de qué tipo son (texto, texto largo/markdown, fecha, hora, número, sí/no, lista desplegable, lista de valores, URL, imagen, correo) y si son obligatorios.
- Ventaja: agregar un campo nuevo a cualquier colección en el futuro solo requiere editar ese archivo de esquema, no crear pantallas nuevas.

**Guardado y validación (`lib/admin/acciones.ts`, "server actions"):**
- `guardarDocumento(...)`: valida cada campo según su tipo (reutilizando las mismas reglas del sitio público, p. ej. fechas ISO válidas, enlaces seguros, imágenes que ya existan en `public/imagenes/`) y, si todo es correcto, escribe el documento en Firestore. Si algo es inválido, no guarda y muestra el error en el formulario.
- `eliminarDocumento(...)`: borra el documento de Firestore.
- El **slug** (identificador único de la URL, ej. `nodo-de-medida-autonomo`) solo se puede definir al crear un elemento; una vez creado, no se puede cambiar (evita romper enlaces existentes).

**Renderizado dinámico:**
- Todas las páginas públicas que muestran contenido (`/`, `/proyectos`, `/novedades`, `/lineas`, `/integrantes`, `/reuniones`, `/publicaciones`, `/galeria` y sus páginas de detalle) se marcaron como `export const dynamic = 'force-dynamic'`.
- Esto significa que **cada visita** consulta el contenido más reciente (Firestore o Markdown), por lo que cualquier cambio hecho desde `/admin` se ve reflejado de inmediato en el sitio, sin necesidad de re-desplegar.

**Migración de contenido existente:**
- Se creó [scripts/migrar-contenido.mjs](./scripts/migrar-contenido.mjs), ejecutable con `npm run migrar-contenido`, que sube automáticamente **una sola vez** todo el contenido Markdown actual a Firestore, para no perder lo que ya existe al activar Firebase.

### 3.3 Estructura de carpetas relevante

```
app/
  admin/
    layout.tsx                        Metadatos compartidos del panel (título, noindex)
    admin.module.css                  Estilos compartidos del panel
    (publico)/iniciar-sesion/         Página de login (sin protección)
    (protegido)/
      layout.tsx                      Control de acceso: no configurado / no autenticado / no autorizado / autorizado
      page.tsx                        Dashboard con tarjetas a cada colección
      [coleccion]/page.tsx            Listado (tabla) de una colección
      [coleccion]/nuevo/page.tsx      Formulario de creación
      [coleccion]/[id]/page.tsx       Formulario de edición
  api/
    sesion/route.ts                   Crea/borra la cookie de sesión (POST/DELETE)

componentes/admin/
  BotonGithub.tsx / .module.css       Botón de inicio de sesión con GitHub
  CerrarSesionBoton.tsx               Botón de cierre de sesión
  FormularioContenido.tsx / .module.css   Formulario genérico dirigido por esquema
  TablaAdmin.tsx / .module.css        Tabla de listado genérica
  EliminarBoton.tsx                   Botón de eliminar (con confirmación)

lib/
  contenido.ts                        Lectura de contenido (Firestore con respaldo en Markdown)
  editores.ts                         Verifica si un UID está autorizado a editar
  sesion.ts                           Cookie de sesión (crear / leer / cerrar)
  firebase/
    admin.ts                          Inicialización del SDK de administrador (servidor)
    client.ts                         Inicialización del SDK de cliente (navegador)
  admin/
    esquemas.ts                       Definición de campos por colección (fuente de verdad de la UI)
    datos.ts                          Lecturas para el panel (listar/obtener documentos)
    acciones.ts                       "Server actions": guardar y eliminar documentos (con validación y auth)

scripts/
  migrar-contenido.mjs                Migración única de Markdown → Firestore

.env.local.example                    Plantilla de variables de entorno necesarias
```

### 3.4 Colecciones administrables

| Colección | Qué representa |
|---|---|
| `proyectos` | Proyectos de investigación del semillero |
| `novedades` | Noticias/actualizaciones |
| `reuniones` | Reuniones pasadas y próximas |
| `integrantes` | Miembros del semillero |
| `publicaciones` | Publicaciones académicas |
| `galeria` | Elementos visuales de la galería |

Adicionalmente existe una colección de control de acceso, **`editores`**, que **no se administra desde la interfaz** por seguridad — se gestiona manualmente desde la consola de Firebase (ver sección 5).

### 3.5 Limitaciones conocidas de esta versión
- **No hay subida de imágenes** desde el panel: los campos de tipo imagen todavía requieren que el archivo ya exista en `public/imagenes/` (se sigue agregando por Git). Es un candidato claro para una siguiente iteración (ver sección 6).
- La colección `editores` (quién puede editar) se administra manualmente desde la consola de Firebase, no desde `/admin` — es una decisión de seguridad deliberada para evitar que un editor se autoasigne o quite permisos a otros.
- El panel aún no se ha probado con un proyecto de Firebase real (solo se validó el camino "no configurado" y la lógica de código); falta la prueba end-to-end una vez exista el proyecto (ver sección 6).

---

## 4. Cómo funcionará el uso de Firebase en la práctica

Firebase se usa aquí con **dos servicios**:

1. **Firestore** (base de datos): guarda el contenido editable (proyectos, novedades, etc.) y la lista de editores autorizados.
2. **Authentication**: gestiona el inicio de sesión con GitHub para acceder a `/admin`.

### Flujo de uso típico, una vez configurado:

1. Un integrante autorizado entra a `https://sitio.ejemplo.com/admin`.
2. Como no ha iniciado sesión, se le redirige a `/admin/iniciar-sesion` y hace clic en **"Iniciar sesión con GitHub"**.
3. Firebase Authentication valida su cuenta de GitHub y el sitio crea una cookie de sesión.
4. El sistema revisa si su UID está en la colección `editores` de Firestore:
   - Si **no** está → ve una pantalla de "acceso pendiente" (debe pedir que un administrador lo agregue desde la consola de Firebase).
   - Si **sí** está → entra al panel y ve el listado de colecciones disponibles.
5. Puede crear/editar/eliminar elementos usando el formulario genérico; cada guardado valida los datos y los escribe en Firestore.
6. Como el sitio público usa `force-dynamic`, el cambio se ve reflejado **de inmediato** al recargar cualquier página pública, sin necesidad de que alguien despliegue de nuevo el proyecto.
7. Mientras Firebase no esté configurado (no exista `.env.local` con las credenciales), todo el sitio sigue funcionando exactamente igual que antes, leyendo del Markdown en `contenido/`, y `/admin` simplemente informa que falta configuración — nunca genera un error ni deja el sitio caído.

### Costos y mantenimiento
- Firebase (Firestore + Authentication) tiene un **plan gratuito (Spark)** generoso, más que suficiente para el volumen de datos y tráfico de este sitio (decenas de documentos, bajo tráfico).
- No requiere servidores propios ni mantenimiento de infraestructura: es un servicio administrado por Google.

---

## 5. Pasos pendientes para dejarlo operativo (próximos días)

Estos son los pasos que **debe hacer el equipo** (no requieren más código) para pasar de "implementado y probado en código" a "funcionando en producción con datos reales":

1. **Crear un proyecto en Firebase** (https://console.firebase.google.com).
2. **Habilitar Firestore** (modo producción) en ese proyecto.
3. **Configurar el proveedor de inicio de sesión con GitHub** dentro de Firebase Authentication:
   - Crear una **GitHub OAuth App** en la organización/cuenta de GitHub del semillero.
   - Registrar el *Client ID* y *Client Secret* en Firebase Authentication → Sign-in method → GitHub.
4. **Registrar una app web** dentro del proyecto de Firebase para obtener las credenciales públicas del cliente (`apiKey`, `authDomain`, etc.).
5. **Generar una clave de cuenta de servicio** (Service Account) desde Firebase → Configuración del proyecto → Cuentas de servicio, para las credenciales del *Admin SDK* (uso exclusivo del servidor).
6. **Completar `.env.local`** en el servidor de despliegue (o en Vercel/el hosting elegido) a partir de [.env.local.example](./.env.local.example), con las credenciales obtenidas en los pasos 4 y 5.
7. **Ejecutar la migración** una sola vez: `npm run migrar-contenido`, para llevar el contenido Markdown actual a Firestore.
8. **Agregar manualmente en Firestore** (colección `editores`) los UID de las personas que podrán editar contenido (se obtiene el UID la primera vez que inicien sesión, mostrado en la pantalla de "acceso pendiente").
9. **Probar el flujo completo en real**: iniciar sesión, crear/editar/eliminar un elemento de prueba en cada colección, y confirmar que se refleja en el sitio público.
10. *(Opcional, iteración futura)* Evaluar implementar **subida de imágenes** desde el panel (por ejemplo con Firebase Storage) para eliminar la dependencia de agregar imágenes manualmente por Git.

El detalle técnico exacto de cada uno de estos pasos (capturas de dónde hacer clic, nombres exactos de variables de entorno, etc.) está documentado en la sección **"Panel de administración (/admin)"** de [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 6. Validaciones ya realizadas

- `npm run lint`, `npm run typecheck` y `npm run build` se ejecutan sin errores con todo el código de esta fase.
- Se verificó en un servidor local de producción (`npm run start`) que:
  - Sin credenciales de Firebase configuradas, `/admin` muestra un aviso claro de "no disponible" y el resto del sitio sigue funcionando con el contenido Markdown existente.
  - Todas las rutas públicas (`/`, `/proyectos`, `/novedades`, `/lineas`, `/integrantes`, `/reuniones`, `/publicaciones`, `/galeria`) responden correctamente.
  - Los cambios visuales (marca completa, navegación en negrilla con verde oscuro activo, filtros de contenido, transición entre páginas) se ven correctamente en el navegador.
- Lo que **falta por validar** es el flujo real con un proyecto de Firebase activo (inicio de sesión con GitHub, escritura real en Firestore, control de acceso por `editores`), ya que aún no existe un proyecto de Firebase creado — ver sección 5.
