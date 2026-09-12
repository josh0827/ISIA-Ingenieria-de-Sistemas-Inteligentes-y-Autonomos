// Capa de contenido.
//
// El grupo publica escribiendo archivos .md dentro de /contenido. Nadie toca
// código para publicar una novedad o anunciar una reunión: se crea un archivo,
// se hace commit y Vercel reconstruye el sitio solo.
//
// Regla de oro de este archivo: un .md mal escrito NUNCA debe tumbar el build.
// Si a alguien se le olvida un campo o escribe mal una fecha, el archivo se
// descarta, se avisa por consola y el resto del sitio sigue en pie.

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const RAIZ = path.join(process.cwd(), 'contenido')

export type Novedad = {
  slug: string
  titulo: string
  fecha: string // YYYY-MM-DD
  tipo: 'convocatoria' | 'evento' | 'logro' | 'publicacion'
  resumen: string
  imagen?: string
  autor?: string
  cuerpo: string // markdown sin procesar
}

export type Reunion = {
  slug: string
  titulo: string
  fecha: string
  hora: string
  lugar: string
  modalidad: 'presencial' | 'virtual' | 'hibrida'
  ponente?: string
  enlace?: string
  resumen?: string
  cuerpo: string
}

export type Proyecto = {
  slug: string
  titulo: string
  estado: 'activo' | 'en-curso' | 'completado' | 'pausado'
  linea: string
  resumen: string
  portada?: string
  integrantes: string[]
  cuerpo: string
}

export type Integrante = {
  slug: string
  nombre: string
  rol: 'director' | 'investigador' | 'estudiante' | 'egresado'
  area: string
  foto?: string
  enlaces: { github?: string; linkedin?: string; correo?: string }
  cuerpo: string
}

type Crudo = { slug: string; datos: Record<string, unknown>; cuerpo: string }

/** Lee todos los .md de una subcarpeta de /contenido. Si la carpeta no existe
 *  devuelve lista vacía en vez de reventar: así el sitio compila aunque una
 *  sección todavía no tenga nada escrito. */
function leerCarpeta(carpeta: string): Crudo[] {
  const dir = path.join(RAIZ, carpeta)
  if (!fs.existsSync(dir)) return []

  const archivos = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  const salida: Crudo[] = []

  for (const archivo of archivos) {
    try {
      const { data, content } = matter(fs.readFileSync(path.join(dir, archivo), 'utf8'))
      salida.push({
        slug: archivo.replace(/\.md$/, ''),
        datos: data as Record<string, unknown>,
        cuerpo: content,
      })
    } catch (error) {
      avisar(carpeta, archivo, `no se pudo leer el frontmatter (${(error as Error).message})`)
    }
  }

  return salida
}

function avisar(carpeta: string, archivo: string, motivo: string): void {
  console.warn(`[contenido] Se ignoró contenido/${carpeta}/${archivo}: ${motivo}`)
}

function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : ''
}

/** Acepta tanto "2026-09-19" como una fecha que el parser de YAML ya convirtió
 *  en objeto Date (pasa cuando se escribe sin comillas). Devuelve siempre
 *  YYYY-MM-DD, o cadena vacía si no hay forma de entenderla. */
function fechaISO(valor: unknown): string {
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor.toISOString().slice(0, 10)
  }
  const s = texto(valor)
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : ''
}

function unaDeEstas<T extends string>(valor: unknown, permitidos: readonly T[], porDefecto: T): T {
  const s = texto(valor).toLowerCase()
  return (permitidos as readonly string[]).includes(s) ? (s as T) : porDefecto
}

// ---------------------------------------------------------------- NOVEDADES

export function listarNovedades(limite?: number): Novedad[] {
  const novedades: Novedad[] = []

  for (const { slug, datos, cuerpo } of leerCarpeta('novedades')) {
    const titulo = texto(datos.titulo)
    const fecha = fechaISO(datos.fecha)
    if (!titulo || !fecha) {
      avisar('novedades', `${slug}.md`, 'falta "titulo" o "fecha" con formato YYYY-MM-DD')
      continue
    }
    novedades.push({
      slug,
      titulo,
      fecha,
      tipo: unaDeEstas(datos.tipo, ['convocatoria', 'evento', 'logro', 'publicacion'] as const, 'evento'),
      resumen: texto(datos.resumen),
      imagen: texto(datos.imagen) || undefined,
      autor: texto(datos.autor) || undefined,
      cuerpo,
    })
  }

  novedades.sort((a, b) => b.fecha.localeCompare(a.fecha)) // más reciente primero
  return typeof limite === 'number' ? novedades.slice(0, limite) : novedades
}

export function obtenerNovedad(slug: string): Novedad | undefined {
  return listarNovedades().find((n) => n.slug === slug)
}

// ---------------------------------------------------------------- REUNIONES

