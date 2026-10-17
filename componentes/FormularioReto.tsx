'use client'

import { useActionState } from 'react'
import { enviarRetoPrototipado } from '@/lib/networking-acciones'
import { AREAS_PROTOTIPADO, ESTADO_NETWORKING_INICIAL } from '@/lib/networking-esquemas'
import estilos from './FormularioNetworking.module.css'

export default function FormularioReto({ servicioSlug = '' }: { servicioSlug?: string }) {
  const [estado, accion, enviando] = useActionState(enviarRetoPrototipado, ESTADO_NETWORKING_INICIAL)
  return <form action={accion} className={estilos.formulario}>
    <input type="hidden" name="servicioSlug" value={servicioSlug} />
    <div className={estilos.fila}>
      <label>Nombre *<input name="nombre" autoComplete="name" maxLength={100} required /></label>
      <label>Correo *<input name="correo" type="email" autoComplete="email" maxLength={160} required /></label>
    </div>
    <div className={estilos.fila}>
      <label>Perfil *<select name="tipoParticipante" required defaultValue=""><option value="" disabled>Selecciona</option><option value="pregrado">Estudiante de pregrado</option><option value="posgrado">Estudiante de posgrado</option><option value="egresado">Egresado/a</option><option value="docente_investigador">Docente o investigador/a</option><option value="empresa_institucion">Empresa o institución</option><option value="externo">Persona externa</option></select></label>
      <label>Organización<input name="organizacion" maxLength={180} /></label>
    </div>
    <label>Título del reto *<input name="tituloReto" maxLength={180} required /></label>
    <label>Contexto y problema *<textarea name="descripcionReto" minLength={30} maxLength={3000} required /></label>
    <label>Resultado esperado *<textarea name="resultadoEsperado" minLength={10} maxLength={1200} required /></label>
    <fieldset><legend>Áreas relacionadas *</legend><div className={estilos.opciones}>{AREAS_PROTOTIPADO.map((area) => <label key={area} className={estilos.casilla}><input type="checkbox" name="areas" value={area} /><span>{area}</span></label>)}</div></fieldset>
    <label className={estilos.consentimiento}><input type="checkbox" name="requiereConfidencialidad" /><span>El reto puede requerir una conversación de confidencialidad antes de compartir detalles adicionales.</span></label>
    <label className={`${estilos.consentimiento} ${estilos.privacidad}`}><input type="checkbox" name="consentimiento" required /><span><strong>Tratamiento de datos.</strong> Autorizo el uso de estos datos para evaluar y responder el reto. Entiendo que el envío no garantiza ejecución ni crea una relación contractual. *</span></label>
    <div className={estilos.trampa} aria-hidden><label>Sitio web<input name="sitioWeb" tabIndex={-1} autoComplete="off" /></label></div>
    {estado.error && <p className={estilos.error} role="alert">{estado.error}</p>}
    {estado.ok && <p className={estilos.exito} role="status">{estado.mensaje}</p>}
    <button type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Proponer reto'}</button>
  </form>
}
