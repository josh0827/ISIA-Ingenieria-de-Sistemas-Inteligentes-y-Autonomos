import assert from 'node:assert/strict'
import test from 'node:test'
import { esCorreoUnal, exigirCorreoUnal, ErrorAcceso } from '../lib/autorizacion.ts'

test('rechaza correos externos y dominios parecidos', () => {
  for (const correo of ['persona@gmail.com', 'persona@notunal.edu.co', 'persona@unal.edu.co.example.com', '', undefined]) {
    assert.equal(esCorreoUnal(correo), false)
  }
})

test('acepta el dominio institucional sin depender de mayúsculas', () => {
  assert.equal(esCorreoUnal('estudiante@unal.edu.co'), true)
  assert.equal(esCorreoUnal('Docente@UNAL.EDU.CO'), true)
})

test('la exigencia institucional produce un error 403', () => {
  assert.throws(
    () => exigirCorreoUnal('persona@gmail.com'),
    (error) => error instanceof ErrorAcceso && error.codigo === 403,
  )
})
