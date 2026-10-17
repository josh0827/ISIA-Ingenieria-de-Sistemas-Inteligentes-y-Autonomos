import 'server-only'

import { crearClienteAdmin } from '@/lib/supabase/server'

export type EventoAuditoria = {
  usuarioId?: string
  usuarioEmail?: string
  accion: string
  recursoTipo: string
  recursoId: string
  detalle?: Record<string, unknown>
}

export async function registrarAuditoria(evento: EventoAuditoria): Promise<void> {
  const { error } = await crearClienteAdmin().from('auditoria_admin').insert({
    usuario_id: evento.usuarioId ?? null,
    usuario_email: evento.usuarioEmail ?? null,
    accion: evento.accion,
    recurso_tipo: evento.recursoTipo,
    recurso_id: evento.recursoId,
    detalle: evento.detalle ?? {},
  })
  if (error) console.error(`[auditoria] No se pudo registrar ${evento.accion} sobre ${evento.recursoTipo}.`)
}

export type FilaAuditoria = {
  id: number
  usuario_email: string | null
  accion: string
  recurso_tipo: string
  recurso_id: string
  creado_en: string
}

export const TAMANO_PAGINA_AUDITORIA = 50

export type FiltroAuditoria = { pagina?: number; usuario?: string; recurso?: string }

export async function listarAuditoria(filtro: FiltroAuditoria = {}): Promise<{ filas: FilaAuditoria[]; hayMas: boolean }> {
  const pagina = Math.max(Math.trunc(filtro.pagina ?? 1), 1)
  const desde = (pagina - 1) * TAMANO_PAGINA_AUDITORIA
  let consulta = crearClienteAdmin()
    .from('auditoria_admin')
    .select('id, usuario_email, accion, recurso_tipo, recurso_id, creado_en')
    .order('creado_en', { ascending: false })
  // Los comodines de ilike se eliminan: el texto escrito se busca de forma literal.
  const usuario = filtro.usuario?.replace(/[%_,()\\]/g, '').trim().slice(0, 80)
  if (usuario) consulta = consulta.ilike('usuario_email', `%${usuario}%`)
  const recurso = filtro.recurso?.trim().slice(0, 60)
  if (recurso) consulta = consulta.eq('recurso_tipo', recurso)
  // Se pide una fila de más para saber si existe una página siguiente.
  const { data, error } = await consulta.range(desde, desde + TAMANO_PAGINA_AUDITORIA)
  if (error) throw new Error(error.message)
  const filas = (data ?? []) as FilaAuditoria[]
  return { filas: filas.slice(0, TAMANO_PAGINA_AUDITORIA), hayMas: filas.length > TAMANO_PAGINA_AUDITORIA }
}
