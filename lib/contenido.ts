import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { db, firebaseListo } from './firebase/admin'

const RAIZ = path.join(process.cwd(), 'contenido')
const PUBLICO = path.join(process.cwd(), 'public')

/** Nombres de colección de Firestore == nombres de carpeta en contenido/. */
export const COLECCIONES = [
  'proyectos',
  'novedades',
  'reuniones',
  'integrantes',
  'publicaciones',
  'galeria',
] as const
export type NombreColeccion = (typeof COLECCIONES)[number]

/** La ausencia de confirmación siempre significa contenido ilustrativo. */
type EstadoEditorial = { ilustrativo: boolean }

export type Novedad = EstadoEditorial & {
  slug: string
  titulo: string
  fecha: string
  tipo: 'convocatoria' | 'evento' | 'logro' | 'publicacion' | 'divulgacion'
  resumen: string
  imagen?: string
  autor?: string
  cuerpo: string
}

export type Reunion = EstadoEditorial & {
  slug: string
  titulo: string
  fecha: string
  hora: string
  lugar: string
  modalidad: 'presencial' | 'virtual' | 'hibrida' | 'pendiente'
  ponente?: string
  enlace?: string
  resumen?: string
  cuerpo: string
}

export type Proyecto = EstadoEditorial & {
  slug: string
  titulo: string
  estado: 'propuesta' | 'activo' | 'en-curso' | 'completado' | 'pausado'
  linea: string
  resumen: string
  portada?: string
  integrantes: string[]
  cuerpo: string
}

export type Integrante = EstadoEditorial & {
  slug: string
  nombre: string
  rol: 'director' | 'investigador' | 'estudiante' | 'egresado'
  area: string
  foto?: string
  enlaces: { github?: string; linkedin?: string; correo?: string }
  cuerpo: string
}

export type Publicacion = {
  slug: string
  titulo: string
  anio: number
  autores: string[]
  tipo: string
  enlace?: string
  cuerpo: string
  ilustrativo: false
}

export type FotoGaleria = {
  slug: string
  titulo: string
  imagen: string
  alt: string
  pie: string
  anio?: number
  ilustrativo: false
}

export type Crudo = { slug: string; datos: Record<string, unknown>; cuerpo: string }

function avisar(carpeta: string, archivo: string, motivo: string): void {
  console.warn(`[contenido] Se ignoró contenido/${carpeta}/${archivo}: ${motivo}`)
}

/** Las plantillas con prefijo _ y el contenido mal formado no se publican. */
function leerCarpeta(carpeta: string): Crudo[] {
  const dir = path.join(RAIZ, carpeta)
  if (!fs.existsSync(dir)) return []
  const salida: Crudo[] = []
  for (const archivo of fs.readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
    try {
      const { data, content } = matter(fs.readFileSync(path.join(dir, archivo), 'utf8'))
      salida.push({ slug: archivo.replace(/\.md$/, ''), datos: data as Record<string, unknown>, cuerpo: content })
    } catch (error) {
      avisar(carpeta, archivo, `no se pudo leer el frontmatter (${(error as Error).message})`)
    }
  }
  return salida
}

/** Cada documento de Firestore se mapea al mismo formato {slug, datos, cuerpo} que el Markdown. */
async function leerColeccion(nombre: NombreColeccion): Promise<Crudo[]> {
  const instantanea = await (await db()).collection(nombre).get()
  return instantanea.docs.map((doc) => {
    const { cuerpo, ...datos } = doc.data()
    return { slug: doc.id, datos, cuerpo: typeof cuerpo === 'string' ? cuerpo : '' }
  })
}

/**
 * Si hay credenciales de Firebase configuradas, el contenido real vive en
 * Firestore (editable desde /admin). Si no, se usa el Markdown de contenido/
 * para que el sitio y el desarrollo local sigan funcionando sin ellas.
 */
async function leerFuente(carpeta: NombreColeccion): Promise<Crudo[]> {
  if (!firebaseListo()) return leerCarpeta(carpeta)
  try {
    return await leerColeccion(carpeta)
  } catch (error) {
    // Si Firestore no responde (credenciales caducadas, permisos, red), el
    // sitio publico no puede quedarse en blanco ni devolver un error 500: se
    // sirve el Markdown de contenido/, que siempre viaja con el despliegue.
    console.error(
      `[contenido] Firestore no respondio para "${carpeta}" (${(error as Error).message}). Se usa el Markdown de contenido/.`,
    )
    return leerCarpeta(carpeta)
  }
}

export function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : ''
}

