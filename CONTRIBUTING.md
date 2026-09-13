# Cómo trabajar en este repositorio

Este sitio lo monta un equipo, no una persona. Casi todos los problemas de trabajar en grupo sobre
el mismo repositorio salen de dos personas editando el mismo archivo a la vez, así que el proyecto
está partido para que eso no pase.

---

## 1. Reparto de secciones

Cada sección es una carpeta propia dentro de `app/`, con su `page.tsx` y, si hace falta, su propio
`.module.css`. **Dos personas nunca tienen que editar el mismo archivo.**

| Sección | Carpeta | Responsable |
|---|---|---|
| Reuniones | `app/reuniones/` | por asignar |
| Líneas de investigación | `app/lineas/` | por asignar |
| Integrantes | `app/integrantes/` | por asignar |
| Publicaciones | `app/publicaciones/` | por asignar |
| Galería | `app/galeria/` | por asignar |
| Únete | `app/unete/` | por asignar |

Apunta tu nombre en esta tabla cuando cojas una sección.

### Archivos compartidos: no los toques por tu cuenta

Estos los usa todo el mundo, y un cambio ahí afecta a todas las secciones a la vez:

```
app/globals.css          tokens de color, tipografía, utilidades
app/layout.tsx           navegación, pie, metadatos
app/listados.module.css  rejillas compartidas
app/detalle.module.css   páginas de detalle
componentes/*            piezas compartidas
lib/*                    datos y configuración
```

Si de verdad necesitas cambiar algo ahí, dilo primero en el grupo. Si solo necesitas un estilo para
tu sección, créate un `.module.css` dentro de tu carpeta.

---

## 2. Flujo de trabajo

```bash
git checkout main
git pull                              # empieza siempre desde lo último
git checkout -b seccion/reuniones     # una rama por sección
# ... trabajas ...
npm run build                         # TIENE que pasar antes de subir
git add .
git commit -m "Monta la agenda de reuniones"
git push -u origin seccion/reuniones
```

Después, en github.com, abrir un **pull request** hacia `main`.

Vercel genera automáticamente una dirección de vista previa para tu pull request. Pega ese enlace en
la descripción: así el grupo puede ver tu sección funcionando antes de mezclarla, sin bajarse nada.

**Nunca subas directamente a `main`.**

---

## 3. Cómo montar tu sección

Abre `app/novedades/page.tsx`. Está terminada y hace exactamente lo que tú necesitas hacer:

```tsx
import { Seccion, TituloSeccion } from '@/componentes/Base'
import { listarNovedades } from '@/lib/contenido'
import estilos from '../listados.module.css'

export default function PaginaNovedades() {
  const novedades = listarNovedades()

  return (
    <Seccion className={estilos.primeraSeccion}>
      <TituloSeccion indice="Novedades" titulo="Lo que pasa en el grupo" descripcion="..." />
      <div className={estilos.rejilla}>
        {novedades.map((n) => <TarjetaNovedad key={n.slug} novedad={n} />)}
      </div>
    </Seccion>
  )
}
```

Tu página debe empezar igual: `<Seccion className={estilos.primeraSeccion}>`. Esa clase deja el
hueco que necesita la barra de navegación, que es fija.

Cuando tu sección esté lista, **borra el `<Pendiente>`** de tu `page.tsx`.

### Piezas que ya tienes hechas

De `@/componentes/Base`:

| Pieza | Para qué |
|---|---|
| `<Seccion>` | Envuelve la sección con el ancho y el espaciado del sitio. `alterna` la pinta sobre el gris claro |
| `<TituloSeccion>` | Encabezado de sección, con `indice`, `titulo`, `descripcion` y `centrado` |
| `<Boton href variante>` | Enlace de acción. `principal` o `sutil` |
| `<Etiqueta valor>` | Pinta un estado, tipo o modalidad con su color fijo |
| `<Fecha iso>` | Formatea una fecha igual en todo el sitio |
| `<VerTodo href>` | El enlace que cierra un bloque |

De `@/componentes/Tarjetas`: `<TarjetaNovedad>`, `<TarjetaProyecto>`, `<TarjetaIntegrante>`.

De `@/componentes/Revelar`: envuelve un bloque para que aparezca al hacer scroll. Con varios
hermanos, escalona el retardo: `<Revelar retardo={i * 70}>`.

De `@/componentes/Iconos`: los iconos SVG. **En este sitio no se usan emojis.** Si necesitas uno
nuevo, añádelo ahí siguiendo el mismo patrón.

De `@/componentes/Escudo`: el escudo institucional. `<Escudo alto={32} />`, y `placa` le pone un
fondo claro detrás para cuando va sobre un fondo oscuro.

De `@/lib/contenido`:

```ts
listarNovedades(limite?)   obtenerNovedad(slug)
listarReuniones()          proximaReunion()      reunionesPasadas()
listarProyectos(limite?)   obtenerProyecto(slug)
listarIntegrantes()
markdownAHtml(texto)
```

