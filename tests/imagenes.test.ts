import assert from 'node:assert/strict'
import test from 'node:test'
import {
  validarArchivoImagen,
  validarContenidoImagen,
} from '../lib/storage/validacion.ts'

const PNG_MINIMO = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test('acepta una imagen PNG válida dentro del límite', () => {
  const archivo = new File([PNG_MINIMO], 'Prueba Ángulo 01.PNG', { type: 'image/png' })
  assert.equal(validarArchivoImagen(archivo), undefined)
})

test('rechaza archivos cuyo contenido no corresponde al MIME declarado', async () => {
  const archivo = new File([Buffer.from('esto no es una imagen')], 'falsa.png', {
    type: 'image/png',
  })
  assert.match((await validarContenidoImagen(archivo)) ?? '', /contenido del archivo no corresponde/i)
})