export function fechaISO(valor: unknown): string {
  const s = valor instanceof Date && !Number.isNaN(valor.getTime())
    ? valor.toISOString().slice(0, 10)
    : texto(valor)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return ''
  const fecha = new Date(`${s}T12:00:00Z`)
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === s ? s : ''
}

export function unaDeEstas<T extends string>(valor: unknown, permitidos: readonly T[], porDefecto: T): T {
  const s = texto(valor).toLowerCase()
  return (permitidos as readonly string[]).includes(s) ? (s as T) : porDefecto
}

/** Identificador de documento/URL: minúsculas, dígitos y guiones simples. */
export function slugValido(valor: unknown): string | undefined {
  const s = texto(valor).toLowerCase()
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) && s.length <= 80 ? s : undefined
}

export function anioValido(valor: unknown): number | undefined {
  const anio = Number(valor)
  return Number.isInteger(anio) && anio >= 1900 && anio <= new Date().getFullYear() + 1 ? anio : undefined
}

/**
 * Se aceptan HTTPS y rutas internas con forma válida; nunca protocolos
 * ejecutables ni dominios de ejemplo. La existencia del archivo Markdown ya
 * no se exige aquí porque el contenido puede vivir en Firestore: en el peor
 * caso un slug inexistente lleva a un 404 dentro del propio sitio.
 */
