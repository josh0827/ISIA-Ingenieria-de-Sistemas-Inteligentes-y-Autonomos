import Link from 'next/link'
import { NAVEGACION, SITIO } from '@/lib/sitio'
import Escudo from './Escudo'
import estilos from './Pie.module.css'
export default function Pie() {
  return (
    <footer className={estilos.pie}>
      <div className="contenedor">
        <div className={estilos.rejilla}>
          <div>
            <Link href="/" className={estilos.marca}>
              <Escudo alto={68} />
              <span>
                <strong>ISIA</strong>
                <span>Semillero de investigación</span>
              </span>
            </Link>
            <p className={estilos.nombre}>{SITIO.nombre}</p>
            <p className={estilos.ubicacion}>
              {SITIO.universidad}
              <br />
              Sede Manizales · Manizales, Colombia
            </p>
          </div>
          <nav aria-label="Secciones del sitio">
            <h2>Explorar</h2>
            <ul className={estilos.enlaces}>
              {NAVEGACION.filter((i) => i.href !== '/unete').map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.texto}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={estilos.contacto}>
            <h2>Participación y contacto</h2>
            <p>Canal de contacto pendiente de confirmar</p>
            <Link href="/unete">
              Conoce cómo participar <span aria-hidden>↗</span>
            </Link>
            <a
              href={SITIO.repositorio}
              target="_blank"
              rel="noreferrer noopener"
            >
              Repositorio del sitio <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
        <div className={estilos.cierre}>
          <p>Demo académica · Contenido pendiente de validación.</p>
          <p>
            Escudo provisional, sin modificaciones. César Puertas Céspedes, vía
            Wikimedia Commons.{' '}
            <a
              href="https://commons.wikimedia.org/wiki/File:Escudo_de_la_Universidad_Nacional_de_Colombia_(2016).svg"
              target="_blank"
              rel="noreferrer noopener"
            >
              Fuente y licencia de atribución
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
