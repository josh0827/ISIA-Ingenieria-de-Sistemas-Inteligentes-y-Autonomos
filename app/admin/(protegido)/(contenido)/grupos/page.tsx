import type { Metadata } from 'next'
import Link from 'next/link'
import { listarGruposTrabajoAdmin } from '@/lib/grupos'
import EliminarGrupoBoton from '@/componentes/admin/EliminarGrupoBoton'
import estilos from '../../../admin.module.css'
import tabla from '@/componentes/admin/TablaAdmin.module.css'

export const metadata: Metadata = { title: 'Grupos de trabajo' }
export const dynamic = 'force-dynamic'

export default async function AdminGrupos() {
  const grupos = await listarGruposTrabajoAdmin()
  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Grupos de trabajo</h1>
          <p>Administra integrantes, recursos, documentos e imágenes de cada grupo.</p>
        </div>
        <Link href="/admin/grupos/nuevo" className={estilos.botonNuevo}>Añadir grupo</Link>
      </div>
      <div className={tabla.envoltorio}>
        <table className={tabla.tabla}>
          <thead><tr><th>Grupo</th><th>Slug</th><th>Integrantes</th><th>Acciones</th></tr></thead>
          <tbody>
            {grupos.map((grupo) => (
              <tr key={grupo.slug}>
                <td>{grupo.nombre}</td>
                <td className={tabla.celdaSlug}>{grupo.slug}</td>
                <td>{grupo.integrantes.length}</td>
                <td><div className={tabla.celdaAcciones}>
                  <Link href={`/admin/grupos/${grupo.slug}`} className={tabla.enlaceEditar}>Editar</Link>
                  <EliminarGrupoBoton slug={grupo.slug} nombre={grupo.nombre} />
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
