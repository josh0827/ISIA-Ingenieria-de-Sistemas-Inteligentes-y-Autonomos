'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Cerrar } from '@/componentes/Iconos'
import type { FotoGaleria } from '@/lib/contenido'
import estilos from './galeria.module.css'

export default function GaleriaFotos({ fotos }: { fotos: FotoGaleria[] }) {
  const [seleccionada, setSeleccionada] = useState<FotoGaleria | null>(null)
  const dialogo = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (seleccionada && !dialogo.current?.open) dialogo.current?.showModal()
  }, [seleccionada])

  return (
    <>
      <div className={estilos.rejilla}>
        {fotos.map((foto) => (
          <figure className={estilos.foto} key={foto.slug}>
            <button
              type="button"
              className={estilos.ampliar}
              onClick={() => setSeleccionada(foto)}
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
      <dialog className={estilos.dialogo} ref={dialogo} onClose={() => setSeleccionada(null)} aria-labelledby="galeria-titulo" aria-describedby="galeria-pie">
        {seleccionada && (
          <>
            <div className={estilos.cabecera}>
              <h2 id="galeria-titulo">{seleccionada.titulo}</h2>
              <button type="button" className={estilos.cerrar} onClick={() => dialogo.current?.close()} aria-label="Cerrar fotografía ampliada">
                <Cerrar size={24} />
              </button>
            </div>
            <figure className={estilos.ampliacion}>
              <div className={estilos.marcoAmpliado}>
                <Image src={seleccionada.imagen} alt={seleccionada.alt} fill sizes="(max-width: 1100px) 92vw, 1024px" className={estilos.imagenAmpliada} />
              </div>
              <figcaption id="galeria-pie">{seleccionada.pie}</figcaption>
            </figure>
            <p className={estilos.ayuda}>Puedes cerrar la imagen con la tecla Escape.</p>
          </>
        )}
      </dialog>
    </>
  )
}
