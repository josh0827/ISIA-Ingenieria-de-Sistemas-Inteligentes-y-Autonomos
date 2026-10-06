import 'server-only'

import { supabaseServidorListo } from '@/lib/supabase/config'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { grupoTrabajoSchema, type GrupoTrabajoEntrada } from '@/lib/validators/grupos'

export type GrupoTrabajo = GrupoTrabajoEntrada & { id: string }
export type ResumenGrupoTrabajo = Pick<GrupoTrabajo, 'id' | 'slug' | 'nombre' | 'integrantes'>

const GRUPOS_BASE: GrupoTrabajo[] = [
  {
    id: 'demo-robotica-drones',
    slug: 'robotica-drones',
    nombre: 'Robótica y Drones',
    descripcion: 'Desarrollo e investigación en plataformas robóticas móviles, vehículos aéreos no tripulados (UAVs) y algoritmos de navegación autónoma.',
    integrantes: ['Ismael', 'Felipe', 'Joshua', 'Mateo', 'Jaime Enrique'],
    repositorios: [], documentos: [], galeriaImagenes: [],
  },
  {
    id: 'demo-hardware-firmware',
    slug: 'hardware-firmware',
    nombre: 'Hardware, Firmware y Sistemas Embebidos',
    descripcion: 'Diseño de hardware a la medida, desarrollo de firmware embebido, electrónica de potencia, sistemas de energía y redes de nodos sensores.',
    integrantes: ['Juan Pablo', 'Miguel'],
    repositorios: [], documentos: [], galeriaImagenes: [],
  },
  {
    id: 'demo-redes-adquisicion',
    slug: 'redes-adquisicion',
    nombre: 'Redes y Adquisición de Datos',
    descripcion: 'Infraestructura de comunicaciones, protocolos para transmisión de datos en tiempo real, instrumentación y sistemas de adquisición de señales.',
    integrantes: ['Sebastián', 'Miguel'],
    repositorios: [], documentos: [], galeriaImagenes: [],
  },
  {
    id: 'demo-operaciones-autonomas-energia',
    slug: 'operaciones-autonomas-energia',
    nombre: 'Operaciones Autónomas (Energía)',
    descripcion: 'Investigación y desarrollo de estrategias de control y gestión autónoma para sistemas energéticos y microredes inteligentes.',
    integrantes: [], repositorios: [], documentos: [], galeriaImagenes: [],
  },
]

type FilaGrupo = {
  id: string
  slug: string
  nombre: string
  descripcion: string
  imagen_portada: unknown
  integrantes: unknown
  repositorios: unknown
  documentos: unknown
  galeria_imagenes: unknown
}

function convertirFila(fila: FilaGrupo): GrupoTrabajo | undefined {
  const resultado = grupoTrabajoSchema.safeParse({
    slug: fila.slug,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    imagenPortada: fila.imagen_portada || undefined,
    integrantes: fila.integrantes,
    repositorios: fila.repositorios,
    documentos: fila.documentos,
    galeriaImagenes: fila.galeria_imagenes,
  })
  return resultado.success ? { id: fila.id, ...resultado.data } : undefined
}

export async function listarGruposTrabajo(): Promise<GrupoTrabajo[]> {
  if (!supabaseServidorListo()) return GRUPOS_BASE
  try {
    const { data, error } = await crearClienteAdmin()
      .from('grupos_trabajo')
      .select('id, slug, nombre, descripcion, imagen_portada, integrantes, repositorios, documentos, galeria_imagenes')
      .order('nombre')
    if (error) throw error
    return (data ?? []).map((fila) => convertirFila(fila as FilaGrupo)).filter(Boolean) as GrupoTrabajo[]
  } catch {
    return GRUPOS_BASE
  }
}

/** Consulta reducida para la tabla del panel; omite textos, enlaces y galeria. */
export async function listarGruposTrabajoAdmin(): Promise<ResumenGrupoTrabajo[]> {
  if (!supabaseServidorListo()) {
    return GRUPOS_BASE.map(({ id, slug, nombre, integrantes }) => ({ id, slug, nombre, integrantes }))
  }
  try {
    const { data, error } = await crearClienteAdmin()
      .from('grupos_trabajo')
      .select('id, slug, nombre, integrantes')
      .order('nombre')
    if (error) throw error
    return (data ?? []).map((fila) => ({
      id: String(fila.id),
      slug: String(fila.slug),
      nombre: String(fila.nombre),
      integrantes: Array.isArray(fila.integrantes)
        ? fila.integrantes.filter((valor): valor is string => typeof valor === 'string')
        : [],
    }))
  } catch {
    return GRUPOS_BASE.map(({ id, slug, nombre, integrantes }) => ({ id, slug, nombre, integrantes }))
  }
}

export async function obtenerGrupoTrabajo(slug: string): Promise<GrupoTrabajo | undefined> {
  if (!supabaseServidorListo()) return GRUPOS_BASE.find((grupo) => grupo.slug === slug)
  try {
    const { data, error } = await crearClienteAdmin()
      .from('grupos_trabajo')
      .select('id, slug, nombre, descripcion, imagen_portada, integrantes, repositorios, documentos, galeria_imagenes')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    return data ? convertirFila(data as FilaGrupo) : undefined
  } catch {
    return GRUPOS_BASE.find((grupo) => grupo.slug === slug)
  }
}
