'use server'

import { revalidatePath } from 'next/cache'
import { requerirAdministrador } from '@/lib/admin/datos'
import { registrarAuditoria } from '@/lib/admin/auditoria'
import { contarReferenciasImagen } from '@/lib/admin/multimedia'
import { eliminarImagen } from '@/lib/storage/upload'

export async function eliminarMultimediaNoUsada(formData: FormData): Promise<void> {
  const usuario = await requerirAdministrador()
  const url = String(formData.get('url') ?? '')
  if (!url.startsWith('https://') || !url.includes('/storage/v1/object/public/imagenes/')) {
    throw new Error('La imagen indicada no pertenece al almacenamiento de ISIA.')
  }
  if (await contarReferenciasImagen(url)) {
    throw new Error('La imagen todavía está vinculada a contenido del sitio.')
  }
  if (!(await eliminarImagen(url))) throw new Error('No se pudo eliminar la imagen de Storage.')
  await registrarAuditoria({
    usuarioId: usuario.id,
    usuarioEmail: usuario.correo,
    accion: 'eliminar_archivo_sin_uso',
    recursoTipo: 'multimedia',
    recursoId: url.split('/').pop() ?? 'imagen',
  })
  revalidatePath('/admin/multimedia')
}