export function listarReuniones(): Reunion[] {
  const reuniones: Reunion[] = []

  for (const { slug, datos, cuerpo } of leerCarpeta('reuniones')) {
    const titulo = texto(datos.titulo)
    const fecha = fechaISO(datos.fecha)
    if (!titulo || !fecha) {
      avisar('reuniones', `${slug}.md`, 'falta "titulo" o "fecha" con formato YYYY-MM-DD')
      continue
    }
    reuniones.push({
      slug,
      titulo,
      fecha,
      hora: texto(datos.hora),
      lugar: texto(datos.lugar),
      modalidad: unaDeEstas(datos.modalidad, ['presencial', 'virtual', 'hibrida'] as const, 'presencial'),
      ponente: texto(datos.ponente) || undefined,
      enlace: texto(datos.enlace) || undefined,
      resumen: texto(datos.resumen) || undefined,
      cuerpo,
    })
  }

  reuniones.sort((a, b) => a.fecha.localeCompare(b.fecha)) // cronológico
  return reuniones
}

/** La próxima reunión que todavía no ha pasado. Devuelve undefined si no hay
 *  ninguna futura, y en ese caso la portada simplemente no pinta ese bloque. */
export function proximaReunion(): Reunion | undefined {
  const hoy = new Date().toISOString().slice(0, 10)
  return listarReuniones().find((r) => r.fecha >= hoy)
}

/** Las ya celebradas, de la más reciente a la más antigua. */
export function reunionesPasadas(): Reunion[] {
  const hoy = new Date().toISOString().slice(0, 10)
  return listarReuniones()
    .filter((r) => r.fecha < hoy)
    .reverse()
}

// ---------------------------------------------------------------- PROYECTOS

const ORDEN_ESTADO = { activo: 0, 'en-curso': 1, pausado: 2, completado: 3 } as const

export function listarProyectos(limite?: number): Proyecto[] {
  const proyectos: Proyecto[] = []

  for (const { slug, datos, cuerpo } of leerCarpeta('proyectos')) {
    const titulo = texto(datos.titulo)
    if (!titulo) {
      avisar('proyectos', `${slug}.md`, 'falta "titulo"')
      continue
    }
    proyectos.push({
      slug,
      titulo,
      estado: unaDeEstas(datos.estado, ['activo', 'en-curso', 'completado', 'pausado'] as const, 'activo'),
      linea: texto(datos.linea),
      resumen: texto(datos.resumen),
      portada: texto(datos.portada) || undefined,
      integrantes: Array.isArray(datos.integrantes) ? datos.integrantes.map(texto).filter(Boolean) : [],
      cuerpo,
    })
  }

  // Primero los vivos, y dentro de cada estado por orden alfabético.
  proyectos.sort(
    (a, b) => ORDEN_ESTADO[a.estado] - ORDEN_ESTADO[b.estado] || a.titulo.localeCompare(b.titulo, 'es'),
  )
  return typeof limite === 'number' ? proyectos.slice(0, limite) : proyectos
}

export function obtenerProyecto(slug: string): Proyecto | undefined {
  return listarProyectos().find((p) => p.slug === slug)
}

// -------------------------------------------------------------- INTEGRANTES

const ORDEN_ROL = { director: 0, investigador: 1, estudiante: 2, egresado: 3 } as const

export function listarIntegrantes(): Integrante[] {
  const integrantes: Integrante[] = []

  for (const { slug, datos, cuerpo } of leerCarpeta('integrantes')) {
    const nombre = texto(datos.nombre)
    if (!nombre) {
      avisar('integrantes', `${slug}.md`, 'falta "nombre"')
      continue
    }
    const enlaces = (datos.enlaces ?? {}) as Record<string, unknown>
    integrantes.push({
      slug,
      nombre,
      rol: unaDeEstas(datos.rol, ['director', 'investigador', 'estudiante', 'egresado'] as const, 'estudiante'),
      area: texto(datos.area),
      foto: texto(datos.foto) || undefined,
      enlaces: {
        github: texto(enlaces.github) || undefined,
        linkedin: texto(enlaces.linkedin) || undefined,
        correo: texto(enlaces.correo) || undefined,
      },
      cuerpo,
    })
  }

  integrantes.sort((a, b) => ORDEN_ROL[a.rol] - ORDEN_ROL[b.rol] || a.nombre.localeCompare(b.nombre, 'es'))
  return integrantes
}

// ------------------------------------------------------------------ UTILIDAD

/** Convierte el cuerpo en Markdown de cualquier .md a HTML. Lo usan las
 *  páginas de detalle (una novedad, un proyecto) para pintar el texto largo. */
export async function markdownAHtml(markdown: string): Promise<string> {
  const resultado = await remark().use(html).process(markdown)
  return resultado.toString()
}
