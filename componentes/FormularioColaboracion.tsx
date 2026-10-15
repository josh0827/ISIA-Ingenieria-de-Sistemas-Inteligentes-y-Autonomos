'use client'

import { useActionState } from 'react'
import { enviarColaboracion, ESTADO_NETWORKING_INICIAL } from '@/lib/networking-acciones'
import estilos from './FormularioNetworking.module.css'

const PARTICIPANTES = [
  ['pregrado', 'Estudiante de pregrado'],
  ['posgrado', 'Estudiante de posgrado'],
  ['egresado', 'Egresado/a'],
  ['docente_investigador', 'Docente o investigador/a'],
  ['empresa_institucion', 'Empresa o institución'],
  ['externo', 'Persona externa'],
] as const
const COLABORACIONES = [
  ['integrar_equipo', 'Integrarme al equipo'],
  ['mentoria', 'Ofrecer mentoría'],
  ['conocimiento_tecnico', 'Aportar conocimiento técnico'],
  ['equipos_infraestructura', 'Facilitar equipos o infraestructura'],
  ['alianza', 'Proponer una alianza'],
  ['apoyo_material_financiero', 'Ofrecer apoyo material o financiero'],
  ['informacion', 'Solicitar más información'],
] as const

export default function FormularioColaboracion({ tipo, slug }: { tipo: 'proyecto' | 'idea'; slug: string }) {
  const [estado, accion, enviando] = useActionState(enviarColaboracion, ESTADO_NETWORKING_INICIAL)
  return <form action={accion} className={estilos.formulario}>
    <input type="hidden" name="destinoTipo" value={tipo} />
    <input type="hidden" name="destinoSlug" value={slug} />
    <div className={estilos.fila}>
      <label>Nombre *<input name="nombre" autoComplete="name" maxLength={100} required /></label>
      <label>Correo *<input name="correo" type="email" autoComplete="email" maxLength={160} required /></label>
    </div>
    <div className={estilos.fila}>
      <label>Perfil *<select name="tipoParticipante" required defaultValue=""><option value="" disabled>Selecciona</option>{PARTICIPANTES.map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}</select></label>
      <label>Forma de colaboración *<select name="tipoColaboracion" required defaultValue=""><option value="" disabled>Selecciona</option>{COLABORACIONES.map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}</select></label>
    </div>
    <label>Organización o programa académico<input name="organizacion" maxLength={180} /></label>
    <label>Propuesta *<textarea name="mensaje" minLength={20} maxLength={1800} required /><span>Explica qué puedes aportar o qué información necesitas.</span></label>
    <label className={estilos.consentimiento}><input type="checkbox" name="consentimiento" required /><span>Autorizo el tratamiento de estos datos únicamente para gestionar esta solicitud de contacto. *</span></label>
    <div className={estilos.trampa} aria-hidden><label>Sitio web<input name="sitioWeb" tabIndex={-1} autoComplete="off" /></label></div>
    {estado.error && <p className={estilos.error} role="alert">{estado.error}</p>}
    {estado.ok && <p className={estilos.exito} role="status">{estado.mensaje}</p>}
    <button type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar propuesta'}</button>
  </form>
}
