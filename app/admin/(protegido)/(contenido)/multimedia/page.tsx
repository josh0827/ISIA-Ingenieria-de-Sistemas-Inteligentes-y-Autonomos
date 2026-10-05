import type { Metadata } from 'next'
import Image from 'next/image'
import { listarMultimedia } from '@/lib/admin/multimedia'
import { eliminarMultimediaNoUsada } from '@/lib/admin/multimedia-acciones'
import { usuarioSesion } from '@/lib/sesion'
import { obtenerUsuarioAutorizado } from '@/lib/usuarios-autorizados'
import estilos from '../../../admin.module.css'

export const metadata: Metadata = { title: 'Biblioteca multimedia' }
export const dynamic = 'force-dynamic'

function tamano(bytes?: number): string {
  if (!bytes) return 'Tamaño no disponible'
  return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default async function PaginaMultimedia() {
  const [archivos, sesion] = await Promise.all([listarMultimedia(), usuarioSesion()])
  const usuario = sesion ? await obtenerUsuarioAutorizado(sesion.id) : undefined
  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Biblioteca multimedia</h1>
          <p>Inventario del bucket público de imágenes. Los archivos en uso se protegen; solo un administrador puede eliminar archivos sin referencias.</p>
        </div>
      </div>
      {archivos.length === 0 ? <p className={estilos.estadoVacioAdmin}>No hay imágenes cargadas desde el panel.</p> : (
        <div className={estilos.rejillaMultimedia}>
          {archivos.map((archivo) => (
            <article className={estilos.archivoMultimedia} key={archivo.ruta}>
              <div className={estilos.miniaturaMultimedia}>
                <Image src={archivo.url} alt="" fill sizes="(max-width: 700px) 90vw, 240px" />
              </div>
              <div>
                <h2>{archivo.ruta}</h2>
                <p>{tamano(archivo.bytes)} · {archivo.referencias ? `${archivo.referencias} referencia(s)` : 'Sin uso'}</p>
              </div>
              {usuario?.rol === 'admin' && archivo.referencias === 0 && (
                <form action={eliminarMultimediaNoUsada}>
                  <input type="hidden" name="url" value={archivo.url} />
                  <button type="submit" className={estilos.botonPeligro}>Eliminar archivo</button>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
