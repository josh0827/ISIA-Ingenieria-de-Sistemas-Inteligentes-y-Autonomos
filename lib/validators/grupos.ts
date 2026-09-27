import { z } from 'zod'
import { imagenUrlSchema } from './schemas.ts'

export const enlaceGrupoSchema = z.object({
  nombre: z.string().trim().min(1, 'Cada enlace necesita un nombre.').max(120),
  url: z.url('Cada enlace debe tener una URL válida.').refine(
    (valor) => valor.startsWith('https://'),
    'Los enlaces deben usar HTTPS.',
  ),
})

export const grupoTrabajoSchema = z.object({
  slug: z.string().regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'El slug solo admite minúsculas, números y guiones.',
  ).max(80),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio.').max(160),
  descripcion: z.string().trim().min(1, 'La descripción es obligatoria.').max(3000),
  imagenPortada: imagenUrlSchema.optional(),
  integrantes: z.array(z.string().trim().min(1).max(120)).max(100),
  repositorios: z.array(enlaceGrupoSchema).max(30),
  documentos: z.array(enlaceGrupoSchema).max(50),
  galeriaImagenes: z.array(imagenUrlSchema).max(30),
})

export type GrupoTrabajoEntrada = z.infer<typeof grupoTrabajoSchema>
