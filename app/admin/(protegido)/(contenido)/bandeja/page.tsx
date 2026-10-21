import type { Metadata } from 'next'
import { actualizarEstadoBandeja, eliminarEntradaBandeja } from '@/lib/admin/bandeja-acciones'
import { listarBandeja } from '@/lib/admin/bandeja'
import { ESTADOS_SOLICITUD } from '@/lib/admin/solicitudes'
import { requerirEditor } from '@/lib/admin/datos'
import estilos from '../../../admin.module.css'

export const metadata: Metadata = { title: 'Bandeja de entrada' }
export const dynamic = 'force-dynamic'
const ETIQUETAS = { nueva: 'Nueva', en_revision: 'En revisión', contactada: 'Contactada', cerrada: 'Cerrada' } as const
const ORIGEN = { participacion: 'Participación', colaboracion: 'Colaboración', prototipado: 'Reto de prototipado' } as const


const RESULTADOS: Record<string, { texto: string; error?: boolean }> = {
  'estado-guardado': { texto: 'Estado actualizado.' },
  eliminada: { texto: 'Solicitud eliminada.' },
  'datos-invalidos': { texto: 'Los datos enviados no son válidos.', error: true },
  'error-estado': { texto: 'No se pudo actualizar el estado. Intenta de nuevo.', error: true },
  'error-eliminar': { texto: 'No se pudo eliminar la solicitud. Intenta de nuevo.', error: true },
}

export default async function PaginaBandeja({ searchParams }: { searchParams: Promise<{ resultado?: string }> }) {
  const resultado = RESULTADOS[(await searchParams).resultado ?? '']
  const [{ entradas, errores }, sesion] = await Promise.all([listarBandeja(), requerirEditor()])
  return <><div className={estilos.cabeceraPagina}><div><h1>Bandeja de entrada</h1><p>Solicitudes privadas de participación, colaboración y prototipado. Usa estos datos únicamente para responder a la persona remitente.</p></div></div>{resultado && <p className={estilos.estadoVacioAdmin} role={resultado.error ? 'alert' : 'status'}>{resultado.texto}</p>}{errores.length > 0 && <p className={estilos.estadoVacioAdmin} role="alert">No se pudo leer: {errores.join(', ')}. La lista puede estar incompleta; recarga la página o revisa el estado de Supabase.</p>}{entradas.length === 0 && errores.length === 0 ? <p className={estilos.estadoVacioAdmin}>Todavía no se han recibido solicitudes.</p> : entradas.length > 0 && <div className={estilos.listaSolicitudes}>{entradas.map((entrada) => <article key={entrada.origen + entrada.id} className={estilos.solicitud}><div className={estilos.solicitudCabecera}><div><span className={estilos.origenSolicitud}>{ORIGEN[entrada.origen]}</span><h2>{entrada.asunto}</h2><p>{entrada.nombre} · <a href={'mailto:' + entrada.correo}>{entrada.correo}</a></p></div><time dateTime={entrada.creadoEn}>{new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(entrada.creadoEn))}</time></div>{entrada.contexto && <p><strong>Contexto:</strong> {entrada.contexto}</p>}<p className={estilos.mensajeSolicitud}>{entrada.detalle}</p><div className={estilos.accionesSolicitud}><form action={actualizarEstadoBandeja}><input type="hidden" name="id" value={entrada.id} /><input type="hidden" name="origen" value={entrada.origen} /><label><span className="solo-lectores">Estado</span><select name="estado" defaultValue={entrada.estado}>{ESTADOS_SOLICITUD.map((estado) => <option key={estado} value={estado}>{ETIQUETAS[estado]}</option>)}</select></label><button type="submit">Guardar estado</button></form>{sesion.autorizado.rol === 'admin' && <form action={eliminarEntradaBandeja}><input type="hidden" name="id" value={entrada.id} /><input type="hidden" name="origen" value={entrada.origen} /><button type="submit" className={estilos.botonPeligro}>Eliminar datos</button></form>}</div></article>)}</div>}</>
}
