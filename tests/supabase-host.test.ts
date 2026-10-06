import assert from 'node:assert/strict'
import test from 'node:test'
import { esHostSupabasePropio } from '../lib/supabase/config.ts'
import { urlImagenSupabaseSchema } from '../lib/validators/schemas.ts'

const IMAGEN = '/storage/v1/object/public/imagenes/proyectos/foto.webp'

function conProyecto(url: string | undefined, prueba: () => void) {
  const anterior = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
  else process.env.NEXT_PUBLIC_SUPABASE_URL = url
  try {
    prueba()
  } finally {
    if (anterior === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = anterior
  }
}

test('sin proyecto configurado se admite cualquier *.supabase.co', () => {
  conProyecto(undefined, () => {
    assert.equal(esHostSupabasePropio('abc.supabase.co'), true)
    assert.equal(esHostSupabasePropio('supabase.co.example.com'), false)
  })
})

test('con proyecto configurado solo se admiten sus propias imágenes', () => {
  conProyecto('https://propio.supabase.co', () => {
    assert.equal(urlImagenSupabaseSchema.safeParse(`https://propio.supabase.co${IMAGEN}`).success, true)
    assert.equal(urlImagenSupabaseSchema.safeParse(`https://ajeno.supabase.co${IMAGEN}`).success, false)
  })
})
