import 'server-only'

import { crearClienteAdmin } from '@/lib/supabase/server'
import { decidirLimite, LIMITE_SOLICITUDES_POR_HORA, type ResultadoLimite } from '@/lib/limite-regla'

export { LIMITE_SOLICITUDES_POR_HORA, type ResultadoLimite }

export const TABLAS_SOLICITUDES = [
  'solicitudes_participacion',
  'solicitudes_colaboracion',
  'solicitudes_prototipado',
  'preguntas_comunidad',
] as const
export type TablaSolicitudes = (typeof TABLAS_SOLICITUDES)[number]

const VENTANA_DUPLICADA_MS = 15 * 60 * 1000
const VENTANA_CUPO_MS = 60 * 60 * 1000
/**
 * Anti-abuso compartido por los formularios públicos: una solicitud por correo
 * cada 15 minutos y un tope global por hora. El esquema ya normaliza el correo
 * a minúsculas, así que basta una comparación exacta (con ilike, un "_" del
 * correo actuaría como comodín).
 */
export async function comprobarLimiteSolicitudes(
  tabla: TablaSolicitudes,
  correo: string,
): Promise<ResultadoLimite> {
  const ahora = Date.now()
  const cliente = crearClienteAdmin()
  const [reciente, cupo] = await Promise.all([
    cliente
      .from(tabla)
      .select('id')
      .eq('correo', correo)
      .gte('creado_en', new Date(ahora - VENTANA_DUPLICADA_MS).toISOString())
      .limit(1),
    cliente
      .from(tabla)
      .select('id', { count: 'exact', head: true })
      .gte('creado_en', new Date(ahora - VENTANA_CUPO_MS).toISOString()),
  ])
  if (reciente.error || cupo.error) {
    console.error(`[limite] No se pudo comprobar ${tabla}.`, reciente.error?.message ?? cupo.error?.message)
    return 'error'
  }
  return decidirLimite((reciente.data ?? []).length, cupo.count ?? 0)
}
