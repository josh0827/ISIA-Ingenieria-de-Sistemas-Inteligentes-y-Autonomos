'use client'

import { useMemo, useState } from 'react'
import { Etiqueta, EstadoVacio } from '@/componentes/Base'
import type { PracticaOferta } from '@/lib/practicas'
import estilos from '@/app/practicas/practicas.module.css'

export default function ListadoPracticas({ ofertas, historico = false }: { ofertas: PracticaOferta[]; historico?: boolean }) {
  const [modalidad, setModalidad] = useState('Todas')
  const [consulta, setConsulta] = useState('')
  const visibles = useMemo(() => ofertas.filter((oferta) => {
    const coincideModalidad = modalidad === 'Todas' || oferta.modalidad === modalidad
    const texto = `${oferta.tipo} ${oferta.titulo} ${oferta.empresaNombre} ${oferta.descripcion} ${oferta.requisitos.join(' ')}`.toLowerCase()
    return coincideModalidad && texto.includes(consulta.trim().toLowerCase())
  }), [consulta, modalidad, ofertas])

  if (!ofertas.length) {
    return <EstadoVacio titulo={historico ? 'Aún no hay oportunidades en el histórico' : 'Aún no hay prácticas publicadas'} descripcion={historico ? 'Las oportunidades cerradas o archivadas se conservarán aquí como referencia.' : 'Las ofertas se mostrarán aquí cuando una organización autorizada las publique y el semillero valide su difusión.'} />
  }

  return <>
    <div className={estilos.filtros} aria-label="Filtrar prácticas">
      <label>Modalidad<select value={modalidad} onChange={(evento) => setModalidad(evento.target.value)}><option>Todas</option><option>Presencial</option><option>Híbrida</option><option>Remota</option></select></label>
      <label>Buscar por tema o requisito<input type="search" value={consulta} onChange={(evento) => setConsulta(evento.target.value)} placeholder="Ej. visión, Python, firmware" /></label>
    </div>
    {visibles.length ? <div className={estilos.rejilla}>{visibles.map((oferta) => <article className={estilos.tarjeta} data-historico={historico} key={oferta.id}>
      <div className={estilos.cabeceraTarjeta}><Etiqueta valor={historico ? oferta.estado : oferta.modalidad} /><span>{oferta.ubicacion}</span></div>
      <h2>{oferta.titulo}</h2><p className={estilos.empresa}>{oferta.empresaNombre} · {oferta.tipo}</p><p>{oferta.descripcion}</p>
      {oferta.requisitos.length > 0 && <ul className={estilos.requisitos}>{oferta.requisitos.map((requisito) => <li key={requisito}>{requisito}</li>)}</ul>}
      <div className={estilos.acciones}>{historico ? <>{oferta.fechaCierre && <span>Cerró: {oferta.fechaCierre}</span>}{oferta.contactoPublico ? <a href={'mailto:' + oferta.contactoEmail}>Contactar a la organización</a> : <span>Contacto histórico no publicado</span>}</> : oferta.urlPostulacion ? <a href={oferta.urlPostulacion} target="_blank" rel="noreferrer noopener">Consultar postulación ↗<span className="solo-lectores"> (se abre en una pestaña nueva)</span></a> : <span>Canal de postulación por confirmar</span>}</div>
    </article>)}</div> : <EstadoVacio titulo="No hay coincidencias" descripcion="Prueba con otra modalidad o término de búsqueda." />}
  </>
}
