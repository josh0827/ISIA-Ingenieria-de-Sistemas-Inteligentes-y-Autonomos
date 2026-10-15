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
    <div className={estilos.fila}><div className={estilos.campo}><label htmlFor="titulo">Título de la oportunidad *</label><input type="text" id="titulo" name="titulo" required defaultValue={oferta?.titulo ?? ''} /></div><div className={estilos.campo}><label htmlFor="tipo">Tipo *</label><select id="tipo" name="tipo" defaultValue={oferta?.tipo ?? 'práctica'}><option value="práctica">Práctica</option><option value="empleo">Empleo</option><option value="convocatoria">Convocatoria</option><option value="reto">Reto</option></select></div></div>
    {esEmpresa ? <div className={estilos.campo}><span className={estilos.etiquetaFija}>Empresa</span><p className={estilos.archivoActual}>{nombreEmpresa}</p><p className={estilos.ayuda}>Este nombre se toma de tu perfil autorizado.</p></div> : <div className={estilos.campo}><label htmlFor="empresaNombre">Empresa u organización *</label><input type="text" id="empresaNombre" name="empresaNombre" required defaultValue={oferta?.empresaNombre ?? ''} /></div>}
    <div className={estilos.fila}><div className={estilos.campo}><label htmlFor="ubicacion">Ubicación *</label><input type="text" id="ubicacion" name="ubicacion" required defaultValue={oferta?.ubicacion ?? 'Manizales, Caldas'} /></div><div className={estilos.campo}><label htmlFor="modalidad">Modalidad *</label><select id="modalidad" name="modalidad" defaultValue={oferta?.modalidad ?? 'Presencial'}><option>Presencial</option><option>Híbrida</option><option>Remota</option></select></div></div>
    <div className={estilos.campo}><label htmlFor="descripcion">Descripción *</label><textarea id="descripcion" name="descripcion" rows={7} required defaultValue={oferta?.descripcion ?? ''} /><p className={estilos.ayuda}>Describe la iniciativa, sus actividades y el contexto de aprendizaje con información verificable.</p></div>
    <div className={estilos.campo}><label htmlFor="requisitos">Temas o conocimientos relacionados</label><textarea id="requisitos" name="requisitos" rows={5} defaultValue={oferta?.requisitos.join('\n') ?? ''} /><p className={estilos.ayuda}>Una referencia por línea. Evita requisitos excluyentes que no estén confirmados.</p></div>
    <div className={estilos.fila}><div className={estilos.campo}><label htmlFor="contactoEmail">Correo de contacto *</label><input type="email" id="contactoEmail" name="contactoEmail" required defaultValue={oferta?.contactoEmail ?? ''} /></div><div className={estilos.campo}><label htmlFor="urlPostulacion">URL de postulación</label><input type="url" id="urlPostulacion" name="urlPostulacion" placeholder="https://..." defaultValue={oferta?.urlPostulacion ?? ''} /></div></div>
    <div className={estilos.fila}>
      <div className={estilos.campo}>
        <label htmlFor="estado">Estado *</label>
        <select id="estado" name="estado" defaultValue={oferta?.estado ?? 'borrador'} required>
          <option value="borrador">Borrador</option>
          <option value="abierta">Abierta</option>
          <option value="cerrada">Cerrada</option>
          <option value="archivada">Archivada</option>
        </select>
        <p className={estilos.ayuda}>Las cerradas y archivadas permanecen en el histórico público.</p>
      </div>
      <div className={estilos.campo}>
        <label htmlFor="fechaCierre">Fecha de cierre</label>
        <input type="date" id="fechaCierre" name="fechaCierre" defaultValue={oferta?.fechaCierre ?? ''} />
      </div>
    </div>
    <label className={estilos.casilla}><input type="checkbox" name="contactoPublico" defaultChecked={oferta?.contactoPublico ?? false} /><span>Mostrar el correo de la organización cuando la oportunidad pase al histórico</span></label>
    {estado.error && <p role="alert" className={estilos.error}>{estado.error}</p>}
    <div className={estilos.acciones}><button type="submit" disabled={enviando} className={estilos.enviar}>{enviando ? 'Guardando…' : oferta ? 'Guardar cambios' : 'Publicar oferta'}</button></div>
  </form>
}
