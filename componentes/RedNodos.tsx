'use client'

// Fondo animado de la portada: una red de nodos que se desplazan despacio y
// se enlazan entre sí cuando están cerca. Es el tema del grupo dibujado
// literalmente, agentes que se conectan y se coordinan.
//
// Se dibuja en un <canvas> sin ninguna librería. El coste está controlado:
// la densidad depende del ancho de pantalla (en un móvil hay menos de la
// mitad de nodos), la animación se detiene cuando la pestaña no está visible
// y no arranca siquiera si el usuario ha pedido menos movimiento.

import { useEffect, useRef } from 'react'
import estilos from './RedNodos.module.css'

type Nodo = { x: number; y: number; vx: number; vy: number; r: number }

const DISTANCIA_ENLACE = 148 // px a los que dos nodos se unen con una línea
const RADIO_RATON = 190 // px de influencia del cursor

export default function RedNodos() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Quien pide menos movimiento recibe una versión estática: se dibuja un
    // solo fotograma y no se pide ningún frame más.
    const quietud = window.matchMedia('(prefers-reduced-motion: reduce)')

    let nodos: Nodo[] = []
    let ancho = 0
    let alto = 0
    let animacion = 0
    const raton = { x: -9999, y: -9999 }

    function medir() {
      if (!canvas || !ctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // 2 basta y ahorra relleno
      const caja = canvas.getBoundingClientRect()
      ancho = caja.width
      alto = caja.height
      canvas.width = Math.round(ancho * dpr)
      canvas.height = Math.round(alto * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function sembrar() {
      // Un nodo por cada ~18.000 px², acotado para que ni el móvil se ahogue
      // ni una pantalla grande se quede vacía.
      const cantidad = Math.round(Math.min(Math.max((ancho * alto) / 18000, 26), 90))
      nodos = Array.from({ length: cantidad }, () => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.9,
      }))
    }

    function pintar() {
      if (!ctx) return
      ctx.clearRect(0, 0, ancho, alto)

      // Enlaces primero, para que los nodos queden por encima.
      for (let i = 0; i < nodos.length; i++) {
        for (let j = i + 1; j < nodos.length; j++) {
          const dx = nodos[i].x - nodos[j].x
          const dy = nodos[i].y - nodos[j].y
          const dist = Math.hypot(dx, dy)
          if (dist > DISTANCIA_ENLACE) continue

          // Cuanto más cerca, más opaca la línea.
          const fuerza = 1 - dist / DISTANCIA_ENLACE
          ctx.strokeStyle = `rgba(56, 225, 208, ${fuerza * 0.16})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(nodos[i].x, nodos[i].y)
          ctx.lineTo(nodos[j].x, nodos[j].y)
          ctx.stroke()
        }
      }

      for (const n of nodos) {
        // Los nodos cerca del cursor se encienden en ámbar.
        const cerca = Math.hypot(n.x - raton.x, n.y - raton.y)
        const encendido = cerca < RADIO_RATON ? 1 - cerca / RADIO_RATON : 0

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + encendido * 1.6, 0, Math.PI * 2)
        ctx.fillStyle =
          encendido > 0.02
            ? `rgba(232, 176, 75, ${0.3 + encendido * 0.6})`
            : 'rgba(56, 225, 208, 0.34)'
        ctx.fill()
      }
    }

    function paso() {
      for (const n of nodos) {
        n.x += n.vx
        n.y += n.vy
        // Rebote en los bordes, así ningún nodo se pierde fuera del lienzo.
        if (n.x < 0 || n.x > ancho) n.vx *= -1
        if (n.y < 0 || n.y > alto) n.vy *= -1
      }
      pintar()
      animacion = requestAnimationFrame(paso)
    }

    function arrancar() {
      cancelAnimationFrame(animacion)
      if (quietud.matches) {
        pintar() // un único fotograma, sin movimiento
        return
      }
      animacion = requestAnimationFrame(paso)
    }

    function alRedimensionar() {
      medir()
      sembrar()
      arrancar()
    }

    function alMover(e: PointerEvent) {
      if (!canvas) return
      const caja = canvas.getBoundingClientRect()
      raton.x = e.clientX - caja.left
      raton.y = e.clientY - caja.top
    }

    function alSalir() {
      raton.x = -9999
      raton.y = -9999
    }

    // Si la pestaña queda en segundo plano no tiene sentido seguir pintando.
    function alCambiarVisibilidad() {
      if (document.hidden) cancelAnimationFrame(animacion)
      else arrancar()
    }

    medir()
    sembrar()
    arrancar()

    window.addEventListener('resize', alRedimensionar)
    window.addEventListener('pointermove', alMover, { passive: true })
    window.addEventListener('pointerleave', alSalir)
    document.addEventListener('visibilitychange', alCambiarVisibilidad)
    quietud.addEventListener('change', arrancar)

    return () => {
      cancelAnimationFrame(animacion)
      window.removeEventListener('resize', alRedimensionar)
      window.removeEventListener('pointermove', alMover)
      window.removeEventListener('pointerleave', alSalir)
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
      quietud.removeEventListener('change', arrancar)
    }
  }, [])

  return <canvas ref={ref} className={estilos.lienzo} aria-hidden />
}
