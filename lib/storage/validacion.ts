const LIMITE_BYTES = 8 * 1024 * 1024

export const FORMATOS_IMAGEN = {
  'image/jpeg': { extension: 'jpg', firma: 'ffd8ff' },
  'image/png': { extension: 'png', firma: '89504e470d0a1a0a' },
  'image/webp': { extension: 'webp', firma: '52494646' },
  'image/avif': { extension: 'avif', firma: '' },
} as const

export function formatoDeImagen(archivo: File) {
  return FORMATOS_IMAGEN[archivo.type as keyof typeof FORMATOS_IMAGEN]
}

export function validarArchivoImagen(archivo: File): string | undefined {
  if (archivo.size === 0) return 'Selecciona una imagen.'
  if (archivo.size > LIMITE_BYTES) return 'La imagen supera el límite de 8 MB.'
  if (!formatoDeImagen(archivo)) return 'La imagen debe ser JPG, PNG, WebP o AVIF.'
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
  const formato = FORMATOS_IMAGEN[tipo as keyof typeof FORMATOS_IMAGEN]
  return Boolean(
    formato?.firma &&
      buffer.subarray(0, formato.firma.length / 2).toString('hex') === formato.firma,
  )
}

export async function validarContenidoImagen(file: File): Promise<string | undefined> {
  const error = validarArchivoImagen(file)
  if (error) return error
  const buffer = Buffer.from(await file.arrayBuffer())
  return firmaValida(buffer, file.type)
    ? undefined
    : 'El contenido del archivo no corresponde a un formato de imagen permitido.'
}

export async function bufferImagenValidada(file: File): Promise<Buffer> {
  const error = await validarContenidoImagen(file)
  if (error) throw new Error(error)
  return Buffer.from(await file.arrayBuffer())
}
