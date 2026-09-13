'use client'

// Barra de navegación fija.
//
// Los enlaces NO están escritos aquí: salen de NAVEGACION en lib/sitio.ts.
// Si añades una sección al sitio, la añades allí y aparece sola en la barra,
// en el menú móvil y en el pie.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAVEGACION, SITIO } from '@/lib/sitio'
import { Menu, Cerrar } from './Iconos'
import Escudo from './Escudo'
import estilos from './Nav.module.css'

export default function Nav() {
  const ruta = usePathname()
  const [abierto, setAbierto] = useState(false)
  const [posado, setPosado] = useState(false)

  // La barra se vuelve opaca en cuanto se baja un poco, para que el texto no
  // se mezcle con el contenido que pasa por debajo.
  useEffect(() => {
    const alScroll = () => setPosado(window.scrollY > 24)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  // Al navegar se cierra el menú móvil.
  useEffect(() => setAbierto(false), [ruta])

  // Con el menú abierto se bloquea el scroll del fondo.
  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [abierto])

  // Escape cierra el menú.
  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [abierto])

  const esActiva = (href: string) => ruta === href || ruta.startsWith(`${href}/`)

  return (
    <>
      <header className={`${estilos.barra} ${posado ? estilos.posada : ''}`}>
        <div className={`contenedor ${estilos.fila}`}>
          {/* Bloque de marca: escudo institucional, separador y sigla con la
              universidad debajo. Es el orden habitual de un grupo que depende
              de una institución, primero ella y después el grupo. */}
          <Link href="/" className={estilos.marca} aria-label={`${SITIO.sigla}, ir al inicio`}>
            <Escudo alto={32} />
            <span className={estilos.separador} aria-hidden />
            <span className={estilos.identidad}>
              <span className={estilos.sigla}>{SITIO.sigla}</span>
              <span className={`mono ${estilos.institucion}`}>{SITIO.universidad}</span>
            </span>
          </Link>

          <nav className={estilos.enlaces} aria-label="Navegación principal">
            {NAVEGACION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${estilos.enlace} ${esActiva(item.href) ? estilos.activo : ''}`}
              >
                {item.texto}
              </Link>
            ))}
          </nav>

          <div className={estilos.acciones}>
            <Link href="/unete" className={estilos.cta}>
              Únete al grupo
            </Link>
            <button
              className={estilos.hamburguesa}
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              {abierto ? <Cerrar size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil a pantalla completa. */}
      <div className={`${estilos.panel} ${abierto ? estilos.panelAbierto : ''}`} hidden={!abierto}>
        <nav className={estilos.panelEnlaces} aria-label="Navegación móvil">
          {NAVEGACION.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${estilos.panelEnlace} ${esActiva(item.href) ? estilos.activo : ''}`}
              style={{ transitionDelay: `${60 + i * 35}ms` }}
            >
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              {item.texto}
            </Link>
          ))}
          <Link href="/unete" className={`${estilos.panelEnlace} ${estilos.panelCta}`}>
            <span className="mono">{String(NAVEGACION.length + 1).padStart(2, '0')}</span>
            Únete al grupo
          </Link>
        </nav>
      </div>
    </>
  )
}
