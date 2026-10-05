'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { type ItemNavegacion } from '@/lib/sitio'
import { Menu, Cerrar } from './Iconos'
import MarcaIsia from './MarcaIsia'
import estilos from './Nav.module.css'

export default function Nav({ items: navegacion }: { items: ItemNavegacion[] }) {
  const ruta = usePathname()
  const [rutaAbierta, setRutaAbierta] = useState<string | null>(null)
  const [indicador, setIndicador] = useState({ izquierda: 0, ancho: 0 })
  const boton = useRef<HTMLButtonElement>(null)
  const navegacionRef = useRef<HTMLElement>(null)
  const abierto = rutaAbierta === ruta
  const activa = (href: string) =>
    ruta === href || (href !== '/' && ruta.startsWith(href + '/'))
  const items = useMemo(() => [
    { href: '/', texto: 'Inicio' },
    ...navegacion.filter((item) => item.href !== '/' && item.href !== '/unete'),
  ], [navegacion])

  useLayoutEffect(() => {
    const nav = navegacionRef.current
    if (!nav) return
    function medir() {
      const activo = nav?.querySelector<HTMLElement>('[aria-current="page"]')
      setIndicador(activo
        ? { izquierda: activo.offsetLeft, ancho: activo.offsetWidth }
        : { izquierda: 0, ancho: 0 })
    }
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(nav)
    return () => observador.disconnect()
  }, [ruta, items])

  function cerrar() {
    setRutaAbierta(null)
  }

  return (
    <header
      className={estilos.barra}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && abierto) {
          cerrar()
          boton.current?.focus()
        }
      }}
    >
      <div className={`contenedor ${estilos.fila}`}>
        <Link href="/" className={estilos.marca} onClick={cerrar} aria-label="ISIA, ir al inicio">
          <MarcaIsia variante="simbolo" alto={56} decorativa prioridad />
        </Link>
        <Link href="/unete" className={estilos.cta} aria-current={activa('/unete') ? 'page' : undefined}>
          Quiero participar <span aria-hidden>↗</span>
        </Link>
        <button
          ref={boton}
          type="button"
          className={estilos.hamburguesa}
          onClick={() => setRutaAbierta(abierto ? null : ruta)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
        >
          {abierto ? <Cerrar size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className={estilos.navBorde}>
        <nav ref={navegacionRef} className={`contenedor ${estilos.enlaces}`} aria-label="Navegación principal">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={estilos.enlace}
              aria-current={activa(item.href) ? 'page' : undefined}
            >
              {item.texto}
            </Link>
          ))}
          <span
            className={estilos.indicador}
            data-visible={indicador.ancho > 0}
            style={{ left: indicador.izquierda, width: indicador.ancho }}
            aria-hidden="true"
          />
        </nav>
      </div>
      <nav
        id="menu-movil"
        className={estilos.panel}
        data-abierto={abierto}
        aria-hidden={!abierto}
        aria-label="Navegación móvil"
      >
        {[...items, { href: '/unete', texto: 'Quiero participar' }].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={cerrar}
            tabIndex={abierto ? undefined : -1}
            aria-current={activa(item.href) ? 'page' : undefined}
          >
            {item.texto}
            <span aria-hidden>↗</span>
          </Link>
        ))}
      </nav>
    </header>
  )
}
