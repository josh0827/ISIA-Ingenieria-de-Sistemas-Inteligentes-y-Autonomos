'use server'

import { revalidatePath } from 'next/cache'
import { obtenerIdea, obtenerProyecto, obtenerServicio } from '@/lib/contenido'
import { notificarSolicitudNetworking } from '@/lib/correo'
import {
  esquemaColaboracion,
  esquemaRetoPrototipado,
  type EstadoNetworking,
} from '@/lib/networking-esquemas'
import { comprobarLimiteSolicitudes } from '@/lib/limite-solicitudes'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { supabaseServidorListo } from '@/lib/supabase/config'

function trampa(formData: FormData): boolean {
  return typeof formData.get('sitioWeb') === 'string' && String(formData.get('sitioWeb')).length > 0
}

const MENSAJES_LIMITE = {
  duplicada: 'Ya recibimos una solicitud reciente con este correo.',
  limite: 'El formulario recibió muchas solicitudes. Intenta de nuevo en una hora.',
  error: 'No pudimos comprobar la solicitud. Intenta nuevamente.',
} as const

export async function enviarColaboracion(_estado: EstadoNetworking, formData: FormData): Promise<EstadoNetworking> {
  if (trampa(formData)) return { ok: true, mensaje: 'Recibimos tu mensaje.' }
  const validacion = esquemaColaboracion.safeParse({
    destinoTipo: formData.get('destinoTipo'),
    destinoSlug: formData.get('destinoSlug'),
    nombre: formData.get('nombre'),
    correo: formData.get('correo'),
    tipoParticipante: formData.get('tipoParticipante'),
    tipoColaboracion: formData.get('tipoColaboracion'),
    organizacion: formData.get('organizacion') || undefined,
    mensaje: formData.get('mensaje'),
    consentimiento: formData.get('consentimiento') === 'on',
  })
  if (!validacion.success) return { ok: false, error: validacion.error.issues[0]?.message }
  if (!supabaseServidorListo()) return { ok: false, error: 'El formulario no está disponible temporalmente.' }

  const solicitud = validacion.data
  const destino = solicitud.destinoTipo === 'proyecto'
    ? await obtenerProyecto(solicitud.destinoSlug)
    : await obtenerIdea(solicitud.destinoSlug)
  if (!destino || destino.ilustrativo) return { ok: false, error: 'Este contenido aún no está habilitado para recibir colaboraciones.' }

  const limite = await comprobarLimiteSolicitudes('solicitudes_colaboracion', solicitud.correo)
  if (limite !== 'ok') return { ok: false, error: MENSAJES_LIMITE[limite] }

  const { data, error } = await crearClienteAdmin().from('solicitudes_colaboracion').insert({
    destino_tipo: solicitud.destinoTipo,
    destino_slug: solicitud.destinoSlug,
    destino_titulo: destino.titulo,
    nombre: solicitud.nombre,
    correo: solicitud.correo,
    tipo_participante: solicitud.tipoParticipante,
    tipo_colaboracion: solicitud.tipoColaboracion,
    organizacion: solicitud.organizacion || null,
    mensaje: solicitud.mensaje,
    consentimiento: true,
  }).select('id').single<{ id: string }>()
  if (error || !data) return { ok: false, error: 'No fue posible registrar tu solicitud.' }

  await notificarSolicitudNetworking({
    id: data.id,
    tipo: 'Colaboración',
    nombre: solicitud.nombre,
    correo: solicitud.correo,
    asunto: destino.titulo,
    detalle: [solicitud.tipoParticipante, solicitud.tipoColaboracion, solicitud.mensaje].join(' · '),
  })
  revalidatePath('/admin/bandeja')
  return { ok: true, mensaje: 'Recibimos tu propuesta. El semillero la revisará desde su bandeja privada.' }
}

export async function enviarRetoPrototipado(_estado: EstadoNetworking, formData: FormData): Promise<EstadoNetworking> {
  if (trampa(formData)) return { ok: true, mensaje: 'Recibimos tu mensaje.' }
  const validacion = esquemaRetoPrototipado.safeParse({
    servicioSlug: formData.get('servicioSlug') || '',
    nombre: formData.get('nombre'),
    correo: formData.get('correo'),
    tipoParticipante: formData.get('tipoParticipante'),
    organizacion: formData.get('organizacion') || undefined,
    tituloReto: formData.get('tituloReto'),
    descripcionReto: formData.get('descripcionReto'),
    resultadoEsperado: formData.get('resultadoEsperado'),
    areas: formData.getAll('areas'),
    requiereConfidencialidad: formData.get('requiereConfidencialidad') === 'on',
    consentimiento: formData.get('consentimiento') === 'on',
  })
  if (!validacion.success) return { ok: false, error: validacion.error.issues[0]?.message }
  if (!supabaseServidorListo()) return { ok: false, error: 'El formulario no está disponible temporalmente.' }
  const solicitud = validacion.data
  if (solicitud.servicioSlug && !(await obtenerServicio(solicitud.servicioSlug))) {
    return { ok: false, error: 'La capacidad seleccionada ya no está disponible.' }
  }
  const limite = await comprobarLimiteSolicitudes('solicitudes_prototipado', solicitud.correo)
  if (limite !== 'ok') return { ok: false, error: MENSAJES_LIMITE[limite] }
  const { data, error } = await crearClienteAdmin().from('solicitudes_prototipado').insert({
    servicio_slug: solicitud.servicioSlug || null,
    nombre: solicitud.nombre,
    correo: solicitud.correo,
    tipo_participante: solicitud.tipoParticipante,
    organizacion: solicitud.organizacion || null,
    titulo_reto: solicitud.tituloReto,
    descripcion_reto: solicitud.descripcionReto,
    resultado_esperado: solicitud.resultadoEsperado,
    areas: solicitud.areas,
    requiere_confidencialidad: solicitud.requiereConfidencialidad,
    consentimiento: true,
  }).select('id').single<{ id: string }>()
  if (error || !data) return { ok: false, error: 'No fue posible registrar el reto.' }
  await notificarSolicitudNetworking({
    id: data.id,
    tipo: 'Reto de prototipado',
    nombre: solicitud.nombre,
    correo: solicitud.correo,
    asunto: solicitud.tituloReto,
    detalle: [...solicitud.areas, solicitud.descripcionReto].join(' · '),
  })
  revalidatePath('/admin/bandeja')
  return { ok: true, mensaje: 'Recibimos el reto para evaluación. Esto no crea una relación contractual ni garantiza su ejecución.' }
}
