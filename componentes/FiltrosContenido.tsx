'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Novedad, Proyecto } from '@/lib/contenido'
import { TarjetaNovedad, TarjetaProyecto } from './Tarjetas'
import estilos from './FiltrosContenido.module.css'

const ESTADOS_FILTRO = ['En formulación', 'Prototipado', 'Fase inicial'] as const
const TIPOS_FILTRO = ['divulgacion', 'evento', 'convocatoria', 'logro', 'publicacion'] as const

/**
 * Estado de un filtro reflejado en la URL (?clave=valor) para poder compartir el
 * resultado. Se lee tras montar, sin useSearchParams, para que la página siga
 * siendo estática y el primer render coincida con el HTML del servidor.
 */
function useFiltroUrl(clave: string, porDefecto: string, permitidos?: readonly string[]) {
  const [valor, setValor] = useState(porDefecto)

  useEffect(() => {
    const inicial = new URLSearchParams(window.location.search).get(clave)
    if (inicial && (!permitidos || permitidos.includes(inicial))) setValor(inicial)
  }, [clave, permitidos])

  const cambiar = useCallback((nuevo: string) => {
    setValor(nuevo)
    const url = new URL(window.location.href)
    if (nuevo === porDefecto) url.searchParams.delete(clave)
    else url.searchParams.set(clave, nuevo)
    window.history.replaceState(null, '', url)
  }, [clave, porDefecto])

  return [valor, cambiar] as const
}

export function FiltrosProyectos({ proyectos }: { proyectos: Proyecto[] }) {
  const lineas = useMemo(
    () =>
      Array.from(new Set(proyectos.map((proyecto) => proyecto.linea).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b, 'es'),
      ),
    [proyectos],
  )
  const [estado, setEstado] = useFiltroUrl('estado', 'todos', ESTADOS_FILTRO)
  const [linea, setLinea] = useFiltroUrl('linea', 'todas', lineas)
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
            <option value="En formulación">En formulación</option>
            <option value="Prototipado">Prototipado</option>
            <option value="Fase inicial">Fase inicial</option>
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
        <p className={estilos.sinResultados}>
          No hay proyectos con estos filtros.{' '}
          <button type="button" className={estilos.limpiar} onClick={() => { setEstado('todos'); setLinea('todas') }}>
            Quitar filtros
          </button>
        </p>
      )}
    </div>
  )
}

export function FiltrosNovedades({ novedades }: { novedades: Novedad[] }) {
  const [tipo, setTipo] = useFiltroUrl('tipo', 'todos', TIPOS_FILTRO)
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
        <p className={estilos.sinResultados}>
          No hay novedades con este filtro.{' '}
          <button type="button" className={estilos.limpiar} onClick={() => setTipo('todos')}>
            Quitar filtro
          </button>
        </p>
      )}
    </div>
  )
}
