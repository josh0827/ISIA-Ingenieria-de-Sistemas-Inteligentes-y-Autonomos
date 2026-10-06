import assert from 'node:assert/strict'
import test from 'node:test'
import {
  puedeEditarContenido,
  puedeEliminarPracticas,
  puedeGestionarPracticas,
  type UsuarioAutorizado,
} from '../lib/roles.ts'

function usuario(rol: UsuarioAutorizado['rol'], activo = true): UsuarioAutorizado {
  return { id: '00000000-0000-0000-0000-000000000001', email: 'usuario@ejemplo.co', rol, activo }
}

test('administradores y editores pueden gestionar contenido general', () => {
  assert.equal(puedeEditarContenido(usuario('admin')), true)
  assert.equal(puedeEditarContenido(usuario('editor')), true)
  assert.equal(puedeEditarContenido(usuario('empresa')), false)
})

test('una empresa activa puede gestionar prácticas, no contenido general', () => {
  assert.equal(puedeGestionarPracticas(usuario('empresa')), true)
  assert.equal(puedeGestionarPracticas(usuario('empresa', false)), false)
})

test('solo administradores activos pueden eliminar prácticas', () => {
  assert.equal(puedeEliminarPracticas(usuario('admin')), true)
  assert.equal(puedeEliminarPracticas(usuario('editor')), false)
  assert.equal(puedeEliminarPracticas(usuario('empresa')), false)
  assert.equal(puedeEliminarPracticas(usuario('admin', false)), false)
})
