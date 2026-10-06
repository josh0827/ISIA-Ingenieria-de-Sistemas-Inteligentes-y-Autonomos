import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FormularioGrupo from '@/componentes/admin/FormularioGrupo'
import { obtenerGrupoTrabajo } from '@/lib/grupos'
import estilos from '../../../../admin.module.css'

type Props = { params: Promise<{ slug: string }> }
export const metadata: Metadata = { title: 'Editar grupo de trabajo' }
export const dynamic = 'force-dynamic'

export default async function EditarGrupo({ params }: Props) {
  const grupo = await obtenerGrupoTrabajo((await params).slug)
  if (!grupo) notFound()
  return <>
    <div className={estilos.cabeceraPagina}>
      <div><h1>Editar grupo de trabajo</h1><p>Actualiza la información pública y sus recursos.</p></div>
      <Link href="/admin/grupos" className={estilos.enlaceVolver}>← Volver a grupos</Link>
    </div>
    <FormularioGrupo grupo={grupo} />
  </>
}
