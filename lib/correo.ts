import 'server-only'

import { SITIO } from '@/lib/sitio'

type AvisoSolicitud = {
  id: string
  nombre: string
  correo: string
  programa?: string
  temas: string[]
  mensaje?: string
}

type AvisoNetworking = {
  id: string
  tipo: 'Colaboración' | 'Reto de prototipado'
  nombre: string
  correo: string
  asunto: string
  detalle: string
}

function escaparHtml(valor: string): string {
  return valor.replace(/[&<>'"]/g, (caracter) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[caracter] ?? caracter)
}

type Mensaje = { asunto: string; titulo: string; detalle: string; pie: string; responderA: string }

/**
 * Envía un aviso opcional. La solicitud ya debe estar guardada antes de llamar
 * esta función: una caída del proveedor de correo no puede perder el registro.
 * Los fallos se registran en el log del servidor para poder detectarlos.
 */
async function enviarAviso(mensaje: Mensaje): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const remitente = process.env.RESEND_FROM_EMAIL?.trim()
  if (!apiKey || !remitente) return false

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: remitente,
        to: [SITIO.correo],
        reply_to: mensaje.responderA,
        subject: mensaje.asunto,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1d1d1f"><h1 style="color:#35522f">${mensaje.titulo}</h1>${mensaje.detalle}<p>${mensaje.pie}</p></div>`,
      }),
      cache: 'no-store',
    })
    if (!respuesta.ok) console.error(`[correo] Resend respondió ${respuesta.status} al enviar el aviso.`)
    return respuesta.ok
  } catch (error) {
    console.error('[correo] No se pudo contactar a Resend.', error instanceof Error ? error.message : error)
    return false
  }
}

export function notificarSolicitudParticipacion(solicitud: AvisoSolicitud): Promise<boolean> {
  const detalle = [
    `<p><strong>Nombre:</strong> ${escaparHtml(solicitud.nombre)}</p>`,
    `<p><strong>Correo:</strong> ${escaparHtml(solicitud.correo)}</p>`,
    solicitud.programa ? `<p><strong>Programa:</strong> ${escaparHtml(solicitud.programa)}</p>` : '',
    `<p><strong>Temas:</strong> ${solicitud.temas.map(escaparHtml).join(', ')}</p>`,
    solicitud.mensaje ? `<p><strong>Mensaje:</strong><br>${escaparHtml(solicitud.mensaje).replace(/\n/g, '<br>')}</p>` : '',
    `<p><strong>Identificador:</strong> ${escaparHtml(solicitud.id)}</p>`,
  ].join('')
  return enviarAviso({
    asunto: `Nueva manifestación de interés en ISIA — ${solicitud.nombre}`,
    titulo: 'Nueva manifestación de interés',
    detalle,
    pie: 'Gestiona esta solicitud desde el panel de administración de ISIA.',
    responderA: solicitud.correo,
  })
}

export function notificarSolicitudNetworking(solicitud: AvisoNetworking): Promise<boolean> {
  const detalle = [
    `<p><strong>Tipo:</strong> ${escaparHtml(solicitud.tipo)}</p>`,
    `<p><strong>Asunto:</strong> ${escaparHtml(solicitud.asunto)}</p>`,
    `<p><strong>Nombre:</strong> ${escaparHtml(solicitud.nombre)}</p>`,
    `<p><strong>Correo:</strong> ${escaparHtml(solicitud.correo)}</p>`,
    `<p><strong>Detalle:</strong><br>${escaparHtml(solicitud.detalle).replace(/\n/g, '<br>')}</p>`,
    `<p><strong>Identificador:</strong> ${escaparHtml(solicitud.id)}</p>`,
  ].join('')
  return enviarAviso({
    asunto: `${solicitud.tipo} en ISIA — ${solicitud.asunto}`,
    titulo: 'Nueva solicitud de networking',
    detalle,
    pie: 'Gestiona esta solicitud desde la bandeja del panel ISIA.',
    responderA: solicitud.correo,
  })
}
