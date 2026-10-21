import type { Metadata } from 'next'
import { requerirAdministrador } from '@/lib/admin/datos'
import { listarEventosGithub } from '@/lib/admin/integraciones'
import estilos from '../../../admin.module.css'

export const metadata: Metadata = { title: 'Integraciones' }
export const dynamic = 'force-dynamic'

export default async function PaginaIntegraciones() {
  await requerirAdministrador()
  const configurada = Boolean(process.env.GITHUB_WEBHOOK_SECRET?.trim() && process.env.GITHUB_ALLOWED_OWNER?.trim())
  const eventos = await listarEventosGithub()
  return <><div className={estilos.cabeceraPagina}><div><h1>Integraciones</h1><p>Estado del ingreso de repositorios desde GitHub. Los eventos válidos crean proyectos en borrador y nunca publican contenido automáticamente.</p></div></div><div className={estilos.tarjetas}><article className={estilos.tarjeta}><h2>Webhook de GitHub</h2><p>{configurada ? 'Configurado en este entorno.' : 'Pendiente de GITHUB_WEBHOOK_SECRET y GITHUB_ALLOWED_OWNER.'}</p></article><article className={estilos.tarjeta}><h2>Propietario autorizado</h2><p>{process.env.GITHUB_ALLOWED_OWNER?.trim() || 'Pendiente de configurar'}</p></article></div>{eventos.length === 0 ? <p className={estilos.estadoVacioAdmin}>No hay entregas registradas.</p> : <div className={estilos.tablaSimple}><table><thead><tr><th>Fecha</th><th>Propietario</th><th>Origen</th><th>Repositorio</th><th>Estado</th></tr></thead><tbody>{eventos.map((evento) => <tr key={evento.entregaId}><td>{new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(evento.creadoEn))}</td><td>{evento.propietario}</td><td>{evento.repositorioOrigen}</td><td>{evento.repositorioCreado}</td><td>{evento.estado}</td></tr>)}</tbody></table></div>}</>
}
