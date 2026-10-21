import assert from 'node:assert/strict'
import test from 'node:test'
import { esquemaPreguntaPublica, esquemaRespuestaPregunta } from '../lib/preguntas-esquemas.ts'

test('una pregunta exige categoría, texto suficiente y consentimiento', () => {
  const base = {
    nombre: 'Ana Pérez',
    correo: 'ana@unal.edu.co',
    categoria: 'Investigación',
    pregunta: '¿Cómo puedo proponer una pregunta de investigación?',
    consentimiento: true,
  }
  assert.equal(esquemaPreguntaPublica.safeParse(base).success, true)
  assert.equal(esquemaPreguntaPublica.safeParse({ ...base, consentimiento: false }).success, false)
  assert.equal(esquemaPreguntaPublica.safeParse({ ...base, pregunta: 'Muy corta' }).success, false)
})

test('una respuesta moderada necesita UUID y contenido suficiente', () => {
  const base = {
    id: '5173af39-ff27-4dba-93a3-0e76c296f242',
    respuesta: 'Puedes usar el formulario de participación y explicar tu interés.',
    publicar: true,
  }
  assert.equal(esquemaRespuestaPregunta.safeParse(base).success, true)
  assert.equal(esquemaRespuestaPregunta.safeParse({ ...base, respuesta: 'Corta' }).success, false)
})
