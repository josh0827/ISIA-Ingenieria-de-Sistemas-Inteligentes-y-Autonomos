import type { Metadata } from 'next'
import Link from 'next/link'
import FormularioPractica from '@/componentes/admin/FormularioPractica'
import { requerirGestionPracticas } from '@/lib/admin/datos'
import estilos from '../../admin.module.css'

export const metadata: Metadata = { title: 'Publicar oferta de práctica' }

export default async function NuevaPractica() {
  const sesion = await requerirGestionPracticas()
  return <><div className={estilos.cabeceraPagina}><div><h1>Publicar oferta de práctica</h1><p>Incluye únicamente información confirmada por la organización responsable.</p></div><Link href="/admin/practicas" className={estilos.enlaceVolver}>← Volver a prácticas</Link></div><FormularioPractica usuario={sesion.autorizado} /></>
}
