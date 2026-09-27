import assert from 'node:assert/strict'
import test from 'node:test'
import { grupoTrabajoSchema } from '../lib/validators/grupos.ts'

const grupoValido = {
  slug: 'robotica-drones',
  nombre: 'Robótica y Drones',
  descripcion: 'Descripción del grupo.',
  integrantes: ['Integrante confirmado'],
  repositorios: [{ nombre: 'Código', url: 'https://github.com/isia/proyecto' }],
  documentos: [{ nombre: 'Informe', url: 'https://unal.edu.co/informe.pdf' }],
  galeriaImagenes: [],
}

test('acepta un grupo con recursos HTTPS y listas estructuradas', () => {
  assert.equal(grupoTrabajoSchema.safeParse(grupoValido).success, true)
})

test('rechaza slugs y enlaces inseguros', () => {
  assert.equal(grupoTrabajoSchema.safeParse({ ...grupoValido, slug: 'Grupo Inválido' }).success, false)
  assert.equal(grupoTrabajoSchema.safeParse({
    ...grupoValido,
    repositorios: [{ nombre: 'Código', url: 'http://ejemplo.test/repo' }],
  }).success, false)
})
