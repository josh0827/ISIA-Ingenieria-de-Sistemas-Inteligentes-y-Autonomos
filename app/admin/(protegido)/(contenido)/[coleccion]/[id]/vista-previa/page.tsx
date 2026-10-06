import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { esquemaDe } from '@/lib/admin/esquemas'
import { obtenerAnidado, obtenerDocumento, valorColumna } from '@/lib/admin/datos'
import { imagenSegura, markdownAHtml, texto } from '@/lib/contenido'
import estilos from '../../../../../admin.module.css'

type Props = { params: Promise<{ coleccion: string; id: string }> }

export const metadata: Metadata = { title: 'Vista previa editorial' }
export const dynamic = 'force-dynamic'

export default async function PaginaVistaPrevia({ params }: Props) {
  const { coleccion, id } = await params
  const esquema = esquemaDe(coleccion)
  if (!esquema) notFound()
  const documento = await obtenerDocumento(coleccion, id)
  if (!documento) notFound()

  const titulo = texto(documento.datos.titulo) || texto(documento.datos.nombre) || id
  const campoImagen = esquema.campos.find((campo) => campo.tipo === 'imagen')
  const imagen = campoImagen ? imagenSegura(obtenerAnidado(documento.datos, campoImagen.clave)) : undefined
  const alt = texto(documento.datos.portadaAlt) || texto(documento.datos.imagenAlt) || texto(documento.datos.fotoAlt) || titulo
  const cuerpo = await markdownAHtml(documento.cuerpo)

  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Vista previa editorial</h1>
          <p>Representación privada del contenido guardado, incluso cuando está en borrador. Comprueba además la ficha pública cuando el registro esté publicado.</p>
        </div>
        <Link href={`/admin/${coleccion}/${id}`} className={estilos.enlaceVolver}>← Volver a editar</Link>
      </div>
      <article className={estilos.vistaPrevia}>
        <span className={estilos.estadoVistaPrevia}>{String(documento.datos.estadoEditorial ?? 'Publicado')}</span>
        <h2>{titulo}</h2>
        {imagen && <Image src={imagen} alt={alt} width={1200} height={700} />}
        <dl>
          {esquema.columnas.map((columna) => (
            <div key={columna.clave}><dt>{columna.etiqueta}</dt><dd>{valorColumna(documento, columna.clave)}</dd></div>
          ))}
        </dl>
        {cuerpo && <div className="prosa" dangerouslySetInnerHTML={{ __html: cuerpo }} />}
      </article>
    </>
  )
}