export function enlaceSeguro(valor: unknown): string | undefined {
  const s = texto(valor)
  if (!s || /[\s\\\u0000-\u001f]/.test(s)) return undefined
  if (/^#[a-zA-Z][\w-]*$/.test(s)) return s
  if (s.startsWith('/') && !s.startsWith('//')) {
    const ruta = s.split(/[?#]/)[0]
    if (ruta.includes('..') || ruta.includes('%')) return undefined
    const segmentos = ruta.split('/').filter(Boolean)
    if (segmentos.length === 0) return s
    if (segmentos.length === 1 && ['lineas', 'proyectos', 'novedades', 'reuniones', 'integrantes', 'publicaciones', 'galeria', 'unete'].includes(segmentos[0])) return s
    if (segmentos.length === 2 && ['proyectos', 'novedades'].includes(segmentos[0]) && /^[a-z0-9-]+$/.test(segmentos[1])) return s
    if (/^\/recursos\/[a-zA-Z0-9/_-]+\.pdf$/i.test(ruta)) {
      const archivo = path.resolve(PUBLICO, `.${ruta}`)
      if (archivo.startsWith(`${PUBLICO}${path.sep}`) && fs.existsSync(archivo) && fs.statSync(archivo).isFile()) return s
    }
    return undefined
  }
  try {
    const url = new URL(s)
    if (url.protocol !== 'https:' || url.username || url.password) return undefined
    const dominio = url.hostname.toLowerCase()
    if (dominio === 'localhost' || /(^|\.)(example\.(com|org|net)|example|invalid|test)$/.test(dominio) || dominio === 'universidad.edu.co') return undefined
    if (['github.com', 'www.github.com', 'linkedin.com', 'www.linkedin.com', 'instagram.com', 'www.instagram.com'].includes(dominio) && url.pathname === '/') return undefined
    return url.href
  } catch {
    return undefined
  }
}

/** Las fotografías deben existir en el repositorio; no se cargan imágenes remotas. */
export function imagenLocal(valor: unknown): string | undefined {
  const s = texto(valor)
  if (!/^\/imagenes\/[a-zA-Z0-9/_-]+\.(avif|webp|png|jpe?g|svg)$/i.test(s)) return undefined
  const absoluta = path.resolve(PUBLICO, `.${s}`)
  if (!absoluta.startsWith(`${PUBLICO}${path.sep}`) || !fs.existsSync(absoluta) || !fs.statSync(absoluta).isFile()) return undefined
  return s
}

export function correoSeguro(valor: unknown): string | undefined {
  const s = texto(valor)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || /[?&#<>]/.test(s)) return undefined
  const dominio = s.split('@')[1].toLowerCase()
  if (!enlaceSeguro(`https://${dominio}`)) return undefined
  return s
}

export async function listarNovedades(limite?: number): Promise<Novedad[]> {
  const novedades: Novedad[] = []
  for (const { slug, datos, cuerpo } of await leerFuente('novedades')) {
    const titulo = texto(datos.titulo)
    const fecha = fechaISO(datos.fecha)
    if (!titulo || !fecha) {
      avisar('novedades', `${slug}.md`, 'falta "titulo" o una fecha válida YYYY-MM-DD')
      continue
    }
    const ilustrativo = datos.confirmado !== true
    novedades.push({
      slug, titulo, fecha, ilustrativo, cuerpo,
      tipo: unaDeEstas(datos.tipo, ['convocatoria', 'evento', 'logro', 'publicacion', 'divulgacion'] as const, 'divulgacion'),
      resumen: texto(datos.resumen),
      imagen: ilustrativo ? undefined : imagenLocal(datos.imagen),
      autor: ilustrativo ? undefined : texto(datos.autor) || undefined,
    })
  }
  novedades.sort((a, b) => b.fecha.localeCompare(a.fecha))
  return typeof limite === 'number' ? novedades.slice(0, Math.max(0, limite)) : novedades
}

export async function obtenerNovedad(slug: string): Promise<Novedad | undefined> {
  return (await listarNovedades()).find((n) => n.slug === slug)
}

export async function listarReuniones(): Promise<Reunion[]> {
  const reuniones: Reunion[] = []
  for (const { slug, datos, cuerpo } of await leerFuente('reuniones')) {
    const titulo = texto(datos.titulo)
    const fecha = fechaISO(datos.fecha)
    if (!titulo || !fecha) {
      avisar('reuniones', `${slug}.md`, 'falta "titulo" o una fecha válida YYYY-MM-DD')
      continue
    }
    const ilustrativo = datos.confirmado !== true
    reuniones.push({
      slug, titulo, fecha, ilustrativo, cuerpo,
      hora: /^([01]\d|2[0-3]):[0-5]\d$/.test(texto(datos.hora)) ? texto(datos.hora) : '',
      lugar: texto(datos.lugar) || 'Lugar pendiente de confirmar',
      modalidad: unaDeEstas(datos.modalidad, ['presencial', 'virtual', 'hibrida', 'pendiente'] as const, 'pendiente'),
      ponente: ilustrativo ? undefined : texto(datos.ponente) || undefined,
      enlace: ilustrativo ? undefined : enlaceSeguro(datos.enlace),
      resumen: texto(datos.resumen) || undefined,
    })
  }
  reuniones.sort((a, b) => a.fecha.localeCompare(b.fecha))
  return reuniones
}

export function hoyColombia(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

/** Una fecha de ejemplo nunca se convierte en una convocatoria real. */
export async function proximaReunion(): Promise<Reunion | undefined> {
  const hoy = hoyColombia()
  return (await listarReuniones()).find((r) => !r.ilustrativo && r.fecha >= hoy)
}

export async function reunionesPasadas(): Promise<Reunion[]> {
  const hoy = hoyColombia()
  return (await listarReuniones()).filter((r) => !r.ilustrativo && r.fecha < hoy).reverse()
}

const ORDEN_ESTADO = { propuesta: 0, activo: 1, 'en-curso': 2, pausado: 3, completado: 4 } as const

export async function listarProyectos(limite?: number): Promise<Proyecto[]> {
  const proyectos: Proyecto[] = []
  const perfilesConfirmados = new Set((await listarIntegrantes()).filter((i) => !i.ilustrativo).map((i) => i.slug))
  for (const { slug, datos, cuerpo } of await leerFuente('proyectos')) {
    const titulo = texto(datos.titulo)
    if (!titulo) {
      avisar('proyectos', `${slug}.md`, 'falta "titulo"')
      continue
    }
    const ilustrativo = datos.confirmado !== true
    proyectos.push({
      slug, titulo, ilustrativo, cuerpo,
      estado: unaDeEstas(datos.estado, ['propuesta', 'activo', 'en-curso', 'completado', 'pausado'] as const, 'propuesta'),
      linea: texto(datos.linea),
      resumen: texto(datos.resumen),
      portada: ilustrativo ? undefined : imagenLocal(datos.portada),
      integrantes: !ilustrativo && Array.isArray(datos.integrantes) ? datos.integrantes.map(texto).filter((s) => perfilesConfirmados.has(s)) : [],
    })
  }
  proyectos.sort((a, b) => ORDEN_ESTADO[a.estado] - ORDEN_ESTADO[b.estado] || a.titulo.localeCompare(b.titulo, 'es'))
  return typeof limite === 'number' ? proyectos.slice(0, Math.max(0, limite)) : proyectos
}

export async function obtenerProyecto(slug: string): Promise<Proyecto | undefined> {
  return (await listarProyectos()).find((p) => p.slug === slug)
}

const ORDEN_ROL = { director: 0, investigador: 1, estudiante: 2, egresado: 3 } as const

export async function listarIntegrantes(): Promise<Integrante[]> {
  const integrantes: Integrante[] = []
  for (const { slug, datos, cuerpo } of await leerFuente('integrantes')) {
    const nombre = texto(datos.nombre)
    if (!nombre) {
      avisar('integrantes', `${slug}.md`, 'falta "nombre"')
      continue
    }
    const ilustrativo = datos.confirmado !== true
    const enlaces = datos.enlaces && typeof datos.enlaces === 'object' ? datos.enlaces as Record<string, unknown> : {}
    integrantes.push({
      slug, nombre, ilustrativo, cuerpo,
      rol: unaDeEstas(datos.rol, ['director', 'investigador', 'estudiante', 'egresado'] as const, 'estudiante'),
      area: texto(datos.area),
      foto: ilustrativo ? undefined : imagenLocal(datos.foto),
      enlaces: ilustrativo ? {} : {
        github: enlaceSeguro(enlaces.github),
        linkedin: enlaceSeguro(enlaces.linkedin),
        correo: correoSeguro(enlaces.correo),
      },
    })
  }
  integrantes.sort((a, b) => ORDEN_ROL[a.rol] - ORDEN_ROL[b.rol] || a.nombre.localeCompare(b.nombre, 'es'))
  return integrantes
}

/** No se fabrican referencias bibliográficas: los borradores quedan fuera del listado. */
export async function listarPublicaciones(): Promise<Publicacion[]> {
  const publicaciones: Publicacion[] = []
  for (const { slug, datos, cuerpo } of await leerFuente('publicaciones')) {
    if (datos.confirmado !== true) continue
    const titulo = texto(datos.titulo)
    const anio = anioValido(datos.anio)
    const autores = Array.isArray(datos.autores) ? datos.autores.map(texto).filter(Boolean) : []
    const tipo = texto(datos.tipo)
    if (!titulo || !anio || !autores.length || !tipo) {
      avisar('publicaciones', `${slug}.md`, 'faltan título, año válido, autores o tipo de recurso')
      continue
    }
    publicaciones.push({ slug, titulo, anio, autores, tipo, enlace: enlaceSeguro(datos.enlace), cuerpo, ilustrativo: false })
  }
  return publicaciones.sort((a, b) => b.anio - a.anio || a.titulo.localeCompare(b.titulo, 'es'))
}

/** Solo material real validado, con archivo existente, pie de foto y alternativa textual. */
export async function listarGaleria(): Promise<FotoGaleria[]> {
  const fotos: FotoGaleria[] = []
  for (const { slug, datos } of await leerFuente('galeria')) {
    if (datos.confirmado !== true) continue
    const titulo = texto(datos.titulo)
    const imagen = imagenLocal(datos.imagen)
    const alt = texto(datos.alt)
    const pie = texto(datos.pie)
    if (!titulo || !imagen || !alt || !pie) {
      avisar('galeria', `${slug}.md`, 'faltan título, imagen local existente, texto alternativo o pie de foto')
      continue
    }
    fotos.push({ slug, titulo, imagen, alt, pie, anio: anioValido(datos.anio), ilustrativo: false })
  }
  return fotos.sort((a, b) => (b.anio ?? 0) - (a.anio ?? 0) || a.titulo.localeCompare(b.titulo, 'es'))
}

type NodoMarkdown = { type: string; url?: string; identifier?: string; children?: NodoMarkdown[]; value?: string; alt?: string }

/** Complementa el saneamiento HTML para descartar destinos de prueba e imágenes inexistentes. */
function filtrarRecursosMarkdown() {
  return (arbol: NodoMarkdown) => {
    const definiciones = new Map<string, string>()
    for (const nodo of arbol.children ?? []) {
      if (nodo.type === 'definition' && nodo.identifier && nodo.url) definiciones.set(nodo.identifier, nodo.url)
    }
    function recorrer(nodo: NodoMarkdown): void {
      if (!nodo.children) return
      nodo.children = nodo.children.flatMap((hijo) => {
        recorrer(hijo)
        const destino = hijo.url ?? definiciones.get(hijo.identifier ?? '')
        if ((hijo.type === 'link' || hijo.type === 'linkReference') && !enlaceSeguro(destino)) return hijo.children ?? []
        if ((hijo.type === 'image' || hijo.type === 'imageReference') && !imagenLocal(destino)) return [{ type: 'text', value: hijo.alt ? `Imagen pendiente: ${hijo.alt}` : 'Imagen pendiente de validación' }]
        return [hijo]
      })
    }
    recorrer(arbol)
  }
}

export async function markdownAHtml(markdown: string): Promise<string> {
  const resultado = await remark().use(filtrarRecursosMarkdown).use(html, { sanitize: true }).process(markdown)
  return resultado.toString()
}
