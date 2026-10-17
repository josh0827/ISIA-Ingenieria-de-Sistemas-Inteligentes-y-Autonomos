import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { listarAuditoria } from '@/lib/admin/auditoria'
import { requerirAdministrador } from '@/lib/admin/datos'
import estilos from '../../../admin.module.css'

export const metadata: Metadata = { title: 'Auditoría del panel' }
export const dynamic = 'force-dynamic'

type Busqueda = Promise<{ pagina?: string; usuario?: string; recurso?: string }>

export default async function PaginaAuditoria({ searchParams }: { searchParams: Busqueda }) {
  try {
    await requerirAdministrador()
  } catch {
    redirect('/admin/acceso-denegado?motivo=editor')
  }
  const { pagina: paginaTexto, usuario, recurso } = await searchParams
  const pagina = Math.max(Number.parseInt(paginaTexto ?? '1', 10) || 1, 1)
  const { filas: eventos, hayMas } = await listarAuditoria({ pagina, usuario, recurso })
  const enlace = (destino: number) => {
    const parametros = new URLSearchParams()
    if (usuario) parametros.set('usuario', usuario)
    if (recurso) parametros.set('recurso', recurso)
    parametros.set('pagina', String(destino))
    return `/admin/auditoria?${parametros}`
  }
  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Auditoría</h1>
          <p>Últimos cambios realizados desde el panel. Esta vista está disponible únicamente para administradores.</p>
        </div>
      </div>
      <form method="get" className={estilos.filtrosAuditoria}>
        <label>
          Usuario
          <input name="usuario" defaultValue={usuario ?? ''} placeholder="correo" maxLength={80} />
        </label>
        <label>
          Recurso
          <input name="recurso" defaultValue={recurso ?? ''} placeholder="por ejemplo, proyectos" maxLength={60} />
        </label>
        <button type="submit">Filtrar</button>
      </form>
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
        {eventos.length === 0 && <p>No hay eventos con estos filtros.</p>}
      </div>
      <nav className={estilos.paginacionAuditoria} aria-label="Paginación de auditoría">
        {pagina > 1 && <Link href={enlace(pagina - 1)}>← Anteriores</Link>}
        <span>Página {pagina}</span>
        {hayMas && <Link href={enlace(pagina + 1)}>Siguientes →</Link>}
      </nav>
    </>
  )
}
