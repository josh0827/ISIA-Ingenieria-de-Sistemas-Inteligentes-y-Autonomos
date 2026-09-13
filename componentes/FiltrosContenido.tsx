'use client'

import { useMemo, useState } from 'react'
import type { Novedad, Proyecto } from '@/lib/contenido'
import { TarjetaNovedad, TarjetaProyecto } from './Tarjetas'
import estilos from './FiltrosContenido.module.css'

export function FiltrosProyectos({ proyectos }: { proyectos: Proyecto[] }) {
  const [estado, setEstado] = useState('todos')
  const [linea, setLinea] = useState('todas')
  const lineas = useMemo(
    () =>
      Array.from(new Set(proyectos.map((proyecto) => proyecto.linea).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b, 'es'),
      ),
    [proyectos],
  )
  const filtrados = proyectos.filter(
    (proyecto) =>
      (estado === 'todos' || proyecto.estado === estado) &&
      (linea === 'todas' || proyecto.linea === linea),
  )

  return (
    <div>
      <div className={estilos.controles} aria-label="Filtros de proyectos">
        <label>
          <span>Estado</span>
          <select value={estado} onChange={(event) => setEstado(event.target.value)}>
            <option value="todos">Todos los estados</option>
            <option value="propuesta">Propuesta</option>
            <option value="activo">Activo</option>
            <option value="en-curso">En curso</option>
            <option value="pausado">Pausado</option>
            <option value="completado">Completado</option>
          </select>
        </label>
        <label>
          <span>Línea</span>
          <select value={linea} onChange={(event) => setLinea(event.target.value)}>
            <option value="todas">Todas las líneas</option>
            {lineas.map((nombre) => (
              <option value={nombre} key={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </label>
        <p className={estilos.resultado} aria-live="polite">
          {filtrados.length} {filtrados.length === 1 ? 'proyecto' : 'proyectos'}
        </p>
      </div>
      {filtrados.length ? (
        <div className={estilos.rejilla}>
          {filtrados.map((proyecto) => (
            <TarjetaProyecto nivelTitulo={2} key={proyecto.slug} proyecto={proyecto} />
          ))}
        </div>
      ) : (
        <p className={estilos.sinResultados}>No hay proyectos con estos filtros.</p>
      )}
    </div>
  )
}

export function FiltrosNovedades({ novedades }: { novedades: Novedad[] }) {
  const [tipo, setTipo] = useState('todos')
  const filtradas = novedades.filter((novedad) => tipo === 'todos' || novedad.tipo === tipo)

  return (
    <div>
      <div className={estilos.controles} aria-label="Filtros de novedades">
        <label>
          <span>Tipo</span>
          <select value={tipo} onChange={(event) => setTipo(event.target.value)}>
            <option value="todos">Todos los tipos</option>
            <option value="divulgacion">Divulgación</option>
            <option value="evento">Evento</option>
            <option value="convocatoria">Convocatoria</option>
            <option value="logro">Logro</option>
            <option value="publicacion">Publicación</option>
          </select>
        </label>
        <p className={estilos.resultado} aria-live="polite">
          {filtradas.length} {filtradas.length === 1 ? 'novedad' : 'novedades'}
        </p>
      </div>
      {filtradas.length ? (
        <div className={estilos.lista}>
          {filtradas.map((novedad) => (
            <TarjetaNovedad nivelTitulo={2} key={novedad.slug} novedad={novedad} />
          ))}
        </div>
      ) : (
        <p className={estilos.sinResultados}>No hay novedades con este filtro.</p>
      )}
    </div>
  )
}
