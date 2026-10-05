'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { type ItemNavegacion } from '@/lib/sitio'
import { Menu, Cerrar } from './Iconos'
import MarcaIsia from './MarcaIsia'
import estilos from './Nav.module.css'

export default function Nav({ items: navegacion }: { items: ItemNavegacion[] }) {
  const ruta = usePathname()
  const [rutaAbierta, setRutaAbierta] = useState<string | null>(null)
  const boton = useRef<HTMLButtonElement>(null)
  const abierto = rutaAbierta === ruta
  const activa = (href: string) =>
    ruta === href || (href !== '/' && ruta.startsWith(href + '/'))
  const items = [
    { href: '/', texto: 'Inicio' },
    ...navegacion.filter((item) => item.href !== '/' && item.href !== '/unete'),
  ]
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
        <Link
          href="/"
          className={estilos.marca}
          onClick={cerrar}
          aria-label="ISIA, ir al inicio"
        >
          <MarcaIsia variante="simbolo" alto={56} decorativa prioridad />
        </Link>
        <Link
          href="/unete"
          className={estilos.cta}
          aria-current={activa('/unete') ? 'page' : undefined}
        >
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
        <nav
          className={`contenedor ${estilos.enlaces}`}
          aria-label="Navegación principal"
        >
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
        </nav>
      </div>
      <nav
        id="menu-movil"
        className={estilos.panel}
        hidden={!abierto}
        aria-label="Navegación móvil"
      >
        {[...items, { href: '/unete', texto: 'Quiero participar' }].map(
          (item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={cerrar}
              aria-current={activa(item.href) ? 'page' : undefined}
            >
              {item.texto}
              <span aria-hidden>↗</span>
            </Link>
          ),
        )}
      </nav>
    </header>
  )
}
