import type { Metadata } from 'next'
import { actualizarEstadoSolicitud, eliminarSolicitud } from '@/lib/admin/solicitudes-acciones'
import { ESTADOS_SOLICITUD, listarSolicitudes } from '@/lib/admin/solicitudes'
import { usuarioSesion } from '@/lib/sesion'
import { obtenerUsuarioAutorizado } from '@/lib/usuarios-autorizados'
import estilos from '../../../admin.module.css'

export const metadata: Metadata = { title: 'Solicitudes de participación' }
export const dynamic = 'force-dynamic'

const ETIQUETAS = {
  nueva: 'Nueva',
  en_revision: 'En revisión',
  contactada: 'Contactada',
  cerrada: 'Cerrada',
} as const

export default async function PaginaSolicitudes() {
  const [solicitudes, sesion] = await Promise.all([listarSolicitudes(), usuarioSesion()])
  const autorizado = sesion ? await obtenerUsuarioAutorizado(sesion.id) : undefined

  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Solicitudes de participación</h1>
          <p>Manifestaciones de interés recibidas desde la sección Únete. Estos datos son privados y deben usarse únicamente para responder a cada persona.</p>
        </div>
      </div>
      {solicitudes.length === 0 ? (
        <p className={estilos.estadoVacioAdmin}>Todavía no se han recibido solicitudes.</p>
      ) : (
        <div className={estilos.listaSolicitudes}>
          {solicitudes.map((solicitud) => (
            <article key={solicitud.id} className={estilos.solicitud}>
              <div className={estilos.solicitudCabecera}>
                <div>
                  <h2>{solicitud.nombre}</h2>
                  <a href={`mailto:${solicitud.correo}`}>{solicitud.correo}</a>
                </div>
                <time dateTime={solicitud.creado_en}>{new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(solicitud.creado_en))}</time>
              </div>
              {solicitud.programa && <p><strong>Programa:</strong> {solicitud.programa}</p>}
              <p><strong>Intereses:</strong> {solicitud.temas.join(', ')}</p>
              {solicitud.mensaje && <p className={estilos.mensajeSolicitud}>{solicitud.mensaje}</p>}
              <div className={estilos.accionesSolicitud}>
                <form action={actualizarEstadoSolicitud}>
                  <input type="hidden" name="id" value={solicitud.id} />
                  <label>
                    <span className="solo-lectores">Estado</span>
                    <select name="estado" defaultValue={solicitud.estado}>
                      {ESTADOS_SOLICITUD.map((estado) => <option key={estado} value={estado}>{ETIQUETAS[estado]}</option>)}
                    </select>
                  </label>
                  <button type="submit">Guardar estado</button>
                </form>
                {autorizado?.rol === 'admin' && (
                  <form action={eliminarSolicitud}>
                    <input type="hidden" name="id" value={solicitud.id} />
                    <button type="submit" className={estilos.botonPeligro}>Eliminar datos</button>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
