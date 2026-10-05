'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Cerrar, Flecha } from '@/componentes/Iconos'
import type { FotoGaleria } from '@/lib/contenido'
import estilos from './galeria.module.css'

export default function GaleriaFotos({ fotos }: { fotos: FotoGaleria[] }) {
  const [seleccionada, setSeleccionada] = useState<FotoGaleria | null>(null)
  const [direccion, setDireccion] = useState<1 | -1>(1)
  const [cerrando, setCerrando] = useState(false)
  const dialogo = useRef<HTMLDialogElement>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const indice = seleccionada ? fotos.findIndex((foto) => foto.slug === seleccionada.slug) : -1

  useEffect(() => {
    if (seleccionada && !dialogo.current?.open) dialogo.current?.showModal()
  }, [seleccionada])

  const cambiar = useCallback((avance: 1 | -1) => {
    if (!seleccionada || fotos.length < 2) return
    const actual = fotos.findIndex((foto) => foto.slug === seleccionada.slug)
    const siguiente = (actual + avance + fotos.length) % fotos.length
    setDireccion(avance)
    setSeleccionada(fotos[siguiente])
  }, [fotos, seleccionada])

  useEffect(() => {
    function teclado(evento: KeyboardEvent) {
      if (!dialogo.current?.open) return
      if (evento.key === 'ArrowRight') cambiar(1)
      if (evento.key === 'ArrowLeft') cambiar(-1)
    }
    window.addEventListener('keydown', teclado)
    return () => window.removeEventListener('keydown', teclado)
  }, [cambiar])

  useEffect(() => () => clearTimeout(temporizador.current), [])

  function cerrar() {
    if (!dialogo.current?.open || cerrando) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialogo.current.close()
      return
    }
    setCerrando(true)
    temporizador.current = setTimeout(() => dialogo.current?.close(), 180)
  }

  return (
    <>
      <div className={estilos.rejilla}>
        {fotos.map((foto) => (
          <figure className={estilos.foto} key={foto.slug}>
            <button
              type="button"
              className={estilos.ampliar}
              onClick={() => { setDireccion(1); setSeleccionada(foto) }}
              aria-label={`Ampliar fotografía: ${foto.titulo}`}
              aria-haspopup="dialog"
            >
              <span className={estilos.marco}>
                <Image src={foto.imagen} alt={foto.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 360px" className={estilos.miniatura} />
              </span>
              <span className={estilos.accion}>Ampliar fotografía <span aria-hidden="true">↗</span></span>
            </button>
            <figcaption>
              <strong>{foto.titulo}</strong>
              <p>{foto.pie}</p>
              {foto.anio && <span className={estilos.anio}>{foto.anio}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        className={`${estilos.dialogo} ${cerrando ? estilos.cerrando : ''}`}
        ref={dialogo}
        onCancel={(evento) => { evento.preventDefault(); cerrar() }}
        onClose={() => { setSeleccionada(null); setCerrando(false) }}
        onClick={(evento) => { if (evento.target === dialogo.current) cerrar() }}
        aria-labelledby="galeria-titulo"
        aria-describedby="galeria-pie"
      >
        {seleccionada && (
          <>
            <div className={estilos.cabecera}>
              <h2 id="galeria-titulo">{seleccionada.titulo}</h2>
              <button type="button" className={estilos.cerrar} onClick={cerrar} aria-label="Cerrar fotografía ampliada">
                <Cerrar size={24} />
              </button>
            </div>
            <figure className={estilos.ampliacion}>
              <div
                key={seleccionada.slug}
                className={`${estilos.marcoAmpliado} ${direccion === 1 ? estilos.entradaSiguiente : estilos.entradaAnterior}`}
              >
                <Image src={seleccionada.imagen} alt={seleccionada.alt} fill sizes="(max-width: 1100px) 92vw, 1024px" className={estilos.imagenAmpliada} />
              </div>
              <figcaption id="galeria-pie">{seleccionada.pie}</figcaption>
            </figure>
            {fotos.length > 1 && (
              <div className={estilos.controles} aria-label="Navegación de fotografías">
                <button type="button" onClick={() => cambiar(-1)} aria-label="Fotografía anterior">
                  <Flecha size={18} className={estilos.anterior} />
                </button>
                <span aria-live="polite">{indice + 1} / {fotos.length}</span>
                <button type="button" onClick={() => cambiar(1)} aria-label="Fotografía siguiente">
                  <Flecha size={18} />
                </button>
              </div>
            )}
            <p className={estilos.ayuda}>Usa las flechas del teclado para recorrer la galería y Escape para cerrar.</p>
          </>
        )}
      </dialog>
    </>
  )
}
