import 'server-only'

import { listarSolicitudes } from '@/lib/admin/solicitudes'
import { crearClienteAdmin } from '@/lib/supabase/server'
import type { EstadoSolicitudAdmin } from '@/lib/admin/solicitudes'

export type OrigenBandeja = 'participacion' | 'colaboracion' | 'prototipado'
export type EntradaBandeja = {
  id: string
  origen: OrigenBandeja
  nombre: string
  correo: string
  asunto: string
  detalle: string
  contexto?: string
  estado: EstadoSolicitudAdmin
  creadoEn: string
}

export type ResultadoBandeja = { entradas: EntradaBandeja[]; errores: string[] }
type Parcial = { entradas: EntradaBandeja[]; error?: string }

async function colaboraciones(): Promise<Parcial> {
  const { data, error } = await crearClienteAdmin().from('solicitudes_colaboracion')
    .select('id, destino_tipo, destino_titulo, nombre, correo, tipo_participante, tipo_colaboracion, organizacion, mensaje, estado, creado_en')
    .order('creado_en', { ascending: false }).limit(250)
  if (error) {
    console.error('[bandeja] No se pudieron leer las colaboraciones.', error.message)
    return { entradas: [], error: 'colaboraciones' }
  }
  return { entradas: (data ?? []).map((fila) => ({
    id: String(fila.id),
    origen: 'colaboracion' as const,
    nombre: String(fila.nombre),
    correo: String(fila.correo),
    asunto: String(fila.destino_titulo),
    detalle: String(fila.mensaje),
    contexto: [fila.destino_tipo, fila.tipo_participante, fila.tipo_colaboracion, fila.organizacion].filter(Boolean).join(' · '),
    estado: fila.estado as EstadoSolicitudAdmin,
    creadoEn: String(fila.creado_en),
  })) }
}

async function retos(): Promise<Parcial> {
  const { data, error } = await crearClienteAdmin().from('solicitudes_prototipado')
    .select('id, servicio_slug, nombre, correo, tipo_participante, organizacion, titulo_reto, descripcion_reto, resultado_esperado, areas, requiere_confidencialidad, estado, creado_en')
    .order('creado_en', { ascending: false }).limit(250)
  if (error) {
    console.error('[bandeja] No se pudieron leer los retos de prototipado.', error.message)
    return { entradas: [], error: 'retos de prototipado' }
  }
  return { entradas: (data ?? []).map((fila) => ({
    id: String(fila.id),
    origen: 'prototipado' as const,
    nombre: String(fila.nombre),
    correo: String(fila.correo),
    asunto: String(fila.titulo_reto),
    detalle: String(fila.descripcion_reto) + '\n\nResultado esperado: ' + String(fila.resultado_esperado),
    contexto: [fila.tipo_participante, fila.organizacion, ...(Array.isArray(fila.areas) ? fila.areas : []), fila.requiere_confidencialidad ? 'Solicita conversación de confidencialidad' : ''].filter(Boolean).join(' · '),
    estado: fila.estado as EstadoSolicitudAdmin,
    creadoEn: String(fila.creado_en),
  })) }
}

export async function listarBandeja(): Promise<ResultadoBandeja> {
  const [base, colaboracion, prototipado] = await Promise.all([
    listarSolicitudes().then(
      (filas) => ({ filas, error: undefined as string | undefined }),
      (error: unknown) => {
        console.error('[bandeja] No se pudieron leer las solicitudes de participación.', error instanceof Error ? error.message : error)
        return { filas: [], error: 'solicitudes de participación' as string | undefined }
      },
    ),
    colaboraciones(),
    retos(),
  ])
  const participacion: EntradaBandeja[] = base.filas.map((fila) => ({
    id: fila.id,
    origen: 'participacion' as const,
    nombre: fila.nombre,
    correo: fila.correo,
    asunto: 'Participar en el semillero',
    detalle: fila.mensaje ?? 'Sin mensaje adicional.',
    contexto: [fila.programa, ...fila.temas].filter(Boolean).join(' · '),
    estado: fila.estado,
    creadoEn: fila.creado_en,
  }))
  const entradas = [...participacion, ...colaboracion.entradas, ...prototipado.entradas]
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
  const errores = [base.error, colaboracion.error, prototipado.error].filter((valor): valor is string => Boolean(valor))
  return { entradas, errores }
}

export type PendientesAdmin = { bandeja: number; preguntas: number }

/** Conteo ligero para los indicadores del menú; un fallo se registra y cuenta como cero. */
export async function contarPendientes(): Promise<PendientesAdmin> {
  const cliente = crearClienteAdmin()
  const contar = async (tabla: string, estado: string): Promise<number> => {
    const { count, error } = await cliente.from(tabla).select('id', { count: 'exact', head: true }).eq('estado', estado)
    if (error) {
      console.error(`[bandeja] No se pudo contar ${tabla}.`, error.message)
      return 0
    }
    return count ?? 0
  }
  const [participacion, colaboracion, prototipado, preguntas] = await Promise.all([
    contar('solicitudes_participacion', 'nueva'),
    contar('solicitudes_colaboracion', 'nueva'),
    contar('solicitudes_prototipado', 'nueva'),
    contar('preguntas_comunidad', 'pendiente'),
  ])
  return { bandeja: participacion + colaboracion + prototipado, preguntas }
}
