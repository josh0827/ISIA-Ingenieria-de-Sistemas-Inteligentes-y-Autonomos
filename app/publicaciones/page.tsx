import type { Metadata } from 'next'
import { Boton, EncabezadoPagina, EstadoVacio, Seccion } from '@/componentes/Base'
import { listarPublicaciones, markdownAHtml } from '@/lib/contenido'
import estilos from '../secundarias.module.css'

export const metadata: Metadata = {
  title: 'Publicaciones y recursos',
  description: 'Espacio de publicaciones y recursos académicos de ISIA. Demo con contenido pendiente de validación.',
}

export const dynamic = 'force-dynamic'

export default async function PaginaPublicaciones() {
  const listado = await listarPublicaciones()
  const publicaciones = await Promise.all(listado.map(async (publicacion) => ({
    ...publicacion,
    html: await markdownAHtml(publicacion.cuerpo),
  })))
  const anios = [...new Set(publicaciones.map((publicacion) => publicacion.anio))].sort((a, b) => b - a)

  return (
    <Seccion className={estilos.primeraSeccion}>
      <EncabezadoPagina
        indice="Conocimiento compartido"
        titulo="Publicaciones y recursos"
        descripcion="Un espacio de consulta para artículos, informes, presentaciones y otros materiales académicos del semillero."
      />
      {publicaciones.length === 0 ? (
        <>
          <EstadoVacio
            titulo="Publicaciones pendientes de validación"
            descripcion="Esta demo aún no incluye publicaciones ni recursos académicos confirmados. Aquí podrás consultar su título, autoría, año y enlace cuando estén disponibles."
          >
            <Boton href="/proyectos" variante="sutil">Explorar proyectos ilustrativos</Boton>
          </EstadoVacio>
          <div className={estilos.notaEditorial}>
            <span className={estilos.sobretitulo}>Sobre este espacio</span>
            <p>Los materiales se organizarán por año de publicación, del más reciente al más antiguo, con su tipo de recurso y fuente de consulta.</p>
          </div>
        </>
      ) : (
        <div className={estilos.grupos}>
          {anios.map((anio) => (
            <section className={estilos.grupoPublicaciones} key={anio} aria-labelledby={`anio-${anio}`}>
              <h2 id={`anio-${anio}`} className={estilos.anio}>{anio}</h2>
              <div className={estilos.publicaciones}>
                {publicaciones.filter((publicacion) => publicacion.anio === anio).map((publicacion) => (
                  <article key={publicacion.slug} className={estilos.publicacion}>
                    <span className={estilos.sobretitulo}>{publicacion.tipo}</span>
                    <h3>{publicacion.titulo}</h3>
                    <p className={estilos.autores}>{publicacion.autores.join(' · ')}</p>
                    {publicacion.html && <div className="prosa" dangerouslySetInnerHTML={{ __html: publicacion.html }} />}
                    {publicacion.enlace && <Boton href={publicacion.enlace} variante="sutil">Consultar recurso<span className="solo-lectores">: {publicacion.titulo}</span></Boton>}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Seccion>
  )
}
