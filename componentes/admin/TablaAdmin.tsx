import Link from 'next/link'
import type { DocumentoAdmin } from '@/lib/admin/datos'
import { valorColumna } from '@/lib/admin/datos'
import type { EsquemaColeccion } from '@/lib/admin/esquemas'
import EliminarBoton from './EliminarBoton'
import estilos from './TablaAdmin.module.css'

export default function TablaAdmin({ esquema, documentos }: { esquema: EsquemaColeccion; documentos: DocumentoAdmin[] }) {
  if (documentos.length === 0) {
    return <p className={estilos.vacio}>Aún no hay {esquema.etiqueta.toLowerCase()} guardadas.</p>
  }

  return (
    <div className={estilos.envoltorio}>
      <table className={estilos.tabla}>
        <thead>
          <tr>
            <th>Slug</th>
            {esquema.columnas.map((columna) => (
              <th key={columna.clave}>{columna.etiqueta}</th>
            ))}
            <th>Confirmado</th>
            <th className={estilos.columnaAcciones}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((documento) => (
            <tr key={documento.slug}>
              <td className={estilos.celdaSlug}>{documento.slug}</td>
              {esquema.columnas.map((columna) => (
                <td key={columna.clave}>{valorColumna(documento, columna.clave)}</td>
              ))}
              <td>{documento.datos.confirmado === true ? 'Sí' : 'No'}</td>
              <td>
                <div className={estilos.celdaAcciones}>
                  <Link href={`/admin/${esquema.coleccion}/${documento.slug}`} className={estilos.enlaceEditar}>
                    Editar
                  </Link>
                  <EliminarBoton coleccion={esquema.coleccion} slug={documento.slug} etiqueta={valorColumna(documento, esquema.columnas[0]?.clave ?? 'slug')} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
