import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { listarAuditoria } from '@/lib/admin/auditoria'
import { requerirAdministrador } from '@/lib/admin/datos'
import estilos from '../../../admin.module.css'

export const metadata: Metadata = { title: 'Auditoría del panel' }
export const dynamic = 'force-dynamic'

export default async function PaginaAuditoria() {
  try {
    await requerirAdministrador()
  } catch {
    redirect('/admin/acceso-denegado?motivo=editor')
  }
  const eventos = await listarAuditoria()
  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Auditoría</h1>
          <p>Últimos cambios realizados desde el panel. Esta vista está disponible únicamente para administradores.</p>
        </div>
      </div>
      <div className={estilos.tablaSimple}>
        <table>
          <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Recurso</th><th>Identificador</th></tr></thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(evento.creado_en))}</td>
                <td>{evento.usuario_email ?? 'Sistema'}</td>
                <td>{evento.accion}</td>
                <td>{evento.recurso_tipo}</td>
                <td>{evento.recurso_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
