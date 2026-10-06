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

export async function listarAuditoria(limite = 100): Promise<FilaAuditoria[]> {
  const { data, error } = await crearClienteAdmin()
    .from('auditoria_admin')
    .select('id, usuario_email, accion, recurso_tipo, recurso_id, creado_en')
    .order('creado_en', { ascending: false })
    .limit(Math.min(Math.max(limite, 1), 250))
  if (error) throw new Error(error.message)
  return (data ?? []) as FilaAuditoria[]
}
