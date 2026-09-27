'use client'

import { useMemo, useState } from 'react'
import { Etiqueta, EstadoVacio } from '@/componentes/Base'
import type { PracticaOferta } from '@/lib/practicas'
import estilos from '@/app/practicas/practicas.module.css'

export default function ListadoPracticas({ ofertas }: { ofertas: PracticaOferta[] }) {
  const [modalidad, setModalidad] = useState('Todas')
  const [consulta, setConsulta] = useState('')
  const visibles = useMemo(() => ofertas.filter((oferta) => {
    const coincideModalidad = modalidad === 'Todas' || oferta.modalidad === modalidad
    const texto = `${oferta.titulo} ${oferta.empresaNombre} ${oferta.descripcion} ${oferta.requisitos.join(' ')}`.toLowerCase()
    return coincideModalidad && texto.includes(consulta.trim().toLowerCase())
  }), [consulta, modalidad, ofertas])

  if (!ofertas.length) {
    return <EstadoVacio titulo="Aún no hay prácticas publicadas" descripcion="Las ofertas se mostrarán aquí cuando una empresa autorizada las publique y el semillero valide su difusión." />
  }

  return <>
    <div className={estilos.filtros} aria-label="Filtrar prácticas">
      <label>Modalidad<select value={modalidad} onChange={(evento) => setModalidad(evento.target.value)}><option>Todas</option><option>Presencial</option><option>Híbrida</option><option>Remota</option></select></label>
      <label>Buscar por tema o requisito<input type="search" value={consulta} onChange={(evento) => setConsulta(evento.target.value)} placeholder="Ej. visión, Python, firmware" /></label>
    </div>
    {visibles.length ? <div className={estilos.rejilla}>{visibles.map((oferta) => <article className={estilos.tarjeta} key={oferta.id}>
      <div className={estilos.cabeceraTarjeta}><Etiqueta valor={oferta.modalidad} /><span>{oferta.ubicacion}</span></div>
      <h2>{oferta.titulo}</h2><p className={estilos.empresa}>{oferta.empresaNombre}</p><p>{oferta.descripcion}</p>
      {oferta.requisitos.length > 0 && <ul className={estilos.requisitos}>{oferta.requisitos.map((requisito) => <li key={requisito}>{requisito}</li>)}</ul>}
      <div className={estilos.acciones}>{oferta.urlPostulacion ? <a href={oferta.urlPostulacion} target="_blank" rel="noreferrer noopener">Consultar postulación ↗</a> : <span>Canal de postulación por confirmar</span>}</div>
    </article>)}</div> : <EstadoVacio titulo="No hay coincidencias" descripcion="Prueba con otra modalidad o término de búsqueda." />}
  </>
}
