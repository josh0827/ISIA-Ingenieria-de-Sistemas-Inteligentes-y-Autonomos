import 'server-only'

import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { put } from '@vercel/blob'

const LIMITE_BYTES = 8 * 1024 * 1024
const FORMATOS = {
  'image/jpeg': { extension: 'jpg', firma: 'ffd8ff' },
  'image/png': { extension: 'png', firma: '89504e470d0a1a0a' },
  'image/webp': { extension: 'webp', firma: '52494646' },
  'image/avif': { extension: 'avif', firma: '' },
} as const

function nombreSeguro(nombre: string): string {
  const base = path.basename(nombre, path.extname(nombre))
  return (
    base
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'imagen'
  )
}

function formatoDe(archivo: File) {
  return FORMATOS[archivo.type as keyof typeof FORMATOS]
}

export function validarArchivoImagen(archivo: File): string | undefined {
  if (archivo.size === 0) return 'Selecciona una imagen.'
  if (archivo.size > LIMITE_BYTES) return 'La imagen supera el límite de 8 MB.'
  if (!formatoDe(archivo)) return 'La imagen debe ser JPG, PNG, WebP o AVIF.'
  return undefined
}

function firmaValida(buffer: Buffer, tipo: string): boolean {
  if (tipo === 'image/webp') {
    return (
      buffer.subarray(0, 4).toString('hex') === '52494646' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    )
  }
  if (tipo === 'image/avif') {
    return buffer.length >= 12 && buffer.subarray(4, 12).toString('ascii').includes('ftyp')
  }
  const formato = FORMATOS[tipo as keyof typeof FORMATOS]
  return Boolean(
    formato?.firma &&
      buffer.subarray(0, formato.firma.length / 2).toString('hex') === formato.firma,
  )
}

export async function guardarImagen(file: File, folder: string): Promise<string> {
  const error = validarArchivoImagen(file)
  if (error) throw new Error(error)
  if (!/^[a-z0-9-]+$/.test(folder)) {
    throw new Error('La carpeta de imágenes solicitada no es válida.')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (!firmaValida(buffer, file.type)) {
    throw new Error('El contenido del archivo no corresponde a un formato de imagen permitido.')
  }

  const formato = formatoDe(file)
  const filename = `${Date.now()}-${nombreSeguro(file.name)}-${randomUUID().slice(0, 8)}.${formato.extension}`

  if (process.env.VERCEL) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('Vercel Blob no está configurado: falta BLOB_READ_WRITE_TOKEN.')
    }
    const blob = await put(`imagenes/${folder}/${filename}`, buffer, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    })
    return blob.url
  }

  const publicDir = path.join(process.cwd(), 'public', 'imagenes', folder)
  await mkdir(publicDir, { recursive: true })
  await writeFile(path.join(publicDir, filename), buffer, { flag: 'wx' })
  return `/imagenes/${folder}/${filename}`
}
