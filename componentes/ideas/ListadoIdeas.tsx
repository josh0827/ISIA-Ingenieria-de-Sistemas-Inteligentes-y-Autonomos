'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { IdeaReto } from '@/lib/contenido'
import estilos from '@/app/networking.module.css'

type IdeaResumen = Pick<IdeaReto, 'slug' | 'titulo' | 'resumen' | 'problema' | 'area' | 'estado' | 'madurez' | 'necesidades' | 'portada' | 'portadaAlt'>

export default function ListadoIdeas({ ideas }: { ideas: IdeaResumen[] }) {
  const [consulta, setConsulta] = useState('')
  const [area, setArea] = useState('Todas')
  const areas = useMemo(() => ['Todas', ...Array.from(new Set(ideas.map((idea) => idea.area))).sort()], [ideas])
  const visibles = useMemo(() => ideas.filter((idea) => {
    const texto = [idea.titulo, idea.resumen, idea.problema, idea.area, ...idea.necesidades].join(' ').toLowerCase()
    return (area === 'Todas' || idea.area === area) && texto.includes(consulta.trim().toLowerCase())
  }), [area, consulta, ideas])
  return <>
    <div className={estilos.filtros}>
      <label>Buscar ideas<input type="search" value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder="Problema, tecnología o apoyo" /></label>
      <label>Área<select value={area} onChange={(e) => setArea(e.target.value)}>{areas.map((valor) => <option key={valor}>{valor}</option>)}</select></label>
    </div>
    <div className={estilos.rejillaIdeas}>{visibles.map((idea) => <Link href={'/ideas/' + idea.slug} className={estilos.idea} key={idea.slug}>
      <div className={estilos.imagenIdea}>{idea.portada && <Image src={idea.portada} alt={idea.portadaAlt ?? ''} fill sizes="(max-width: 620px) 100vw, 33vw" />}</div>
      <div className={estilos.cuerpoIdea}><div className={estilos.meta}><span>{idea.area}</span><span>{idea.madurez}</span><span>{idea.estado}</span></div><h2>{idea.titulo}</h2><p>{idea.resumen}</p>{idea.necesidades.length > 0 && <strong>Busca: {idea.necesidades.join(', ')}</strong>}</div>
    </Link>)}</div>
    {visibles.length === 0 && <p>No hay ideas que coincidan con los filtros.</p>}
  </>
}
