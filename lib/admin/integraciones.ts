import 'server-only'

import { crearClienteAdmin } from '@/lib/supabase/server'

export type EventoGithubAdmin = {
  entregaId: string
  propietario: string
  repositorioOrigen: string
  repositorioCreado: string
  estado: string
  creadoEn: string
}

export async function listarEventosGithub(): Promise<EventoGithubAdmin[]> {
  const { data, error } = await crearClienteAdmin().from('integraciones_github_eventos')
    .select('entrega_id, propietario, repositorio_origen, repositorio_creado, estado, creado_en')
    .order('creado_en', { ascending: false })
    .limit(100)
  if (error) throw new Error(error.message)
  return (data ?? []).map((fila) => ({
    entregaId: String(fila.entrega_id),
    propietario: String(fila.propietario),
    repositorioOrigen: String(fila.repositorio_origen),
    repositorioCreado: String(fila.repositorio_creado),
    estado: String(fila.estado),
    creadoEn: String(fila.creado_en),
  }))
}
