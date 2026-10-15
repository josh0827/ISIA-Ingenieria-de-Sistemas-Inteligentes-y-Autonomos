import 'server-only'

import { supabaseServidorListo } from '@/lib/supabase/config'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { practicaOfertaSchema, type PracticaOfertaEntrada } from '@/lib/validators/practicas'

export type PracticaOferta = PracticaOfertaEntrada & {
  id: string
  empresaId?: string
  creadoEn: string
  actualizadoEn: string
}

export type ResumenPracticaAdmin = Pick<
  PracticaOferta,
  'id' | 'titulo' | 'tipo' | 'empresaNombre' | 'modalidad' | 'activa' | 'estado' | 'fechaCierre' | 'contactoPublico'
>

type FilaPractica = {
  id: string
  titulo: string
  tipo_oportunidad: string
  empresa_nombre: string
  empresa_id: string | null
  ubicacion: string
  modalidad: string
  descripcion: string
  requisitos: unknown
  contacto_email: string
  url_postulacion: string | null
  activa: boolean
  estado: string
  fecha_cierre: string | null
  contacto_publico: boolean
  creado_en: string
  actualizado_en: string
}

const COLUMNAS = 'id, titulo, tipo_oportunidad, empresa_nombre, empresa_id, ubicacion, modalidad, descripcion, requisitos, contacto_email, url_postulacion, activa, estado, fecha_cierre, contacto_publico, creado_en, actualizado_en'

function convertirFila(fila: FilaPractica): PracticaOferta | undefined {
  const resultado = practicaOfertaSchema.safeParse({
    titulo: fila.titulo,
    tipo: fila.tipo_oportunidad,
    empresaNombre: fila.empresa_nombre,
    ubicacion: fila.ubicacion,
    modalidad: fila.modalidad,
    descripcion: fila.descripcion,
    requisitos: fila.requisitos,
    contactoEmail: fila.contacto_email,
    urlPostulacion: fila.url_postulacion ?? '',
    activa: fila.estado === 'abierta',
    estado: fila.estado,
    fechaCierre: fila.fecha_cierre ?? '',
    contactoPublico: fila.contacto_publico,
  })
  return resultado.success
    ? { id: fila.id, empresaId: fila.empresa_id ?? undefined, creadoEn: fila.creado_en, actualizadoEn: fila.actualizado_en, ...resultado.data }
    : undefined
}

export async function listarPracticasPublicas(): Promise<PracticaOferta[]> {
  if (!supabaseServidorListo()) return []
  try {
    const { data, error } = await crearClienteAdmin()
      .from('practicas_ofertas')
      .select(COLUMNAS)
      .eq('estado', 'abierta')
      .order('creado_en', { ascending: false })
    if (error) throw error
    return ((data ?? []).map((fila) => convertirFila(fila as FilaPractica)).filter(Boolean) as PracticaOferta[])
      .map((oferta) => ({ ...oferta, contactoEmail: '' }))
  } catch {
    return []
  }
}

export async function listarOportunidadesPublicas(): Promise<PracticaOferta[]> {
  if (!supabaseServidorListo()) return []
  try {
    const { data, error } = await crearClienteAdmin()
      .from('practicas_ofertas')
      .select(COLUMNAS)
      .in('estado', ['abierta', 'cerrada', 'archivada'])
      .order('fecha_cierre', { ascending: false, nullsFirst: false })
      .order('creado_en', { ascending: false })
    if (error) throw error
    return ((data ?? []).map((fila) => convertirFila(fila as FilaPractica)).filter(Boolean) as PracticaOferta[])
      .map((oferta) => ({
        ...oferta,
        contactoEmail: oferta.estado !== 'abierta' && oferta.contactoPublico ? oferta.contactoEmail : '',
      }))
  } catch {
    return []
  }
}

export async function listarPracticasAdmin(usuarioId: string, rol: 'admin' | 'editor' | 'empresa'): Promise<PracticaOferta[]> {
  if (!supabaseServidorListo()) return []
  try {
    let consulta = crearClienteAdmin()
      .from('practicas_ofertas')
      .select(COLUMNAS)
      .order('creado_en', { ascending: false })
    if (rol === 'empresa') consulta = consulta.eq('empresa_id', usuarioId)
    const { data, error } = await consulta
    if (error) throw error
    return (data ?? []).map((fila) => convertirFila(fila as FilaPractica)).filter(Boolean) as PracticaOferta[]
  } catch {
    return []
  }
}

/** Consulta reducida para el listado del panel. */
export async function listarResumenPracticasAdmin(
  usuarioId: string,
  rol: 'admin' | 'editor' | 'empresa',
): Promise<ResumenPracticaAdmin[]> {
  if (!supabaseServidorListo()) return []
  try {
    let consulta = crearClienteAdmin()
      .from('practicas_ofertas')
      .select('id, titulo, tipo_oportunidad, empresa_nombre, modalidad, activa, estado, fecha_cierre, contacto_publico')
      .order('creado_en', { ascending: false })
    if (rol === 'empresa') consulta = consulta.eq('empresa_id', usuarioId)
    const { data, error } = await consulta
    if (error) throw error
    return (data ?? []).map((fila) => ({
      id: String(fila.id),
      titulo: String(fila.titulo),
      tipo: fila.tipo_oportunidad as PracticaOferta['tipo'],
      empresaNombre: String(fila.empresa_nombre),
      modalidad: fila.modalidad as PracticaOferta['modalidad'],
      activa: fila.estado === 'abierta',
      estado: fila.estado as PracticaOferta['estado'],
      fechaCierre: typeof fila.fecha_cierre === 'string' ? fila.fecha_cierre : '',
      contactoPublico: fila.contacto_publico === true,
    }))
  } catch {
    return []
  }
}

export async function obtenerPracticaAdmin(id: string, usuarioId: string, rol: 'admin' | 'editor' | 'empresa'): Promise<PracticaOferta | undefined> {
  if (!supabaseServidorListo()) return undefined
  try {
    let consulta = crearClienteAdmin()
      .from('practicas_ofertas')
      .select(COLUMNAS)
      .eq('id', id)
    if (rol === 'empresa') consulta = consulta.eq('empresa_id', usuarioId)
    const { data, error } = await consulta.maybeSingle()
    if (error) throw error
    return data ? convertirFila(data as FilaPractica) : undefined
  } catch {
    return undefined
  }
}
