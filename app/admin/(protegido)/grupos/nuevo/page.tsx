import type { Metadata } from 'next'
import Link from 'next/link'
import FormularioGrupo from '@/componentes/admin/FormularioGrupo'
import estilos from '../../../admin.module.css'

export const metadata: Metadata = { title: 'Nuevo grupo de trabajo' }

export default function NuevoGrupo() {
  return <>
    <div className={estilos.cabeceraPagina}>
      <div><h1>Añadir grupo de trabajo</h1><p>Los campos marcados con * son obligatorios.</p></div>
      <Link href="/admin/grupos" className={estilos.enlaceVolver}>← Volver a grupos</Link>
    </div>
    <FormularioGrupo />
  </>
}
