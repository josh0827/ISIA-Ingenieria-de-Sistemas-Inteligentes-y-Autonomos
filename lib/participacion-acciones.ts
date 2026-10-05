'use server'

import { revalidatePath } from 'next/cache'
import { notificarSolicitudParticipacion } from '@/lib/correo'
import {
  esquemaSolicitudParticipacion,
  type SolicitudParticipacion,
} from '@/lib/participacion-esquema'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { supabaseServidorListo } from '@/lib/supabase/config'

export type EstadoSolicitud = {
  ok: boolean
  mensaje?: string
  error?: string
}

const ESTADO_INICIAL: EstadoSolicitud = { ok: false }
export { ESTADO_INICIAL as ESTADO_INICIAL_SOLICITUD }

function leerSolicitud(formData: FormData): SolicitudParticipacion | undefined {
  const resultado = esquemaSolicitudParticipacion.safeParse({
    nombre: formData.get('nombre'),
    correo: formData.get('correo'),
    programa: formData.get('programa') || undefined,
    temas: formData.getAll('temas'),
    mensaje: formData.get('mensaje') || undefined,
    consentimiento: formData.get('consentimiento') === 'on',
    sitioWeb: formData.get('sitioWeb') || undefined,
  })
  return resultado.success ? resultado.data : undefined
}

export async function enviarSolicitudParticipacion(
  _estado: EstadoSolicitud,
  formData: FormData,
): Promise<EstadoSolicitud> {
  const sitioWeb = formData.get('sitioWeb')
  if (typeof sitioWeb === 'string' && sitioWeb.length > 0) {
    return { ok: true, mensaje: 'Recibimos tu mensaje.' }
  }

  const solicitud = leerSolicitud(formData)
  if (!solicitud) {
    const resultado = esquemaSolicitudParticipacion.safeParse({
      nombre: formData.get('nombre'),
      correo: formData.get('correo'),
      programa: formData.get('programa') || undefined,
      temas: formData.getAll('temas'),
      mensaje: formData.get('mensaje') || undefined,
      consentimiento: formData.get('consentimiento') === 'on',
      sitioWeb: undefined,
    })
    return {
      ok: false,
      error: resultado.success ? 'Revisa los datos enviados.' : resultado.error.issues[0]?.message,
    }
  }

  if (!supabaseServidorListo()) {
    return { ok: false, error: 'El formulario no está disponible temporalmente. Puedes escribir al correo del semillero.' }
  }

  const supabase = crearClienteAdmin()
  const desde = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  const { data: reciente, error: errorConsulta } = await supabase
    .from('solicitudes_participacion')
    .select('id')
    .ilike('correo', solicitud.correo)
    .gte('creado_en', desde)
    .limit(1)

  if (errorConsulta) {
    return { ok: false, error: 'No pudimos comprobar la solicitud. Intenta nuevamente en unos minutos.' }
  }
  if ((reciente ?? []).length > 0) {
    return { ok: false, error: 'Ya recibimos una solicitud reciente con este correo. Espera unos minutos antes de intentar de nuevo.' }
  }

  const { data, error } = await supabase
    .from('solicitudes_participacion')
    .insert({
      nombre: solicitud.nombre,
      correo: solicitud.correo,
      programa: solicitud.programa || null,
      temas: solicitud.temas,
      mensaje: solicitud.mensaje || null,
      consentimiento: true,
    })
    .select('id')
    .single<{ id: string }>()

  if (error || !data) {
    return { ok: false, error: 'No fue posible registrar tu interés. Intenta nuevamente o escribe al correo del semillero.' }
  }

  await notificarSolicitudParticipacion({ id: data.id, ...solicitud })
  revalidatePath('/admin/solicitudes')
  return {
    ok: true,
    mensaje: 'Recibimos tu interés. El equipo del semillero podrá contactarte por el correo indicado.',
  }
}
