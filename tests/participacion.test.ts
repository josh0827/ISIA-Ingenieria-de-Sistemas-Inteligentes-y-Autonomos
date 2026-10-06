import test from 'node:test'
import assert from 'node:assert/strict'
import { esquemaSolicitudParticipacion } from '../lib/participacion-esquema.ts'

test('acepta una manifestación de interés con tema y consentimiento', () => {
  const resultado = esquemaSolicitudParticipacion.safeParse({
    nombre: 'Estudiante ISIA',
    correo: 'estudiante@unal.edu.co',
    programa: 'Ingeniería Electrónica',
    temas: ['TinyML'],
    mensaje: 'Quiero conocer los proyectos disponibles.',
    consentimiento: true,
  })
  assert.equal(resultado.success, true)
})

test('rechaza formularios sin intereses o sin consentimiento', () => {
  const base = {
    nombre: 'Estudiante ISIA',
    correo: 'estudiante@unal.edu.co',
    temas: [],
    consentimiento: false,
  }
  assert.equal(esquemaSolicitudParticipacion.safeParse(base).success, false)
})

test('rechaza el campo trampa antispam cuando contiene texto', () => {
  const resultado = esquemaSolicitudParticipacion.safeParse({
    nombre: 'Estudiante ISIA',
    correo: 'estudiante@unal.edu.co',
    temas: ['Visión por computador'],
    consentimiento: true,
    sitioWeb: 'https://spam.invalid',
  })
  assert.equal(resultado.success, false)
})
