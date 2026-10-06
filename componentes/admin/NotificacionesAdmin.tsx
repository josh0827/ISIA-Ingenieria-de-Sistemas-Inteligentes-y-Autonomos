'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { EVENTO_NOTIFICACION_ADMIN, type DetalleNotificacionAdmin } from './notificar'
import estilos from '@/app/admin/admin.module.css'

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
    if (url.searchParams.get('guardado') === '1') {
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
