'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import estilos from './ProgresoNavegacion.module.css'

export default function ProgresoNavegacion() {
  const ruta = usePathname()
  const [visible, setVisible] = useState(false)
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined)
  const ubicacion = useRef('')

  useEffect(() => {
    setVisible(false)
    clearTimeout(temporizador.current)
    ubicacion.current = window.location.pathname + window.location.search
  }, [ruta])

  useEffect(() => {
    function iniciar(evento: MouseEvent) {
      if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return
      const enlace = (evento.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!enlace || enlace.target === '_blank' || enlace.hasAttribute('download')) return
      const destino = new URL(enlace.href, window.location.href)
      if (destino.origin !== window.location.origin) return
      if (destino.pathname === window.location.pathname && destino.search === window.location.search) return
      setVisible(true)
      clearTimeout(temporizador.current)
      temporizador.current = setTimeout(() => setVisible(false), 8000)
    }

    // Volver atrás desde un ancla (#contenido) también dispara popstate, pero
    // la ruta no cambia y la barra se quedaba encendida para siempre.
    function iniciarHistorial() {
      if (window.location.pathname + window.location.search === ubicacion.current) return
      setVisible(true)
      clearTimeout(temporizador.current)
      temporizador.current = setTimeout(() => setVisible(false), 8000)
    }

    document.addEventListener('click', iniciar, true)
    window.addEventListener('popstate', iniciarHistorial)
    return () => {
      document.removeEventListener('click', iniciar, true)
      window.removeEventListener('popstate', iniciarHistorial)
      clearTimeout(temporizador.current)
    }
  }, [])

  return (
    <div
      className={estilos.pista}
      data-visible={visible}
      role="progressbar"
      aria-label="Cargando nueva página"
      aria-hidden={!visible}
    >
      <span />
    </div>
  )
}
