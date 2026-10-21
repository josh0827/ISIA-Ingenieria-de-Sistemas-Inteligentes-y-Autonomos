import { createHmac, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'

const repositorioFork = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  full_name: z.string().min(3).max(220),
  html_url: z.url().refine((url) => new URL(url).hostname === 'github.com'),
  description: z.string().max(500).nullable().optional(),
  owner: z.object({ login: z.string().min(1).max(100) }),
})

const eventoFork = z.object({
  forkee: repositorioFork,
  repository: z.object({ full_name: z.string().min(3).max(220) }),
  sender: z.object({ login: z.string().min(1).max(100) }).optional(),
})

export type BorradorDesdeFork = {
  slug: string
  titulo: string
  resumen: string
  repositorio: string
  propietario: string
  repositorioOrigen: string
}

export function firmaGithubValida(cuerpo: string, firma: string | null, secreto: string): boolean {
  if (!firma || !/^sha256=[a-f0-9]{64}$/i.test(firma) || !secreto) return false
  const esperada = `sha256=${createHmac('sha256', secreto).update(cuerpo).digest('hex')}`
  const recibidaBuffer = Buffer.from(firma.toLowerCase())
  const esperadaBuffer = Buffer.from(esperada.toLowerCase())
  return recibidaBuffer.length === esperadaBuffer.length && timingSafeEqual(recibidaBuffer, esperadaBuffer)
}

function slugGithub(propietario: string, repositorio: string): string {
  const base = `github-${propietario}-${repositorio}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return base.slice(0, 80).replace(/-+$/g, '')
}

export function interpretarForkGithub(payload: unknown): BorradorDesdeFork | undefined {
  const resultado = eventoFork.safeParse(payload)
  if (!resultado.success) return undefined
  const { forkee, repository } = resultado.data
  return {
    slug: slugGithub(forkee.owner.login, forkee.name),
    titulo: forkee.name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letra) => letra.toUpperCase()),
    resumen: forkee.description?.trim() || 'Repositorio importado como borrador para revisión editorial.',
    repositorio: forkee.html_url,
    propietario: forkee.owner.login,
    repositorioOrigen: repository.full_name,
  }
}
