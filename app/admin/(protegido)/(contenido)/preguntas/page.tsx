import type { Metadata } from 'next'
import { archivarPregunta, eliminarPregunta, responderPregunta } from '@/lib/admin/preguntas-acciones'
import { requerirEditor } from '@/lib/admin/datos'
import { listarPreguntasAdmin } from '@/lib/preguntas'
import estilos from '../../../admin.module.css'

export const metadata: Metadata = { title: 'Preguntas de la comunidad' }
export const dynamic = 'force-dynamic'

export default async function PaginaPreguntasAdmin() {
  const sesion = await requerirEditor()
  const preguntas = await listarPreguntasAdmin()
  return <><div className={estilos.cabeceraPagina}><div><h1>Preguntas de la comunidad</h1><p>Responde y publica únicamente consultas generales. El nombre y el correo permanecen privados.</p></div></div>{preguntas.length === 0 ? <p className={estilos.estadoVacioAdmin}>Todavía no se han recibido preguntas.</p> : <div className={estilos.listaSolicitudes}>{preguntas.map((item) => <article key={item.id} className={estilos.solicitud}><div className={estilos.solicitudCabecera}><div><div className={estilos.metadatosPregunta}><span className={estilos.origenSolicitud}>{item.categoria}</span><strong className={estilos.estadoPregunta} data-estado={item.estado}>{item.estado === 'respondida' ? 'Publicada' : item.estado === 'archivada' ? 'Archivada' : 'Pendiente'}</strong></div><h2>{item.pregunta}</h2><p>{item.nombre} · <a href={'mailto:' + item.correo}>{item.correo}</a></p></div><time dateTime={item.creadoEn}>{new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(item.creadoEn))}</time></div><form action={responderPregunta} className={estilos.respuestaPregunta}><input type="hidden" name="id" value={item.id} /><label>Respuesta pública<textarea name="respuesta" defaultValue={item.respuesta} minLength={10} maxLength={3000} required /></label><label className={estilos.casillaAdmin}><input type="checkbox" name="publicar" defaultChecked={item.estado === 'respondida'} />Publicar la respuesta en el sitio</label><button type="submit">{item.estado === 'respondida' ? 'Actualizar respuesta publicada' : 'Guardar respuesta'}</button></form><div className={estilos.accionesSolicitud}>{item.estado !== 'archivada' && <form action={archivarPregunta}><input type="hidden" name="id" value={item.id} /><button type="submit">Archivar pregunta</button></form>}{sesion.autorizado.rol === 'admin' && <form action={eliminarPregunta}><input type="hidden" name="id" value={item.id} /><button type="submit" className={estilos.botonPeligro}>Eliminar datos</button></form>}</div></article>)}</div>}</>
}
