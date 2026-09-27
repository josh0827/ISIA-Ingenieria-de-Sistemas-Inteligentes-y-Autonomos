import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EncabezadoPagina, Seccion } from '@/componentes/Base'
import { listarGruposTrabajo } from '@/lib/grupos'
import estilos from './grupos.module.css'

export const metadata: Metadata = {
  title: 'Grupos de trabajo',
  description: 'Conoce los grupos de trabajo, sus temas y recursos dentro del semillero ISIA.',
}
export const dynamic = 'force-dynamic'

export default async function PaginaGrupos() {
  const grupos = await listarGruposTrabajo()
  return (
    <Seccion className={estilos.primeraSeccion}>
      <EncabezadoPagina
        indice="Organización académica"
        titulo="Grupos de trabajo"
        descripcion="Equipos que reúnen intereses técnicos y líneas de desarrollo dentro del semillero."
      />
      <div className={estilos.rejilla}>
        {grupos.map((grupo, indice) => (
          <article className={estilos.tarjeta} key={grupo.slug}>
            <div className={estilos.visual}>
              {grupo.imagenPortada ? (
                <Image src={grupo.imagenPortada} alt={`Portada del grupo ${grupo.nombre}`} fill sizes="(max-width: 700px) 92vw, 46vw" />
              ) : (
                <span aria-hidden>{String(indice + 1).padStart(2, '0')}</span>
              )}
            </div>
            <div className={estilos.cuerpo}>
              <span className="mono">Grupo de trabajo</span>
              <h2><Link href={`/grupos/${grupo.slug}`}>{grupo.nombre}</Link></h2>
              <p>{grupo.descripcion}</p>
              <div className={estilos.pie}>
                <span>{grupo.integrantes.length ? `${grupo.integrantes.length} integrantes` : 'Integrantes por registrar'}</span>
                <Link href={`/grupos/${grupo.slug}`}>Conocer el grupo ↗</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Seccion>
  )
}
