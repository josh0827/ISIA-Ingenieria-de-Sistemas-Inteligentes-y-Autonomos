import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FormularioPractica from '@/componentes/admin/FormularioPractica'
import { requerirGestionPracticas } from '@/lib/admin/datos'
import { obtenerPracticaAdmin } from '@/lib/practicas'
import estilos from '../../../admin.module.css'

export const metadata: Metadata = { title: 'Editar oferta de práctica' }

export default async function EditarPractica({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sesion = await requerirGestionPracticas()
  const oferta = await obtenerPracticaAdmin(id, sesion.id, sesion.autorizado.rol)
  if (!oferta) notFound()
  return <><div className={estilos.cabeceraPagina}><div><h1>Editar oferta</h1><p>Los cambios se reflejan en la página pública si la oferta permanece activa.</p></div><Link href="/admin/practicas" className={estilos.enlaceVolver}>← Volver a prácticas</Link></div><FormularioPractica oferta={oferta} usuario={sesion.autorizado} /></>
}
