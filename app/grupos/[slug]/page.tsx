import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Seccion } from '@/componentes/Base'
import { obtenerGrupoTrabajo } from '@/lib/grupos'
import { seccionVisible } from '@/lib/configuracion'
import estilos from '../grupos.module.css'

type Props = { params: Promise<{ slug: string }> }
export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const grupo = await obtenerGrupoTrabajo((await params).slug)
  return grupo
    ? { title: grupo.nombre, description: grupo.descripcion }
    : { title: 'Grupo no encontrado' }
}

export default async function DetalleGrupo({ params }: Props) {
  if (!(await seccionVisible('grupos'))) notFound()
  const grupo = await obtenerGrupoTrabajo((await params).slug)
  if (!grupo) notFound()
  return (
    <Seccion className={estilos.primeraSeccion}>
      <article className={estilos.detalle}>
        <nav className={estilos.migas} aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link><span aria-hidden>/</span>
          <Link href="/grupos">Grupos</Link><span aria-hidden>/</span>
          <span aria-current="page">{grupo.nombre}</span>
        </nav>
        <header className={estilos.cabeceraDetalle}>
          <span className="mono">Grupo de trabajo</span>
          <h1>{grupo.nombre}</h1>
          <p>{grupo.descripcion}</p>
        </header>
        {grupo.imagenPortada && (
          <div className={estilos.portadaDetalle}>
            <Image src={grupo.imagenPortada} alt={`Portada del grupo ${grupo.nombre}`} fill sizes="(max-width: 900px) 92vw, 900px" priority />
          </div>
        )}
        <div className={estilos.bloques}>
          <section><h2>Integrantes</h2>
            {grupo.integrantes.length ? <ul className={estilos.lista}>{grupo.integrantes.map((nombre) => <li key={nombre}>{nombre}</li>)}</ul> : <p className={estilos.pendiente}>Integrantes pendientes de registrar.</p>}
          </section>
          <section><h2>Repositorios</h2>
            {grupo.repositorios.length ? <ul className={estilos.recursos}>{grupo.repositorios.map((recurso) => <li key={recurso.url}><a href={recurso.url} target="_blank" rel="noreferrer noopener">{recurso.nombre} ↗</a></li>)}</ul> : <p className={estilos.pendiente}>Repositorios pendientes de publicar.</p>}
          </section>
          <section><h2>Documentos</h2>
            {grupo.documentos.length ? <ul className={estilos.recursos}>{grupo.documentos.map((recurso) => <li key={recurso.url}><a href={recurso.url} target="_blank" rel="noreferrer noopener">{recurso.nombre} ↗</a></li>)}</ul> : <p className={estilos.pendiente}>Documentos pendientes de publicar.</p>}
          </section>
        </div>
        <section className={estilos.galeria}>
          <h2>Galería</h2>
          {grupo.galeriaImagenes.length ? (
            <div className={estilos.rejillaGaleria}>{grupo.galeriaImagenes.map((imagen, indice) => (
              <figure key={imagen}><Image src={imagen} alt={`Registro visual ${indice + 1} del grupo ${grupo.nombre}`} width={720} height={480} /></figure>
            ))}</div>
          ) : <p className={estilos.pendiente}>Registro visual pendiente.</p>}
        </section>
      </article>
    </Seccion>
  )
}
