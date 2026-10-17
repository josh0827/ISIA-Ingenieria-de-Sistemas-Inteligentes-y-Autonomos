import { z } from 'zod'

export type EstadoNetworking = { ok: boolean; mensaje?: string; error?: string }
export const ESTADO_NETWORKING_INICIAL: EstadoNetworking = { ok: false }

export const TIPOS_PARTICIPANTE = [
  'pregrado',
  'posgrado',
  'egresado',
  'docente_investigador',
  'empresa_institucion',
  'externo',
] as const

export const TIPOS_COLABORACION = [
  'integrar_equipo',
  'mentoria',
  'conocimiento_tecnico',
  'equipos_infraestructura',
  'alianza',
  'apoyo_material_financiero',
  'informacion',
] as const

export const AREAS_PROTOTIPADO = [
  'Inteligencia artificial',
  'Visión por computador',
  'Robótica',
  'Internet de las cosas',
  'Sistemas embebidos',
  'Software',
  'Instrumentación',
  'Otra',
] as const

const correo = z.string().trim().toLowerCase().email('Indica un correo válido.').max(160)

export const esquemaColaboracion = z.object({
  destinoTipo: z.enum(['proyecto', 'idea']),
  destinoSlug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(80),
  nombre: z.string().trim().min(2, 'Indica tu nombre.').max(100),
  correo,
  tipoParticipante: z.enum(TIPOS_PARTICIPANTE, { error: 'Selecciona cómo participas.' }),
  tipoColaboracion: z.enum(TIPOS_COLABORACION, { error: 'Selecciona una forma de colaboración.' }),
  organizacion: z.string().trim().max(180).optional(),
  mensaje: z.string().trim().min(20, 'Cuéntanos tu propuesta en al menos 20 caracteres.').max(1800),
  consentimiento: z.literal(true, { error: 'Debes autorizar el tratamiento de los datos.' }),
})

export const esquemaRetoPrototipado = z.object({
  servicioSlug: z.union([z.literal(''), z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(80)]),
  nombre: z.string().trim().min(2, 'Indica tu nombre.').max(100),
  correo,
  tipoParticipante: z.enum(TIPOS_PARTICIPANTE, { error: 'Selecciona cómo participas.' }),
  organizacion: z.string().trim().max(180).optional(),
  tituloReto: z.string().trim().min(3, 'Resume el reto.').max(180),
  descripcionReto: z.string().trim().min(30, 'Describe el contexto en al menos 30 caracteres.').max(3000),
  resultadoEsperado: z.string().trim().min(10, 'Describe el resultado que esperas.').max(1200),
  areas: z.array(z.enum(AREAS_PROTOTIPADO)).min(1, 'Selecciona al menos un área.').max(8),
  requiereConfidencialidad: z.boolean(),
  consentimiento: z.literal(true, { error: 'Debes autorizar el tratamiento de los datos.' }),
})

export type SolicitudColaboracion = z.infer<typeof esquemaColaboracion>
export type SolicitudRetoPrototipado = z.infer<typeof esquemaRetoPrototipado>
