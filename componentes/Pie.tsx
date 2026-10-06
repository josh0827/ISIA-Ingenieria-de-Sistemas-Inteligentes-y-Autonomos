import Link from 'next/link'
import { SITIO, type ItemNavegacion } from '@/lib/sitio'
import estilos from './Pie.module.css'
export default function Pie({ items }: { items: ItemNavegacion[] }) {
  return (
    <footer className={estilos.pie}>
      <div className="contenedor">
        <div className={estilos.rejilla}>
          <div>
            {/* El logo ya aparece en el menú y en la portada; aquí basta el nombre. */}
            <Link href="/" className={estilos.marca} aria-label="ISIA, ir al inicio">
              <strong>{SITIO.sigla}</strong>
              <span>
                {SITIO.nombreLineas[0]}
                <br />
                {SITIO.nombreLineas[1]}
              </span>
            </Link>
            <p className={estilos.ubicacion}>
              {SITIO.universidad}
              <br />
              {SITIO.sede} · {SITIO.ubicacion}
            </p>
          </div>
          <nav aria-label="Secciones del sitio">
            <h2>Explorar</h2>
            <ul className={estilos.enlaces}>
              {items.filter((i) => i.href !== '/unete').map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.texto}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={estilos.contacto}>
            <h2>Participación y contacto</h2>
            <p>Escríbenos para resolver inquietudes académicas o manifestar tu interés en participar.</p>
            <a href={SITIO.correoHref}>{SITIO.correo}</a>
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
          <p>
            © {new Date().getFullYear()} {SITIO.nombreCorto} · {SITIO.universidad}, {SITIO.sede}
          </p>
        </div>
      </div>
    </footer>
  )
}
