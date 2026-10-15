import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import test from 'node:test'
import { firmaGithubValida, interpretarForkGithub } from '../lib/github/webhook.ts'

test('valida la firma sha256 enviada por GitHub', () => {
  const cuerpo = JSON.stringify({ evento: 'fork' })
  const secreto = 'secreto-de-prueba'
  const firma = `sha256=${createHmac('sha256', secreto).update(cuerpo).digest('hex')}`
  assert.equal(firmaGithubValida(cuerpo, firma, secreto), true)
  assert.equal(firmaGithubValida(cuerpo + 'alterado', firma, secreto), false)
  assert.equal(firmaGithubValida(cuerpo, 'sha256=invalida', secreto), false)
})

test('convierte un fork válido en un borrador estable', () => {
  const borrador = interpretarForkGithub({
    forkee: {
      id: 12,
      name: 'Robot_Movil',
      full_name: 'isia-unal/Robot_Movil',
      html_url: 'https://github.com/isia-unal/Robot_Movil',
      description: 'Prueba de navegación',
      owner: { login: 'isia-unal' },
    },
    repository: { full_name: 'organizacion/proyecto-base' },
    sender: { login: 'integrante' },
  })
  assert.equal(borrador?.slug, 'github-isia-unal-robot-movil')
  assert.equal(borrador?.propietario, 'isia-unal')
  assert.equal(borrador?.repositorioOrigen, 'organizacion/proyecto-base')
  assert.equal(interpretarForkGithub({ forkee: { name: '../privado' } }), undefined)
})
