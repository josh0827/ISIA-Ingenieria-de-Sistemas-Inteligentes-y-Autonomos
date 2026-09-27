'use client'

import { useActionState } from 'react'
import { guardarPractica, type EstadoPractica } from '@/lib/admin/practicas-acciones'
import type { PracticaOferta } from '@/lib/practicas'
import type { UsuarioAutorizado } from '@/lib/usuarios-autorizados'
import estilos from './FormularioContenido.module.css'

const ESTADO_INICIAL: EstadoPractica = { ok: false }

export default function FormularioPractica({ oferta, usuario }: { oferta?: PracticaOferta; usuario: UsuarioAutorizado }) {
  const accionOferta = guardarPractica.bind(null, oferta?.id ?? null)
  const [estado, accion, enviando] = useActionState(accionOferta, ESTADO_INICIAL)
  const esEmpresa = usuario.rol === 'empresa'
  const nombreEmpresa = usuario.nombreEmpresaOUsuario ?? usuario.email
  return <form action={accion} className={estilos.formulario}>
    <div className={estilos.campo}><label htmlFor="titulo">Título de la oferta *</label><input type="text" id="titulo" name="titulo" required defaultValue={oferta?.titulo ?? ''} /></div>
    {esEmpresa ? <div className={estilos.campo}><span className={estilos.etiquetaFija}>Empresa</span><p className={estilos.archivoActual}>{nombreEmpresa}</p><p className={estilos.ayuda}>Este nombre se toma de tu perfil autorizado.</p></div> : <div className={estilos.campo}><label htmlFor="empresaNombre">Empresa u organización *</label><input type="text" id="empresaNombre" name="empresaNombre" required defaultValue={oferta?.empresaNombre ?? ''} /></div>}
    <div className={estilos.fila}><div className={estilos.campo}><label htmlFor="ubicacion">Ubicación *</label><input type="text" id="ubicacion" name="ubicacion" required defaultValue={oferta?.ubicacion ?? 'Manizales, Caldas'} /></div><div className={estilos.campo}><label htmlFor="modalidad">Modalidad *</label><select id="modalidad" name="modalidad" defaultValue={oferta?.modalidad ?? 'Presencial'}><option>Presencial</option><option>Híbrida</option><option>Remota</option></select></div></div>
    <div className={estilos.campo}><label htmlFor="descripcion">Descripción *</label><textarea id="descripcion" name="descripcion" rows={7} required defaultValue={oferta?.descripcion ?? ''} /><p className={estilos.ayuda}>Describe la iniciativa, sus actividades y el contexto de aprendizaje con información verificable.</p></div>
    <div className={estilos.campo}><label htmlFor="requisitos">Temas o conocimientos relacionados</label><textarea id="requisitos" name="requisitos" rows={5} defaultValue={oferta?.requisitos.join('\n') ?? ''} /><p className={estilos.ayuda}>Una referencia por línea. Evita requisitos excluyentes que no estén confirmados.</p></div>
    <div className={estilos.fila}><div className={estilos.campo}><label htmlFor="contactoEmail">Correo de contacto *</label><input type="email" id="contactoEmail" name="contactoEmail" required defaultValue={oferta?.contactoEmail ?? ''} /></div><div className={estilos.campo}><label htmlFor="urlPostulacion">URL de postulación</label><input type="url" id="urlPostulacion" name="urlPostulacion" placeholder="https://..." defaultValue={oferta?.urlPostulacion ?? ''} /></div></div>
    <label className={estilos.casilla}><input type="checkbox" name="activa" defaultChecked={oferta?.activa ?? true} /><span>Publicar esta oferta en la sección pública</span></label>
    {estado.error && <p role="alert" className={estilos.error}>{estado.error}</p>}
    <div className={estilos.acciones}><button type="submit" disabled={enviando} className={estilos.enviar}>{enviando ? 'Guardando…' : oferta ? 'Guardar cambios' : 'Publicar oferta'}</button></div>
  </form>
}
