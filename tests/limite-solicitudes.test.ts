import assert from 'node:assert/strict'
import test from 'node:test'
import { decidirLimite, LIMITE_SOLICITUDES_POR_HORA } from '../lib/limite-regla.ts'

test('acepta una solicitud sin duplicados y por debajo del tope', () => {
  assert.equal(decidirLimite(0, 0), 'ok')
  assert.equal(decidirLimite(0, LIMITE_SOLICITUDES_POR_HORA - 1), 'ok')
})

test('rechaza el mismo correo repetido en la ventana de 15 minutos', () => {
  assert.equal(decidirLimite(1, 0), 'duplicada')
})

test('rechaza cuando se alcanza el tope global por hora', () => {
  assert.equal(decidirLimite(0, LIMITE_SOLICITUDES_POR_HORA), 'limite')
})

test('el duplicado tiene prioridad sobre el tope global', () => {
  assert.equal(decidirLimite(2, LIMITE_SOLICITUDES_POR_HORA + 5), 'duplicada')
})
