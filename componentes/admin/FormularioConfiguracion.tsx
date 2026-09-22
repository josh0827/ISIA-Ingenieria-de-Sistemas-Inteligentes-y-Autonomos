'use client'

import { useActionState } from 'react'
import {
  guardarConfiguracionNavegacion,
  type EstadoConfiguracion,
} from '@/lib/admin/configuracion-acciones'
import {
  CLAVES_SECCION,
  NAVEGACION,
  type ConfiguracionNavegacion,
} from '@/lib/sitio'
import estilos from './FormularioContenido.module.css'

const ESTADO_INICIAL: EstadoConfiguracion = { ok: false }

export default function FormularioConfiguracion({
  configuracion,
}: {
  configuracion: ConfiguracionNavegacion
}) {
  const [estado, accion, enviando] = useActionState(
    guardarConfiguracionNavegacion,
    ESTADO_INICIAL,
  )

  return (
    <form action={accion} className={estilos.formulario}>
      <fieldset className={estilos.grupoCasillas}>
        <legend>Secciones visibles en la navegación</legend>
        <p className={estilos.ayuda}>
          Oculta las secciones que aún no tengan contenido listo para el público.
        </p>
        {CLAVES_SECCION.map((clave) => {
          const item = NAVEGACION.find((navegacion) => navegacion.href === `/${clave}`)
          return (
            <label className={estilos.casilla} key={clave}>
              <input name={clave} type="checkbox" defaultChecked={configuracion[clave]} />
              <span>{item?.texto ?? clave}</span>
            </label>
          )
        })}
      </fieldset>
      {estado.error && <p role="alert" className={estilos.error}>{estado.error}</p>}
      {estado.mensaje && <p role="status" className={estilos.exito}>{estado.mensaje}</p>}
      <div className={estilos.acciones}>
        <button type="submit" disabled={enviando} className={estilos.enviar}>
          {enviando ? 'Guardando…' : 'Guardar navegación'}
        </button>
      </div>
    </form>
  )
}
