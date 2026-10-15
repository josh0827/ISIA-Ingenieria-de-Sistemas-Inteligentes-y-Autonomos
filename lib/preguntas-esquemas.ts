import { z } from 'zod'

export const CATEGORIAS_PREGUNTA = [
  'Participación',
  'Proyectos e ideas',
  'Prototipado',
  'Oportunidades',
  'Investigación',
  'Otra',
] as const

export const ESTADOS_PREGUNTA = ['pendiente', 'respondida', 'archivada'] as const

export const esquemaPreguntaPublica = z.object({
  nombre: z.string().trim().min(2, 'Indica tu nombre.').max(100),
  correo: z.string().trim().toLowerCase().email('Indica un correo válido.').max(160),
  categoria: z.enum(CATEGORIAS_PREGUNTA, { error: 'Selecciona una categoría.' }),
  pregunta: z.string().trim().min(15, 'Escribe una pregunta de al menos 15 caracteres.').max(1200),
  consentimiento: z.literal(true, { error: 'Debes autorizar el tratamiento de los datos.' }),
})

export const esquemaRespuestaPregunta = z.object({
  id: z.uuid(),
  respuesta: z.string().trim().min(10, 'La respuesta debe tener al menos 10 caracteres.').max(3000),
  publicar: z.boolean(),
})
