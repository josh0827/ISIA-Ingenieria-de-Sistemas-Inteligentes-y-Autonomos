import { z } from 'zod'

export const MODALIDADES_PRACTICA = ['Presencial', 'Híbrida', 'Remota'] as const
export const ESTADOS_OPORTUNIDAD = ['borrador', 'abierta', 'cerrada', 'archivada'] as const
export const TIPOS_OPORTUNIDAD = ['práctica', 'empleo', 'convocatoria', 'reto'] as const

export const practicaOfertaSchema = z.object({
  titulo: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres.').max(180),
  tipo: z.enum(TIPOS_OPORTUNIDAD, { error: 'Selecciona un tipo de oportunidad válido.' }),
  empresaNombre: z.string().trim().min(2, 'Indica el nombre de la empresa.').max(180),
  ubicacion: z.string().trim().min(2, 'Indica la ubicación.').max(180),
  modalidad: z.enum(MODALIDADES_PRACTICA, { error: 'Selecciona una modalidad válida.' }),
  descripcion: z.string().trim().min(20, 'La descripción debe tener al menos 20 caracteres.').max(6000),
  requisitos: z.array(z.string().trim().min(1).max(300)).max(30),
  contactoEmail: z.string().trim().email('Indica un correo de contacto válido.').max(320),
  urlPostulacion: z.union([
    z.literal(''),
    z.url('La URL de postulación no es válida.').refine((valor) => valor.startsWith('https://'), 'La URL debe usar HTTPS.'),
  ]),
  estado: z.enum(ESTADOS_OPORTUNIDAD, { error: 'Selecciona un estado válido.' }),
  fechaCierre: z.union([z.literal(''), z.iso.date('Indica una fecha de cierre válida.')]),
  contactoPublico: z.boolean(),
  activa: z.boolean(),
})

export type PracticaOfertaEntrada = z.infer<typeof practicaOfertaSchema>
