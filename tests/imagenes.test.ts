import assert from 'node:assert/strict'
import { readFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { guardarImagen } from '../lib/storage/upload.ts'

const PNG_MINIMO = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test('guarda una imagen con nombre saneado y retorna una ruta local', async () => {
  const archivo = new File([PNG_MINIMO], 'Prueba Ángulo 01.PNG', { type: 'image/png' })
  const ruta = await guardarImagen(archivo, 'proyectos')
  const absoluta = path.resolve(process.cwd(), 'public', `.${ruta}`)

  try {
    assert.match(
      ruta,
      /^\/imagenes\/proyectos\/\d+-prueba-angulo-01-[a-f0-9]{8}\.png$/,
    )
    assert.deepEqual(await readFile(absoluta), PNG_MINIMO)
  } finally {
    await unlink(absoluta)
  }
})

test('rechaza archivos cuyo contenido no corresponde al MIME declarado', async () => {
  const archivo = new File([Buffer.from('esto no es una imagen')], 'falsa.png', {
    type: 'image/png',
  })
  await assert.rejects(
    guardarImagen(archivo, 'noticias'),
    /contenido del archivo no corresponde/i,
  )
})

test('informa con claridad cuando Vercel Blob no tiene token', async () => {
  const vercelAnterior = process.env.VERCEL
  const tokenAnterior = process.env.BLOB_READ_WRITE_TOKEN
  process.env.VERCEL = '1'
  delete process.env.BLOB_READ_WRITE_TOKEN

  try {
    const archivo = new File([PNG_MINIMO], 'imagen.png', { type: 'image/png' })
    await assert.rejects(
      guardarImagen(archivo, 'proyectos'),
      /falta BLOB_READ_WRITE_TOKEN/i,
    )
  } finally {
    if (vercelAnterior === undefined) delete process.env.VERCEL
    else process.env.VERCEL = vercelAnterior
    if (tokenAnterior === undefined) delete process.env.BLOB_READ_WRITE_TOKEN
    else process.env.BLOB_READ_WRITE_TOKEN = tokenAnterior
  }
})
