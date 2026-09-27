'use client'

import { useActionState } from 'react'
import { guardarGrupo, type EstadoGrupo } from '@/lib/admin/grupos-acciones'
import type { GrupoTrabajo } from '@/lib/grupos'
import estilos from './FormularioContenido.module.css'

const ESTADO_INICIAL: EstadoGrupo = { ok: false }

function serializarEnlaces(enlaces: GrupoTrabajo['repositorios']): string {
  return enlaces.map((enlace) => `${enlace.nombre} | ${enlace.url}`).join('\n')
}

export default function FormularioGrupo({ grupo }: { grupo?: GrupoTrabajo }) {
  const accionGrupo = guardarGrupo.bind(null, grupo?.slug ?? null)
  const [estado, accion, enviando] = useActionState(accionGrupo, ESTADO_INICIAL)

  return (
    <form action={accion} className={estilos.formulario}>
      <div className={estilos.campo}>
        <label htmlFor="slug">Identificador (slug) *</label>
        <input type="text" id="slug" name="slug" defaultValue={grupo?.slug ?? ''} readOnly={Boolean(grupo)} required pattern="[a-z0-9]+(-[a-z0-9]+)*" />
        <p className={estilos.ayuda}>Minúsculas, números y guiones. No se modifica después de crear el grupo.</p>
      </div>
      <div className={estilos.campo}>
        <label htmlFor="nombre">Nombre *</label>
        <input type="text" id="nombre" name="nombre" defaultValue={grupo?.nombre ?? ''} required />
      </div>
      <div className={estilos.campo}>
        <label htmlFor="descripcion">Descripción *</label>
        <textarea id="descripcion" name="descripcion" rows={6} defaultValue={grupo?.descripcion ?? ''} required />
      </div>
      <div className={estilos.campo}>
        <label htmlFor="integrantes">Integrantes</label>
        <textarea id="integrantes" name="integrantes" rows={6} defaultValue={grupo?.integrantes.join('\n') ?? ''} />
        <p className={estilos.ayuda}>Un nombre confirmado por línea.</p>
      </div>
      <div className={estilos.campo}>
        <label htmlFor="repositorios">Repositorios</label>
        <textarea id="repositorios" name="repositorios" rows={5} defaultValue={grupo ? serializarEnlaces(grupo.repositorios) : ''} placeholder="Nombre | https://github.com/organizacion/repositorio" />
        <p className={estilos.ayuda}>Un recurso por línea: nombre, barra vertical y URL HTTPS.</p>
      </div>
      <div className={estilos.campo}>
        <label htmlFor="documentos">Documentos</label>
        <textarea id="documentos" name="documentos" rows={5} defaultValue={grupo ? serializarEnlaces(grupo.documentos) : ''} placeholder="Informe | https://dominio.edu.co/documento.pdf" />
      </div>
      <div className={estilos.campo}>
        <label htmlFor="imagenPortada">Imagen de portada</label>
        <input id="imagenPortada" name="imagenPortada" type="file" accept="image/jpeg,image/png,image/webp,image/avif" />
        <input name="imagenPortadaActual" type="hidden" value={grupo?.imagenPortada ?? ''} />
        {grupo?.imagenPortada && <p className={estilos.archivoActual}>Hay una portada guardada. Selecciona otra para reemplazarla.</p>}
      </div>
      <div className={estilos.campo}>
        <label htmlFor="galeriaExistente">Galería actual</label>
        <textarea id="galeriaExistente" name="galeriaExistente" rows={5} defaultValue={grupo?.galeriaImagenes.join('\n') ?? ''} />
        <p className={estilos.ayuda}>Una URL por línea. Elimina una línea para retirar la imagen del grupo.</p>
      </div>
      <div className={estilos.campo}>
        <label htmlFor="galeriaNueva">Añadir imágenes a la galería</label>
        <input id="galeriaNueva" name="galeriaNueva" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" />
      </div>
      {estado.error && <p role="alert" className={estilos.error}>{estado.error}</p>}
      <div className={estilos.acciones}>
        <button type="submit" disabled={enviando} className={estilos.enviar}>
          {enviando ? 'Guardando…' : grupo ? 'Guardar cambios' : 'Crear grupo'}
        </button>
      </div>
    </form>
  )
}
