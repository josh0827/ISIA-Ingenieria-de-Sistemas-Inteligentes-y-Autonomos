import { z } from 'zod'

export const ESTADOS_PROYECTO = [
  'En formulación',
  'Prototipado',
  'Fase inicial',
] as const

export const rutaImagenLocalSchema = z
  .string()
  .startsWith('/imagenes/', {
    message: 'La ruta de la imagen debe ser una dirección local (/imagenes/...)',
  })
  .regex(
    /^\/imagenes\/[a-z0-9/_-]+\.(?:avif|webp|png|jpe?g|svg)$/i,
    'La ruta de la imagen local no tiene un formato válido.',
  )

export const urlImagenVercelSchema = z
  .url('La URL de la imagen no es válida.')
  .refine((valor) => {
    try {
      const url = new URL(valor)
      return (
        url.protocol === 'https:' &&
        url.hostname.endsWith('.public.blob.vercel-storage.com')
      )
    } catch {
      return false
    }
  }, 'La URL debe pertenecer al almacenamiento público de Vercel Blob.')

export const imagenUrlSchema = z.union([
  rutaImagenLocalSchema,
  urlImagenVercelSchema,
])

export const esquemaProyectoZod = z
  .object({
    titulo: z.string().min(1, 'El título es obligatorio.'),
    estado: z.enum(ESTADOS_PROYECTO, {
      error: 'Selecciona un estado válido.',
    }),
    linea: z.string().optional(),
    resumen: z.string().min(1, 'El resumen es obligatorio.'),
    portada: imagenUrlSchema.optional(),
    integrantes: z.array(z.string()).default([]),
    confirmado: z.boolean(),
  })
  .passthrough()

export const esquemaNovedadImagenZod = z.object({
  imagen: imagenUrlSchema.optional(),
})

export const esquemaIntegranteImagenZod = z.object({
  foto: imagenUrlSchema.optional(),
})

export const esquemaGaleriaImagenZod = z.object({
  imagen: imagenUrlSchema,
})
