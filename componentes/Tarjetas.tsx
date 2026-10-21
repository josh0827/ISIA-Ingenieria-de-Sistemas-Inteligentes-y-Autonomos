import Link from 'next/link'
import Image from 'next/image'
import type { Novedad, Proyecto, Integrante } from '@/lib/contenido'
import { Etiqueta, Fecha } from './Base'
import { LINEAS } from '@/lib/sitio'
import { Flecha, Persona, Antena, Ojo, Brujula, Onda, Red, Brazo } from './Iconos'
import estilos from './Tarjetas.module.css'

export function TarjetaNovedad({
  novedad,
  nivelTitulo = 3,
}: {
  novedad: Novedad
  nivelTitulo?: 2 | 3
}) {
  const Titulo = nivelTitulo === 2 ? 'h2' : 'h3'
  return (
    <article className={estilos.novedad}>
      <div className={estilos.novedadFecha}>
        <span className="mono">
          {novedad.ilustrativo ? 'Fecha de ejemplo' : 'Publicado'}
        </span>
        <Fecha iso={novedad.fecha} corta />
      </div>
      <div className={estilos.novedadCuerpo}>
        <div className={estilos.meta}>
          <Etiqueta valor={novedad.tipo} />
          {novedad.ilustrativo && (
            <span className={estilos.demo}>Nota ilustrativa</span>
          )}
        </div>
        <Titulo>
          <Link href={`/novedades/${novedad.slug}`}>{novedad.titulo}</Link>
        </Titulo>
        <p>{novedad.resumen}</p>
      </div>
      <Link
        href={`/novedades/${novedad.slug}`}
        className={estilos.flechaEnlace}
        aria-label={`Leer: ${novedad.titulo}`}
      >
        <Flecha size={22} />
      </Link>
    </article>
  )
}

const ICONOS_LINEA: Record<string, typeof Ojo> = {
  ojo: Ojo,
  brujula: Brujula,
  antena: Antena,
  red: Red,
  brazo: Brazo,
  onda: Onda,
}

function iconoDeLinea(linea: string) {
  const referencia = LINEAS.find((item) => item.titulo === linea)
  return (referencia && ICONOS_LINEA[referencia.icono]) || Antena
}

export function TarjetaProyecto({
  proyecto,
  nivelTitulo = 3,
}: {
  proyecto: Proyecto
  nivelTitulo?: 2 | 3
}) {
  const Titulo = nivelTitulo === 2 ? 'h2' : 'h3'
  const Icono = iconoDeLinea(proyecto.linea)
  return (
    <article className={estilos.proyecto}>
      <Link
        href={`/proyectos/${proyecto.slug}`}
        className={estilos.portada}
        aria-label={`Ver proyecto: ${proyecto.titulo}`}
      >
        {proyecto.portada ? (
          <Image
            src={proyecto.portada}
            alt={proyecto.portadaAlt ?? `Imagen del proyecto ${proyecto.titulo}`}
            fill
            sizes="(max-width: 700px) 90vw, 400px"
            className={estilos.portadaImagen}
          />
        ) : (
          <div className={estilos.portadaVacia}>
            <span className={estilos.marcoIcono}>
              <Icono size={48} />
            </span>
            <span>Registro visual pendiente</span>
          </div>
        )}
        {proyecto.ilustrativo && (
          <span className={estilos.portadaEtiqueta}>PROYECTO ILUSTRATIVO</span>
        )}
      </Link>
      <div className={estilos.proyectoCuerpo}>
        <span className={estilos.linea}>{proyecto.linea}</span>
        <Titulo>
          <Link href={`/proyectos/${proyecto.slug}`}>{proyecto.titulo}</Link>
        </Titulo>
        <p>{proyecto.resumen}</p>
        <div className={estilos.pieProyecto}>
          <Etiqueta valor={proyecto.estado} />
          <Link
            href={`/proyectos/${proyecto.slug}`}
            aria-label={`Consultar ficha: ${proyecto.titulo}`}
          >
            <span>Ver proyecto</span>
            <Flecha size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}

const ROLES = {
  director: 'Orientación académica',
  investigador: 'Investigación',
  estudiante: 'Estudiantes de pregrado',
  egresado: 'Egresados',
}
export function TarjetaIntegrante({ integrante }: { integrante: Integrante }) {
  return (
    <article className={estilos.integrante}>
      <div className={estilos.retrato}>
        {integrante.foto ? (
          <Image
            src={integrante.foto}
            alt={integrante.fotoAlt ?? integrante.nombre}
            fill
            sizes="80px"
            className={estilos.retratoImagen}
          />
        ) : (
          <Persona size={30} />
        )}
      </div>
      <div>
        <span className={estilos.rol}>{ROLES[integrante.rol]}</span>
        <h3>{integrante.nombre}</h3>
        <p>{integrante.area}</p>
        <span className={estilos.demo}>
          {integrante.ilustrativo
            ? 'Perfil ilustrativo · Datos pendientes'
            : 'Integrante'}
        </span>
        {!integrante.ilustrativo && (
          <div className={estilos.integranteEnlaces}>
            {integrante.enlaces.github && (
              <a
                href={integrante.enlaces.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub ↗
                <span className="solo-lectores"> (se abre en una pestaña nueva)</span>
              </a>
            )}
            {integrante.enlaces.linkedin && (
              <a
                href={integrante.enlaces.linkedin}
                target="_blank"
                rel="noreferrer noopener"
              >
                LinkedIn ↗
                <span className="solo-lectores"> (se abre en una pestaña nueva)</span>
              </a>
            )}
            {integrante.enlaces.correo && (
              <a href={`mailto:${integrante.enlaces.correo}`}>Correo</a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
