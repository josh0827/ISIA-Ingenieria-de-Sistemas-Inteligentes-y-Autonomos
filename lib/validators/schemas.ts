import { z } from 'zod'
import { esHostSupabasePropio } from '../supabase/config.ts'

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

export const urlImagenSupabaseSchema = z
  .url('La URL de la imagen no es válida.')
  .refine((valor) => {
    try {
      const url = new URL(valor)
      return (
        url.protocol === 'https:' &&
        esHostSupabasePropio(url.hostname) &&
        url.pathname.startsWith('/storage/v1/object/public/imagenes/')
      )
    } catch {
      return false
    }
  }, 'La URL debe pertenecer al bucket público de imágenes de Supabase.')

export const imagenUrlSchema = z.union([
  rutaImagenLocalSchema,
  urlImagenSupabaseSchema,
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
