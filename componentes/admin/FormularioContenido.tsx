'use client'

import { useActionState } from 'react'
import { guardarDocumento, type EstadoFormulario } from '@/lib/admin/acciones'
import type { EsquemaColeccion } from '@/lib/admin/esquemas'
import estilos from './FormularioContenido.module.css'

type Props = {
  esquema: EsquemaColeccion
  /** null cuando se está creando un elemento nuevo. */
  slugExistente: string | null
  /** Valores iniciales planos, ya extraídos con dot-path (ver lib/admin/datos.ts). */
  valoresIniciales: Record<string, unknown>
  cuerpoInicial: string
}

const ESTADO_INICIAL: EstadoFormulario = { ok: false }

function valorTexto(valor: unknown): string {
  if (Array.isArray(valor)) return valor.join(', ')
  if (valor === undefined || valor === null) return ''
  return String(valor)
}

export default function FormularioContenido({ esquema, slugExistente, valoresIniciales, cuerpoInicial }: Props) {
  const guardarConColeccion = guardarDocumento.bind(null, esquema.coleccion, slugExistente)
  const [estado, accion, enviando] = useActionState<EstadoFormulario, FormData>(guardarConColeccion, ESTADO_INICIAL)

  return (
    <form action={accion} className={estilos.formulario}>
      {!slugExistente && (
        <div className={estilos.campo}>
          <label htmlFor="slug">Identificador (slug)</label>
          <input id="slug" name="slug" type="text" placeholder="mi-elemento" required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
          <p className={estilos.ayuda}>Solo minúsculas, números y guiones. No se podrá cambiar después de crear el elemento.</p>
        </div>
      )}
      {slugExistente && (
        <div className={estilos.campo}>
          <span className={estilos.etiquetaFija}>Identificador (slug)</span>
          <p className={estilos.valorFijo}>{slugExistente}</p>
        </div>
      )}
      {esquema.campos.map((campo) => {
        const valorInicial = campo.clave === 'cuerpo' ? cuerpoInicial : valoresIniciales[campo.clave]
        const idCampo = `campo-${campo.clave}`
        return (
          <div className={estilos.campo} key={campo.clave}>
            <label htmlFor={idCampo}>
              {campo.etiqueta}
              {campo.requerido && <span aria-hidden className={estilos.requerido}> *</span>}
            </label>
            {campo.tipo === 'booleano' ? (
              <label className={estilos.casilla}>
                <input id={idCampo} name={campo.clave} type="checkbox" defaultChecked={Boolean(valorInicial)} />
                <span>Sí</span>
              </label>
            ) : campo.tipo === 'select' ? (
              <select id={idCampo} name={campo.clave} defaultValue={valorTexto(valorInicial)} required={campo.requerido}>
                <option value="" disabled>Selecciona una opción</option>
                {campo.opciones?.map((opcion) => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            ) : campo.tipo === 'textarea' ? (
              <textarea id={idCampo} name={campo.clave} rows={3} defaultValue={valorTexto(valorInicial)} required={campo.requerido} />
            ) : campo.tipo === 'markdown' ? (
              <textarea id={idCampo} name={campo.clave} rows={12} className={estilos.markdown} defaultValue={valorTexto(valorInicial)} required={campo.requerido} />
            ) : campo.tipo === 'fecha' ? (
              <input id={idCampo} name={campo.clave} type="date" defaultValue={valorTexto(valorInicial)} required={campo.requerido} />
            ) : campo.tipo === 'hora' ? (
              <input id={idCampo} name={campo.clave} type="time" defaultValue={valorTexto(valorInicial)} required={campo.requerido} />
            ) : campo.tipo === 'numero' ? (
              <input id={idCampo} name={campo.clave} type="number" defaultValue={valorTexto(valorInicial)} required={campo.requerido} />
            ) : (
              <input id={idCampo} name={campo.clave} type="text" defaultValue={valorTexto(valorInicial)} required={campo.requerido} />
            )}
            {campo.ayuda && <p className={estilos.ayuda}>{campo.ayuda}</p>}
          </div>
        )
      })}
      {estado.error && <p role="alert" className={estilos.error}>{estado.error}</p>}
      <div className={estilos.acciones}>
        <button type="submit" disabled={enviando} className={estilos.enviar}>
          {enviando ? 'Guardando…' : slugExistente ? 'Guardar cambios' : 'Crear elemento'}
        </button>
      </div>
    </form>
  )
}
