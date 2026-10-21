'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { EVENTO_NOTIFICACION_ADMIN, type DetalleNotificacionAdmin } from './notificar'
import estilos from '@/app/admin/admin.module.css'

const MENSAJES_RESULTADO = {
  'respuesta-publicada': 'Respuesta publicada. Ya aparece en Preguntas y respuestas.',
  'respuesta-guardada': 'Respuesta guardada como pendiente. Todavía no aparece en el sitio público.',
  'pregunta-archivada': 'Pregunta archivada. Ya no aparece en el sitio público.',
  'pregunta-eliminada': 'Pregunta y datos personales eliminados correctamente.',
} as const

export default function NotificacionesAdmin() {
  const ruta = usePathname()
  const [aviso, setAviso] = useState<DetalleNotificacionAdmin | null>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function mostrar(detalle: DetalleNotificacionAdmin) {
    clearTimeout(temporizador.current)
    setAviso(detalle)
    temporizador.current = setTimeout(() => setAviso(null), 3200)
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const resultado = url.searchParams.get('resultado') as keyof typeof MENSAJES_RESULTADO | null
    if (resultado && MENSAJES_RESULTADO[resultado]) {
      mostrar({ mensaje: MENSAJES_RESULTADO[resultado], tipo: 'exito' })
      url.searchParams.delete('resultado')
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
    } else if (url.searchParams.get('guardado') === '1') {
      mostrar({ mensaje: 'Los cambios se guardaron correctamente.', tipo: 'exito' })
      url.searchParams.delete('guardado')
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
    }
  }, [ruta])

  useEffect(() => {
    function recibir(evento: Event) {
      mostrar((evento as CustomEvent<DetalleNotificacionAdmin>).detail)
    }
    window.addEventListener(EVENTO_NOTIFICACION_ADMIN, recibir)
    return () => {
      window.removeEventListener(EVENTO_NOTIFICACION_ADMIN, recibir)
      clearTimeout(temporizador.current)
    }
  }, [])

  return (
    <div
      className={estilos.notificacion}
      data-visible={Boolean(aviso)}
      data-tipo={aviso?.tipo ?? 'exito'}
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">{aviso?.tipo === 'error' ? '!' : '✓'}</span>
      {aviso?.mensaje}
    </div>
  )
}
