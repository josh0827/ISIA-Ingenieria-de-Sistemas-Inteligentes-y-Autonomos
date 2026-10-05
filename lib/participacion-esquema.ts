import { z } from 'zod'

export const TEMAS_INTERES = [
  'Inteligencia Artificial en el Borde (Edge AI)',
  'TinyML',
  'Visión por computador',
  'Procesamiento de lenguaje natural',
  'Sistemas embebidos',
  'Robótica y sistemas autónomos',
] as const

export const esquemaSolicitudParticipacion = z.object({
  nombre: z.string().trim().min(2, 'Escribe tu nombre.').max(100, 'El nombre es demasiado largo.'),
  correo: z.string().trim().toLowerCase().email('Escribe un correo válido.').max(160),
  programa: z.string().trim().max(120, 'El programa es demasiado largo.').optional(),
  temas: z.array(z.enum(TEMAS_INTERES)).min(1, 'Selecciona al menos un tema.').max(6),
  mensaje: z.string().trim().max(1200, 'El mensaje puede tener máximo 1200 caracteres.').optional(),
  consentimiento: z.literal(true, { error: 'Debes autorizar el tratamiento de estos datos para enviar la solicitud.' }),
  sitioWeb: z.string().max(0).optional(),
})

export type SolicitudParticipacion = z.infer<typeof esquemaSolicitudParticipacion>
