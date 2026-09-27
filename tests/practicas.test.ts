import assert from 'node:assert/strict'
import test from 'node:test'
import { practicaOfertaSchema } from '../lib/validators/practicas.ts'

const ofertaValida = {
  titulo: 'Práctica en sistemas embebidos',
  empresaNombre: 'Organización autorizada',
  ubicacion: 'Manizales, Caldas',
  modalidad: 'Híbrida',
  descripcion: 'Apoyo a una iniciativa de desarrollo y evaluación de sistemas embebidos.',
  requisitos: ['Interés por sistemas embebidos'],
  contactoEmail: 'contacto@empresa.co',
  urlPostulacion: 'https://empresa.co/practicas',
  activa: true,
}

test('acepta una oferta de práctica con modalidad y postulación HTTPS', () => {
  assert.equal(practicaOfertaSchema.safeParse(ofertaValida).success, true)
})

test('rechaza una modalidad, correo o URL de postulación inválidos', () => {
  assert.equal(practicaOfertaSchema.safeParse({ ...ofertaValida, modalidad: 'Mixta' }).success, false)
  assert.equal(practicaOfertaSchema.safeParse({ ...ofertaValida, contactoEmail: 'correo-invalido' }).success, false)
  assert.equal(practicaOfertaSchema.safeParse({ ...ofertaValida, urlPostulacion: 'http://empresa.co/practicas' }).success, false)
})
