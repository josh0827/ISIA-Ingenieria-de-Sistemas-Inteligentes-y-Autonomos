import 'server-only'

import { crearClienteAdmin } from '@/lib/supabase/server'

export const ESTADOS_SOLICITUD = ['nueva', 'en_revision', 'contactada', 'cerrada'] as const
export type EstadoSolicitudAdmin = (typeof ESTADOS_SOLICITUD)[number]

export type SolicitudAdmin = {
  id: string
  nombre: string
  correo: string
  programa: string | null
  temas: string[]
  mensaje: string | null
  estado: EstadoSolicitudAdmin
  creado_en: string
}

export async function listarSolicitudes(): Promise<SolicitudAdmin[]> {
  const { data, error } = await crearClienteAdmin()
    .from('solicitudes_participacion')
    .select('id, nombre, correo, programa, temas, mensaje, estado, creado_en')
    .order('creado_en', { ascending: false })
    .limit(250)
  if (error) throw new Error(error.message)
  return (data ?? []) as SolicitudAdmin[]
}
