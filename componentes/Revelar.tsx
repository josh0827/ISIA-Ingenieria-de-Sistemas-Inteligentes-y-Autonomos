'use client'

// Revela su contenido cuando entra en pantalla al hacer scroll.
//
// Sin librerías de animación: un IntersectionObserver y una clase CSS bastan.
// Envuelve cualquier bloque con <Revelar> y, si son varios hermanos, pásales
// un retardo creciente para que aparezcan escalonados:
//
//   {lista.map((x, i) => <Revelar key={x.slug} retardo={i * 90}>...</Revelar>)}
//
// Importante: el estado inicial es visible y solo se oculta desde JavaScript.
// Así, si el script falla o el usuario lo tiene desactivado, el contenido se
// ve igual en vez de quedarse en blanco para siempre.

import { useEffect, useRef, useState, type ReactNode } from 'react'
import estilos from './Revelar.module.css'

type Props = {
  children: ReactNode
  /** Milisegundos de retardo, para escalonar hermanos. */
  retardo?: number
  className?: string
}

export default function Revelar({ children, retardo = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [activo, setActivo] = useState(false)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return

    // Si el usuario pide menos movimiento, se muestra sin animar.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActivo(true)
      setVisible(true)
      return
    }

    setActivo(true) // a partir de aquí sí escondemos, porque sabemos animar

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          observador.disconnect() // una sola vez, no se vuelve a esconder
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  const clases = [estilos.revelar, activo ? estilos.activo : '', visible ? estilos.visible : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={clases} style={{ transitionDelay: `${retardo}ms` }}>
      {children}
    </div>
  )
}
