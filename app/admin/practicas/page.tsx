import type { Metadata } from 'next'
import Link from 'next/link'
import EstadoPracticaBoton from '@/componentes/admin/EstadoPracticaBoton'
import { requerirGestionPracticas } from '@/lib/admin/datos'
import { listarPracticasAdmin } from '@/lib/practicas'
import estilos from '../admin.module.css'
import tabla from '@/componentes/admin/TablaAdmin.module.css'

export const metadata: Metadata = { title: 'Prácticas e iniciativas' }
export const dynamic = 'force-dynamic'

export default async function AdminPracticas() {
  const sesion = await requerirGestionPracticas()
  const ofertas = await listarPracticasAdmin(sesion.id, sesion.autorizado.rol)
  const esEmpresa = sesion.autorizado.rol === 'empresa'
  return <>
    <div className={estilos.cabeceraPagina}><div><h1>{esEmpresa ? 'Mis ofertas de prácticas' : 'Prácticas e iniciativas'}</h1><p>{esEmpresa ? 'Crea, actualiza o desactiva las ofertas asociadas a tu organización.' : 'Revisa y administra las ofertas publicadas por organizaciones autorizadas.'}</p></div><Link href="/admin/practicas/nuevo" className={estilos.botonNuevo}>Publicar oferta</Link></div>
    {ofertas.length ? <div className={tabla.envoltorio}><table className={tabla.tabla}><thead><tr><th>Oferta</th><th>Empresa</th><th>Modalidad</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{ofertas.map((oferta) => <tr key={oferta.id}><td>{oferta.titulo}</td><td>{oferta.empresaNombre}</td><td>{oferta.modalidad}</td><td>{oferta.activa ? 'Publicada' : 'Desactivada'}</td><td><div className={tabla.celdaAcciones}><Link href={`/admin/practicas/${oferta.id}`} className={tabla.enlaceEditar}>Editar</Link><EstadoPracticaBoton id={oferta.id} activa={oferta.activa} /></div></td></tr>)}</tbody></table></div> : <div className={tabla.vacio}><p>Aún no hay ofertas registradas para este perfil.</p></div>}
  </>
}