### Reglas de estilo

- Colores y espaciados **siempre desde los tokens** (`var(--verde)`, `var(--aire)`), nunca valores sueltos
- **Un solo acento**: el verde `--verde`, y con cuentagotas. El rojo `--rojo` solo para una
  convocatoria abierta. Si el rojo aparece en tres sitios, deja de significar nada
- Separa con **aire y líneas de un píxel**, no metiendo todo en tarjetas con borde
- Todo lo que se pueda pulsar necesita un estado al pasar el cursor. Desplazamientos de 2 a 4
  píxeles con `var(--curva)`, nunca saltos bruscos
- Toda rejilla va centrada, horizontal y verticalmente
- Revisa tu sección a **390 px de ancho** antes de abrir el pull request
- Nada de librerías nuevas sin hablarlo antes: el sitio no usa ninguna y así se queda ligero

---

## 4. Formato de los archivos de contenido

Lo de arriba, entre las dos líneas de `---`, se llama frontmatter. Los nombres de los campos van tal
cual; solo se cambia lo que va después de los dos puntos. Debajo del segundo `---` se escribe el
texto largo en Markdown normal.

Las fechas van **siempre** como `YYYY-MM-DD`.

### Novedad · `contenido/novedades/2026-10-15-titulo-corto.md`

```markdown
---
titulo: Título de la novedad
fecha: 2026-10-15
tipo: convocatoria
resumen: Una o dos frases. Es lo que se lee en la tarjeta de la portada.
imagen: /imagenes/novedades/archivo.jpg
autor: Quién lo publica
---

El texto largo va aquí, en Markdown.

## Puedes usar subtítulos

- y listas
```

`tipo` solo admite: `convocatoria`, `evento`, `logro`, `publicacion`.
`imagen` y `autor` son opcionales.

### Reunión · `contenido/reuniones/2026-10-15-tema.md`

```markdown
---
titulo: Tema de la sesión
fecha: 2026-10-15
hora: "16:00"
lugar: Laboratorio de Electrónica, bloque Q
modalidad: presencial
ponente: Quién la dirige
enlace: https://...
resumen: De qué va la sesión.
---

Orden del día y lo que haga falta.
```

`modalidad` solo admite: `presencial`, `virtual`, `hibrida`.
La hora va **entre comillas**, o el sistema la lee como un número y se rompe.
`enlace` es para las virtuales.

La portada muestra automáticamente la primera reunión cuya fecha no haya pasado.

### Proyecto · `contenido/proyectos/nombre-del-proyecto.md`

```markdown
---
titulo: Nombre del proyecto
estado: activo
linea: Percepción y visión por computador
resumen: Una o dos frases para la tarjeta.
portada: /imagenes/proyectos/archivo.jpg
integrantes: [nombre-apellido, otro-nombre]
---

Descripción larga del proyecto.
```

`estado` solo admite: `activo`, `en-curso`, `completado`, `pausado`. Los activos salen primero.
`linea` debe coincidir con una de `LINEAS` en `lib/sitio.ts`.
`integrantes` son los **nombres de archivo** de `contenido/integrantes/`, sin el `.md`.

### Integrante · `contenido/integrantes/nombre-apellido.md`

```markdown
---
nombre: Nombre y Apellido
rol: estudiante
area: Percepción y visión por computador
foto: /imagenes/integrantes/nombre-apellido.jpg
enlaces:
  github: https://github.com/usuario
  linkedin: https://linkedin.com/in/usuario
  correo: persona@unal.edu.co
---

Una o dos frases sobre la persona.
```

`rol` solo admite: `director`, `investigador`, `estudiante`, `egresado`. Ese es el orden en que
aparecen. Los campos de `enlaces` se pueden dejar vacíos con `""`.

---

## 5. Imágenes

- van en `public/imagenes/` dentro de la subcarpeta que toque
- nombre en minúsculas y con guiones, sin espacios ni tildes
- en el `.md` se referencian desde la raíz: `/imagenes/proyectos/mi-foto.jpg`
- **redúcelas antes de subirlas**: 1600 px de ancho sobra y evita que el repositorio engorde
- en código usa `next/image`, nunca `<img>`, y siempre con texto alternativo que describa la foto

---

## 6. Si algo falla

**Mi novedad no aparece.** Repasa el frontmatter: `titulo` y `fecha` son obligatorios y la fecha
tiene que ser `YYYY-MM-DD`. Un archivo mal escrito se ignora en silencio para no tumbar el sitio;
al correr `npm run build` verás un aviso diciendo cuál y por qué.

**Mi reunión no sale en la portada.** La portada solo muestra reuniones cuya fecha no haya pasado.

**`npm run build` falla.** Lee el error de arriba abajo: casi siempre dice el archivo y la línea. Si
te atascas, pega el error completo en el grupo.

**Toqué algo y se descuadró otra sección.** Seguramente editaste un archivo compartido. Deshaz y
pregunta antes.
