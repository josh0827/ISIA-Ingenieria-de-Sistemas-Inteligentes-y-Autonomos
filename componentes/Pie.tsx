// Pie del sitio. Se pinta en todas las páginas desde app/layout.tsx.

import Link from 'next/link'
import { NAVEGACION, SITIO } from '@/lib/sitio'
import { Monograma, Correo, Github, Pin } from './Iconos'
import estilos from './Pie.module.css'

export default function Pie() {
  return (
    <footer className={estilos.pie}>
      <div className="contenedor">
        <div className={estilos.rejilla}>
          <div className={estilos.identidad}>
            <Link href="/" className={estilos.marca}>
              <Monograma size={34} className={estilos.monograma} />
              <span className={estilos.sigla}>{SITIO.sigla}</span>
            </Link>
            <p className={estilos.nombre}>{SITIO.nombre}</p>
            <p className={estilos.descripcion}>{SITIO.descripcion}</p>
          </div>

          <nav className={estilos.columna} aria-label="Secciones">
            <h2 className={`mono ${estilos.tituloColumna}`}>Secciones</h2>
            <ul>
              {NAVEGACION.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={estilos.enlace}>
                    {item.texto}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/unete" className={estilos.enlace}>
                  Únete al grupo
                </Link>
              </li>
            </ul>
          </nav>

          <div className={estilos.columna}>
            <h2 className={`mono ${estilos.tituloColumna}`}>Contacto</h2>
            <ul>
              <li>
                <a href={`mailto:${SITIO.correo}`} className={estilos.enlaceIcono}>
                  <Correo size={17} />
                  {SITIO.correo}
                </a>
              </li>
              <li>
                <span className={estilos.enlaceIcono}>
                  <Pin size={17} />
                  {SITIO.ubicacion}
                </span>
              </li>
              {SITIO.redes.github && (
                <li>
                  <a
                    href={SITIO.redes.github}
                    className={estilos.enlaceIcono}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Github size={17} />
                    Repositorio del grupo
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className={estilos.cierre}>
          <p className="mono">
            {SITIO.universidad} · {SITIO.sede}
          </p>
          <p className="mono">
            {SITIO.sigla} {SITIO.fundacion}
          </p>
        </div>
      </div>
    </footer>
  )
}
