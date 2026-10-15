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

async function colaboraciones(): Promise<EntradaBandeja[]> {
  const { data, error } = await crearClienteAdmin().from('solicitudes_colaboracion')
    .select('id, destino_tipo, destino_titulo, nombre, correo, tipo_participante, tipo_colaboracion, organizacion, mensaje, estado, creado_en')
    .order('creado_en', { ascending: false }).limit(250)
  if (error) return []
  return (data ?? []).map((fila) => ({
    id: String(fila.id),
    origen: 'colaboracion',
    nombre: String(fila.nombre),
    correo: String(fila.correo),
    asunto: String(fila.destino_titulo),
    detalle: String(fila.mensaje),
    contexto: [fila.destino_tipo, fila.tipo_participante, fila.tipo_colaboracion, fila.organizacion].filter(Boolean).join(' · '),
    estado: fila.estado as EstadoSolicitudAdmin,
    creadoEn: String(fila.creado_en),
  }))
}

async function retos(): Promise<EntradaBandeja[]> {
  const { data, error } = await crearClienteAdmin().from('solicitudes_prototipado')
    .select('id, servicio_slug, nombre, correo, tipo_participante, organizacion, titulo_reto, descripcion_reto, resultado_esperado, areas, requiere_confidencialidad, estado, creado_en')
    .order('creado_en', { ascending: false }).limit(250)
  if (error) return []
  return (data ?? []).map((fila) => ({
    id: String(fila.id),
    origen: 'prototipado',
    nombre: String(fila.nombre),
    correo: String(fila.correo),
    asunto: String(fila.titulo_reto),
    detalle: String(fila.descripcion_reto) + '\n\nResultado esperado: ' + String(fila.resultado_esperado),
    contexto: [fila.tipo_participante, fila.organizacion, ...(Array.isArray(fila.areas) ? fila.areas : []), fila.requiere_confidencialidad ? 'Solicita conversación de confidencialidad' : ''].filter(Boolean).join(' · '),
    estado: fila.estado as EstadoSolicitudAdmin,
    creadoEn: String(fila.creado_en),
  }))
}

export async function listarBandeja(): Promise<EntradaBandeja[]> {
  const [base, colaboracion, prototipado] = await Promise.all([
    listarSolicitudes().catch(() => []),
    colaboraciones(),
    retos(),
  ])
  const participacion: EntradaBandeja[] = base.map((fila) => ({
    id: fila.id,
    origen: 'participacion',
    nombre: fila.nombre,
    correo: fila.correo,
    asunto: 'Participar en el semillero',
    detalle: fila.mensaje ?? 'Sin mensaje adicional.',
    contexto: [fila.programa, ...fila.temas].filter(Boolean).join(' · '),
    estado: fila.estado,
    creadoEn: fila.creado_en,
  }))
  return [...participacion, ...colaboracion, ...prototipado].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
}
