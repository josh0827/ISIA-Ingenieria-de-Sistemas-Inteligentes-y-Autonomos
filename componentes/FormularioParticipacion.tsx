'use client'

import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import {
  enviarSolicitudParticipacion,
  ESTADO_INICIAL_SOLICITUD,
} from '@/lib/participacion-acciones'
import {
  esquemaSolicitudParticipacion,
  TEMAS_INTERES,
} from '@/lib/participacion-esquema'
import { SITIO } from '@/lib/sitio'
import estilos from './FormularioParticipacion.module.css'

const POLITICA_DATOS = 'https://legal.unal.edu.co/rlunal/home/doc.jsp?d_i=97992'
const CORREO_DATOS_UNAL = 'protecdatos_na@unal.edu.co'

export default function FormularioParticipacion() {
  const [estado, accion, enviando] = useActionState(enviarSolicitudParticipacion, ESTADO_INICIAL_SOLICITUD)
  const [errorCliente, setErrorCliente] = useState<string>()
  const formularioRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (estado.ok) formularioRef.current?.reset()
  }, [estado.ok])

  function validar(evento: FormEvent<HTMLFormElement>) {
    const formulario = evento.currentTarget
    const datos = new FormData(formulario)
    const resultado = esquemaSolicitudParticipacion.safeParse({
      nombre: datos.get('nombre'),
      correo: datos.get('correo'),
      programa: datos.get('programa') || undefined,
      temas: datos.getAll('temas'),
      mensaje: datos.get('mensaje') || undefined,
      consentimiento: datos.get('consentimiento') === 'on',
      sitioWeb: datos.get('sitioWeb') || undefined,
    })
    if (!resultado.success) {
      evento.preventDefault()
      setErrorCliente(resultado.error.issues[0]?.message ?? 'Revisa los datos del formulario.')
      return
    }
    setErrorCliente(undefined)
  }

  return (
    <form ref={formularioRef} action={accion} onSubmit={validar} className={estilos.formulario} noValidate>
      <div className={estilos.fila}>
        <div className={estilos.campo}>
          <label htmlFor="participacion-nombre">Nombre *</label>
          <input id="participacion-nombre" name="nombre" type="text" autoComplete="name" maxLength={100} required />
        </div>
        <div className={estilos.campo}>
          <label htmlFor="participacion-correo">Correo *</label>
          <input id="participacion-correo" name="correo" type="email" autoComplete="email" maxLength={160} required />
        </div>
      </div>

      <div className={estilos.campo}>
        <label htmlFor="participacion-programa">Programa académico</label>
        <input id="participacion-programa" name="programa" type="text" maxLength={120} />
      </div>

      <fieldset className={estilos.temas}>
        <legend className={estilos.leyenda}>Temas que te interesan *</legend>
        <div className={estilos.opciones}>
          {TEMAS_INTERES.map((tema) => (
            <label className={estilos.opcion} key={tema}>
              <input type="checkbox" name="temas" value={tema} />
              <span>{tema}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={estilos.campo}>
        <label htmlFor="participacion-mensaje">¿Qué te gustaría explorar?</label>
        <textarea id="participacion-mensaje" name="mensaje" maxLength={1200} />
        <p className={estilos.ayuda}>Máximo 1200 caracteres. No incluyas contraseñas ni datos sensibles.</p>
      </div>

      {/* Aviso de privacidad exigido por la Ley 1581 de 2012: responsable,
          finalidad, política aplicable y canal para ejercer los derechos. */}
      <div className={estilos.aviso}>
        <label className={estilos.consentimiento}>
          <input type="checkbox" name="consentimiento" required />
          <span>
            Autorizo a la Universidad Nacional de Colombia, a través del semillero ISIA, a tratar estos
            datos solo para responder esta manifestación de interés, según su{' '}
            <a href={POLITICA_DATOS} target="_blank" rel="noopener noreferrer">
              Política de Tratamiento de Datos Personales
            </a>{' '}
            (Resolución 207 de 2021). *
          </span>
        </label>
        <p className={estilos.ayuda}>
          Puedes conocer, actualizar, rectificar o pedir que se borren tus datos escribiendo
          a {SITIO.correo} o a {CORREO_DATOS_UNAL}.
        </p>
      </div>

      <div className={estilos.trampa} aria-hidden="true">
        <label htmlFor="participacion-sitio">Sitio web</label>
        <input id="participacion-sitio" name="sitioWeb" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {(errorCliente || estado.error) && (
        <p className={`${estilos.respuesta} ${estilos.error}`} role="alert">{errorCliente ?? estado.error}</p>
      )}
      {estado.ok && estado.mensaje && (
        <p className={estilos.respuesta} role="status">{estado.mensaje}</p>
      )}

      <button type="submit" className={estilos.enviar} disabled={enviando}>
        {enviando ? 'Enviando…' : 'Manifestar interés'}
      </button>
    </form>
  )
}
