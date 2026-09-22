import assert from 'node:assert/strict'
import test from 'node:test'
import {
  esquemaProyectoZod,
  ESTADOS_PROYECTO,
  rutaImagenLocalSchema,
  imagenUrlSchema,
} from '../lib/validators/schemas.ts'

const base = {
  titulo: 'Proyecto de prueba',
  linea: 'Instrumentación inteligente',
  resumen: 'Resumen de prueba',
  integrantes: [],
  confirmado: false,
}

test('Zod acepta únicamente los tres estados editoriales definidos', () => {
  for (const estado of ESTADOS_PROYECTO) {
    assert.equal(esquemaProyectoZod.safeParse({ ...base, estado }).success, true)
  }
  assert.equal(esquemaProyectoZod.safeParse({ ...base, estado: 'activo' }).success, false)
  assert.equal(esquemaProyectoZod.safeParse({ ...base, estado: 'propuesta' }).success, false)
})

test('el estado de proyecto es obligatorio', () => {
  assert.equal(esquemaProyectoZod.safeParse(base).success, false)
})

test('los integrantes son opcionales durante la formulación', () => {
  const { integrantes: _integrantes, ...sinIntegrantes } = base
  assert.equal(
    esquemaProyectoZod.safeParse({ ...sinIntegrantes, estado: 'En formulación' }).success,
    true,
  )
})

test('las imágenes solo admiten rutas estáticas bajo /imagenes/', () => {
  assert.equal(
    rutaImagenLocalSchema.safeParse('/imagenes/proyectos/prototipo-01.webp').success,
    true,
  )
  assert.equal(
    rutaImagenLocalSchema.safeParse('https://firebasestorage.googleapis.com/archivo').success,
    false,
  )
  assert.equal(rutaImagenLocalSchema.safeParse('/recursos/imagen.webp').success, false)
  assert.equal(rutaImagenLocalSchema.safeParse('/imagenes/../secreto.png').success, false)
})

test('el almacenamiento adaptativo admite URLs públicas de Vercel Blob', () => {
  assert.equal(
    imagenUrlSchema.safeParse(
      'https://sitio.public.blob.vercel-storage.com/imagenes/proyectos/demo.webp',
    ).success,
    true,
  )
  assert.equal(
    imagenUrlSchema.safeParse('https://ejemplo.com/imagen.webp').success,
    false,
  )
})
