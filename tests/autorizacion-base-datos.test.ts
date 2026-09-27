import assert from 'node:assert/strict'
import test from 'node:test'
import { ErrorAcceso } from '../lib/autorizacion.ts'

test('el acceso sin sesión conserva el código 401', () => {
  const error = new ErrorAcceso('No hay una sesión activa.', 401, 'sesion')
  assert.equal(error.codigo, 401)
  assert.equal(error.motivo, 'sesion')
})

test('el rechazo por editor conserva el código 403', () => {
  const error = new ErrorAcceso('Usuario no autorizado.', 403, 'editor')
  assert.equal(error.codigo, 403)
  assert.equal(error.motivo, 'editor')
})
