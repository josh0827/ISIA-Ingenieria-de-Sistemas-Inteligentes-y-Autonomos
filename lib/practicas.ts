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

type FilaPractica = {
  id: string
  titulo: string
  empresa_nombre: string
  empresa_id: string | null
  ubicacion: string
  modalidad: string
  descripcion: string
  requisitos: unknown
  contacto_email: string
  url_postulacion: string | null
  activa: boolean
  creado_en: string
  actualizado_en: string
}

const COLUMNAS = 'id, titulo, empresa_nombre, empresa_id, ubicacion, modalidad, descripcion, requisitos, contacto_email, url_postulacion, activa, creado_en, actualizado_en'

function convertirFila(fila: FilaPractica): PracticaOferta | undefined {
  const resultado = practicaOfertaSchema.safeParse({
    titulo: fila.titulo,
    empresaNombre: fila.empresa_nombre,
    ubicacion: fila.ubicacion,
    modalidad: fila.modalidad,
    descripcion: fila.descripcion,
    requisitos: fila.requisitos,
    contactoEmail: fila.contacto_email,
    urlPostulacion: fila.url_postulacion ?? '',
    activa: fila.activa,
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
      .eq('activa', true)
      .order('creado_en', { ascending: false })
    if (error) throw error
    return (data ?? []).map((fila) => convertirFila(fila as FilaPractica)).filter(Boolean) as PracticaOferta[]
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

export async function obtenerPracticaAdmin(id: string, usuarioId: string, rol: 'admin' | 'editor' | 'empresa'): Promise<PracticaOferta | undefined> {
  const ofertas = await listarPracticasAdmin(usuarioId, rol)
  return ofertas.find((oferta) => oferta.id === id)
}
