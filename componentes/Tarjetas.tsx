// Tarjetas de novedad, proyecto e integrante.
//
// Están aquí y no dentro de la portada a propósito: quien monte /novedades,
// /proyectos o /integrantes solo tiene que recorrer la lista completa con la
// tarjeta que ya existe, y su página sale igual de cuidada que la portada sin
// escribir una línea de CSS.
//
//   const novedades = listarNovedades()
//   {novedades.map((n) => <TarjetaNovedad key={n.slug} novedad={n} />)}

import Link from 'next/link'
import Image from 'next/image'
import type { Novedad, Proyecto, Integrante } from '@/lib/contenido'
import { Etiqueta, Fecha } from './Base'
import { Flecha, Github, Correo } from './Iconos'
import estilos from './Tarjetas.module.css'

/* ---------------------------------------------------------------- Novedad */

export function TarjetaNovedad({ novedad }: { novedad: Novedad }) {
  return (
    <article className={estilos.novedad}>
      <Link href={`/novedades/${novedad.slug}`} className={estilos.enlaceCompleto}>
        <span className="solo-lectores">Leer {novedad.titulo}</span>
      </Link>

      <div className={estilos.novedadCabecera}>
        <span className={`mono ${estilos.fecha}`}>
          <Fecha iso={novedad.fecha} corta />
        </span>
        <Etiqueta valor={novedad.tipo} />
      </div>

      <h3 className={estilos.novedadTitulo}>{novedad.titulo}</h3>
      {novedad.resumen && <p className={estilos.resumen}>{novedad.resumen}</p>}

      <span className={estilos.pieTarjeta}>
        Leer
        <Flecha size={15} />
      </span>
    </article>
  )
}

/* --------------------------------------------------------------- Proyecto */

export function TarjetaProyecto({ proyecto }: { proyecto: Proyecto }) {
  return (
    <article className={estilos.proyecto}>
      <Link href={`/proyectos/${proyecto.slug}`} className={estilos.enlaceCompleto}>
        <span className="solo-lectores">Ver {proyecto.titulo}</span>
      </Link>

      <div className={estilos.portada}>
        {proyecto.portada ? (
          <Image
            src={proyecto.portada}
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 380px"
            className={estilos.portadaImagen}
          />
        ) : (
          // Sin foto todavía: un degradado muy suave en vez de un hueco gris.
          <div className={estilos.portadaVacia} aria-hidden />
        )}
        <div className={estilos.portadaEtiqueta}>
          <Etiqueta valor={proyecto.estado} />
        </div>
      </div>

      <div className={estilos.proyectoCuerpo}>
        {proyecto.linea && <span className={`mono ${estilos.linea}`}>{proyecto.linea}</span>}
        <h3 className={estilos.proyectoTitulo}>{proyecto.titulo}</h3>
        {proyecto.resumen && <p className={estilos.resumen}>{proyecto.resumen}</p>}

        <span className={estilos.pieTarjeta}>
          Ver proyecto
          <Flecha size={15} />
        </span>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------- Integrante */

/** Primera letra del nombre y del apellido. Descarta las partes que sean solo
 *  numeros, que aparecen en los nombres de ejemplo y darian iniciales raras.
 *  Con una sola palabra devuelve esa letra en vez de inventarse nada. */
function iniciales(nombre: string): string {
  const partes = nombre
    .trim()
    .split(/\s+/)
    .filter((parte) => parte && !/^\d+$/.test(parte))
  if (partes.length === 0) return ''
  if (partes.length === 1) return partes[0][0].toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

export function TarjetaIntegrante({ integrante }: { integrante: Integrante }) {
  const { nombre, rol, area, foto, enlaces } = integrante

  return (
    <article className={estilos.integrante}>
      <div className={estilos.retrato}>
        {foto ? (
          <Image src={foto} alt={nombre} fill sizes="140px" className={estilos.retratoImagen} />
        ) : (
          <span className={estilos.iniciales} aria-hidden>
            {iniciales(nombre)}
          </span>
        )}
      </div>

      <h3 className={estilos.integranteNombre}>{nombre}</h3>
      <span className={`mono ${estilos.rol}`}>{rol}</span>
      {area && <p className={estilos.area}>{area}</p>}

      {(enlaces.github || enlaces.correo) && (
        <div className={estilos.integranteEnlaces}>
          {enlaces.github && (
            <a href={enlaces.github} target="_blank" rel="noreferrer noopener" aria-label={`GitHub de ${nombre}`}>
              <Github size={17} />
            </a>
          )}
          {enlaces.correo && (
            <a href={`mailto:${enlaces.correo}`} aria-label={`Escribir a ${nombre}`}>
              <Correo size={17} />
            </a>
          )}
        </div>
      )}
    </article>
  )
}
