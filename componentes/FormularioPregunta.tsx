'use client'

import { useActionState } from 'react'
import { enviarPregunta } from '@/lib/preguntas-acciones'
import { CATEGORIAS_PREGUNTA, ESTADO_PREGUNTA_INICIAL } from '@/lib/preguntas-esquemas'
import estilos from './FormularioNetworking.module.css'

export default function FormularioPregunta() {
  const [estado, accion, enviando] = useActionState(enviarPregunta, ESTADO_PREGUNTA_INICIAL)
  return <form action={accion} className={estilos.formulario}><div className={estilos.trampa} aria-hidden="true"><label htmlFor="pregunta-sitio">Sitio web</label><input id="pregunta-sitio" name="sitioWeb" type="text" tabIndex={-1} autoComplete="off" /></div><div className={estilos.fila}><label>Nombre<input name="nombre" required maxLength={100} autoComplete="name" /></label><label>Correo <span>No se publica.</span><input name="correo" type="email" required maxLength={160} autoComplete="email" /></label></div><label>Categoría<select name="categoria" required defaultValue=""><option value="" disabled>Selecciona una categoría</option>{CATEGORIAS_PREGUNTA.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}</select></label><label>Pregunta<textarea name="pregunta" required minLength={15} maxLength={1200} /></label><label className={`${estilos.consentimiento} ${estilos.privacidad}`}><input name="consentimiento" type="checkbox" required /><span><strong>Tratamiento de datos.</strong> Autorizo el uso de estos datos para responder y moderar la pregunta. Si se publica, solo aparecerán la pregunta, su categoría y la respuesta.</span></label>{estado.error && <p className={estilos.error} role="alert">{estado.error}</p>}{estado.mensaje && <p className={estilos.exito} role="status">{estado.mensaje}</p>}<button type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar pregunta'}</button></form>
}
