import assert from 'node:assert/strict'
import test from 'node:test'
import { esquemaColaboracion, esquemaRetoPrototipado } from '../lib/networking-esquemas.ts'

test('una colaboración exige destino, perfil, tipo, mensaje y consentimiento', () => {
  const base = {
    destinoTipo: 'proyecto',
    destinoSlug: 'robot-movil',
    nombre: 'Ana Pérez',
    correo: 'ana@unal.edu.co',
    tipoParticipante: 'posgrado',
    tipoColaboracion: 'mentoria',
    mensaje: 'Quiero aportar experiencia en validación de sistemas.',
    consentimiento: true,
  }
  assert.equal(esquemaColaboracion.safeParse(base).success, true)
  assert.equal(esquemaColaboracion.safeParse({ ...base, consentimiento: false }).success, false)
  assert.equal(esquemaColaboracion.safeParse({ ...base, destinoSlug: '../privado' }).success, false)
})

test('un reto de prototipado requiere contexto, resultado y al menos un área', () => {
  const base = {
    servicioSlug: '',
    nombre: 'Organización aliada',
    correo: 'contacto@organizacion.co',
    tipoParticipante: 'empresa_institucion',
    organizacion: 'Organización aliada',
    tituloReto: 'Monitoreo de variables',
    descripcionReto: 'Necesitamos validar una prueba de concepto para capturar variables en campo.',
    resultadoEsperado: 'Un prototipo evaluable y una memoria de limitaciones.',
    areas: ['Internet de las cosas'],
    requiereConfidencialidad: true,
    consentimiento: true,
  }
  assert.equal(esquemaRetoPrototipado.safeParse(base).success, true)
  assert.equal(esquemaRetoPrototipado.safeParse({ ...base, areas: [] }).success, false)
})
