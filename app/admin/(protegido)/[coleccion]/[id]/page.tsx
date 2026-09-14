import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { esquemaDe } from '@/lib/admin/esquemas'
import { obtenerDocumento, obtenerAnidado } from '@/lib/admin/datos'
import FormularioContenido from '@/componentes/admin/FormularioContenido'
import estilos from '../../../admin.module.css'

type Props = { params: Promise<{ coleccion: string; id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { coleccion, id } = await params
  const esquema = esquemaDe(coleccion)
  return { title: esquema ? `Editar · ${id}` : 'Editar elemento' }
}

export const dynamic = 'force-dynamic'

export default async function PaginaEditarElemento({ params }: Props) {
  const { coleccion, id } = await params
  const esquema = esquemaDe(coleccion)
  if (!esquema) notFound()
  const documento = await obtenerDocumento(coleccion, id)
  if (!documento) notFound()

  const valoresIniciales: Record<string, unknown> = {}
  for (const campo of esquema.campos) {
    if (campo.clave === 'cuerpo') continue
    valoresIniciales[campo.clave] = obtenerAnidado(documento.datos, campo.clave)
  }

  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Editar {esquema.etiquetaSingular}</h1>
          <p>Los campos marcados con * son obligatorios.</p>
        </div>
        <Link href={`/admin/${coleccion}`} className={estilos.enlaceVolver}>← Volver a {esquema.etiqueta.toLowerCase()}</Link>
      </div>
      <FormularioContenido
        esquema={esquema}
        slugExistente={documento.slug}
        valoresIniciales={valoresIniciales}
        cuerpoInicial={documento.cuerpo}
      />
    </>
  )
}
