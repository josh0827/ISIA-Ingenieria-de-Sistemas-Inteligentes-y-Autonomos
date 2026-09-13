import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { esquemaDe } from '@/lib/admin/esquemas'
import FormularioContenido from '@/componentes/admin/FormularioContenido'
import estilos from '../../../admin.module.css'

type Props = { params: Promise<{ coleccion: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const esquema = esquemaDe((await params).coleccion)
  return { title: esquema ? `Nuevo · ${esquema.etiqueta}` : 'Nuevo elemento' }
}

export const dynamic = 'force-dynamic'

export default async function PaginaNuevoElemento({ params }: Props) {
  const { coleccion } = await params
  const esquema = esquemaDe(coleccion)
  if (!esquema) notFound()

  return (
    <>
      <div className={estilos.cabeceraPagina}>
        <div>
          <h1>Añadir {esquema.etiquetaSingular}</h1>
          <p>Los campos marcados con * son obligatorios.</p>
        </div>
        <Link href={`/admin/${coleccion}`} className={estilos.enlaceVolver}>← Volver a {esquema.etiqueta.toLowerCase()}</Link>
      </div>
      <FormularioContenido esquema={esquema} slugExistente={null} valoresIniciales={{}} cuerpoInicial="" />
    </>
  )
}
