import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { esquemaDe } from '@/lib/admin/esquemas'
import { listarDocumentos } from '@/lib/admin/datos'
import TablaAdmin from '@/componentes/admin/TablaAdmin'
import estilos from '../../admin.module.css'

type Props = { params: Promise<{ coleccion: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const esquema = esquemaDe((await params).coleccion)
  return { title: esquema?.etiqueta ?? 'Contenido' }
}

export const dynamic = 'force-dynamic'

export default async function PaginaColeccion({ params }: Props) {
  const { coleccion } = await params
  const esquema = esquemaDe(coleccion)
  if (!esquema) notFound()
  const documentos = await listarDocumentos(coleccion)

  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>{esquema.etiqueta}</h1>
          <p>{esquema.descripcion}</p>
        </div>
        <Link href={`/admin/${coleccion}/nuevo`} className={estilos.botonNuevo}>
          Añadir {esquema.etiquetaSingular}
        </Link>
      </div>
      <TablaAdmin esquema={esquema} documentos={documentos} />
    </>
  )
}
