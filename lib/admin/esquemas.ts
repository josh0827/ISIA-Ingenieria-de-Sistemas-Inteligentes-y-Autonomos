/**
 * Define, para cada colección de Firestore, los campos que el panel de
 * administración debe mostrar en sus formularios y tablas. Un solo
 * formulario y una sola tabla genéricos (ver componentes/admin) se adaptan a
 * estos esquemas en lugar de duplicar una pantalla por tipo de contenido.
 */
import type { NombreColeccion } from '@/lib/contenido'

export type TipoCampo =
  | 'texto'
  | 'textarea'
  | 'markdown'
  | 'fecha'
  | 'hora'
  | 'numero'
  | 'booleano'
  | 'select'
  | 'lista'
  | 'url'
  | 'imagen'
  | 'correo'

export type CampoEsquema = {
  /** Puede incluir un punto para campos anidados, p. ej. "enlaces.github". */
  clave: string
  etiqueta: string
  tipo: TipoCampo
  opciones?: readonly string[]
  ayuda?: string
  requerido?: boolean
}

export type EsquemaColeccion = {
  coleccion: NombreColeccion
  etiqueta: string
  etiquetaSingular: string
  descripcion: string
  /** Columnas mostradas en la tabla de listado, además del slug. */
  columnas: { clave: string; etiqueta: string }[]
  campos: CampoEsquema[]
}

export const ESQUEMAS: Record<NombreColeccion, EsquemaColeccion> = {
  proyectos: {
    coleccion: 'proyectos',
    etiqueta: 'Proyectos',
    etiquetaSingular: 'proyecto',
    descripcion: 'Fichas de proyectos de investigación del semillero.',
    columnas: [
      { clave: 'titulo', etiqueta: 'Título' },
      { clave: 'estado', etiqueta: 'Estado' },
      { clave: 'linea', etiqueta: 'Línea' },
    ],
    campos: [
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', requerido: true },
      {
        clave: 'estado', etiqueta: 'Estado', tipo: 'select', requerido: true,
        opciones: ['propuesta', 'activo', 'en-curso', 'completado', 'pausado'],
      },
      { clave: 'linea', etiqueta: 'Línea de investigación', tipo: 'texto', ayuda: 'Debe coincidir exactamente con el título de una línea existente.' },
      { clave: 'resumen', etiqueta: 'Resumen', tipo: 'textarea', requerido: true },
      { clave: 'portada', etiqueta: 'Imagen de portada', tipo: 'imagen', ayuda: 'Ruta dentro de /public/imagenes; el archivo debe existir ya en el repositorio.' },
      { clave: 'integrantes', etiqueta: 'Integrantes (slugs separados por comas)', tipo: 'lista', ayuda: 'Usa el slug de cada persona tal como aparece en Integrantes.' },
      { clave: 'confirmado', etiqueta: 'Contenido confirmado (no ilustrativo)', tipo: 'booleano' },
      { clave: 'cuerpo', etiqueta: 'Descripción completa (Markdown)', tipo: 'markdown' },
    ],
  },
  novedades: {
    coleccion: 'novedades',
    etiqueta: 'Novedades',
    etiquetaSingular: 'novedad',
    descripcion: 'Notas de vida académica: convocatorias, eventos, logros y divulgación.',
    columnas: [
      { clave: 'titulo', etiqueta: 'Título' },
      { clave: 'fecha', etiqueta: 'Fecha' },
      { clave: 'tipo', etiqueta: 'Tipo' },
    ],
    campos: [
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', requerido: true },
      { clave: 'fecha', etiqueta: 'Fecha', tipo: 'fecha', requerido: true },
      {
        clave: 'tipo', etiqueta: 'Tipo', tipo: 'select', requerido: true,
        opciones: ['convocatoria', 'evento', 'logro', 'publicacion', 'divulgacion'],
      },
      { clave: 'resumen', etiqueta: 'Resumen', tipo: 'textarea', requerido: true },
      { clave: 'imagen', etiqueta: 'Imagen', tipo: 'imagen', ayuda: 'Ruta dentro de /public/imagenes; el archivo debe existir ya en el repositorio.' },
      { clave: 'autor', etiqueta: 'Autor', tipo: 'texto' },
      { clave: 'confirmado', etiqueta: 'Contenido confirmado (no ilustrativo)', tipo: 'booleano' },
      { clave: 'cuerpo', etiqueta: 'Contenido completo (Markdown)', tipo: 'markdown' },
    ],
  },
  reuniones: {
    coleccion: 'reuniones',
    etiqueta: 'Reuniones',
    etiquetaSingular: 'reunión',
    descripcion: 'Agenda y archivo de encuentros del semillero.',
    columnas: [
      { clave: 'titulo', etiqueta: 'Título' },
      { clave: 'fecha', etiqueta: 'Fecha' },
      { clave: 'modalidad', etiqueta: 'Modalidad' },
    ],
    campos: [
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', requerido: true },
      { clave: 'fecha', etiqueta: 'Fecha', tipo: 'fecha', requerido: true },
      { clave: 'hora', etiqueta: 'Hora (HH:MM, 24h, hora de Colombia)', tipo: 'hora' },
      { clave: 'lugar', etiqueta: 'Lugar', tipo: 'texto' },
      {
        clave: 'modalidad', etiqueta: 'Modalidad', tipo: 'select', requerido: true,
        opciones: ['presencial', 'virtual', 'hibrida', 'pendiente'],
      },
      { clave: 'ponente', etiqueta: 'Ponente', tipo: 'texto' },
      { clave: 'enlace', etiqueta: 'Enlace de la sesión', tipo: 'url' },
      { clave: 'resumen', etiqueta: 'Resumen breve', tipo: 'textarea' },
      { clave: 'confirmado', etiqueta: 'Contenido confirmado (no ilustrativo)', tipo: 'booleano' },
      { clave: 'cuerpo', etiqueta: 'Detalles completos (Markdown)', tipo: 'markdown' },
    ],
  },
  integrantes: {
    coleccion: 'integrantes',
    etiqueta: 'Integrantes',
    etiquetaSingular: 'integrante',
    descripcion: 'Directorio de personas del semillero.',
    columnas: [
      { clave: 'nombre', etiqueta: 'Nombre' },
      { clave: 'rol', etiqueta: 'Rol' },
      { clave: 'area', etiqueta: 'Área' },
    ],
    campos: [
      { clave: 'nombre', etiqueta: 'Nombre', tipo: 'texto', requerido: true },
      {
        clave: 'rol', etiqueta: 'Rol', tipo: 'select', requerido: true,
        opciones: ['director', 'investigador', 'estudiante', 'egresado'],
      },
      { clave: 'area', etiqueta: 'Área de interés', tipo: 'texto' },
      { clave: 'foto', etiqueta: 'Foto', tipo: 'imagen', ayuda: 'Ruta dentro de /public/imagenes; el archivo debe existir ya en el repositorio.' },
      { clave: 'enlaces.github', etiqueta: 'GitHub', tipo: 'url' },
      { clave: 'enlaces.linkedin', etiqueta: 'LinkedIn', tipo: 'url' },
      { clave: 'enlaces.correo', etiqueta: 'Correo de contacto', tipo: 'correo' },
      { clave: 'confirmado', etiqueta: 'Contenido confirmado (no ilustrativo)', tipo: 'booleano' },
      { clave: 'cuerpo', etiqueta: 'Presentación (Markdown)', tipo: 'markdown' },
    ],
  },
  publicaciones: {
    coleccion: 'publicaciones',
    etiqueta: 'Publicaciones',
    etiquetaSingular: 'publicación',
    descripcion: 'Artículos, informes y otros recursos académicos. Solo se publican si están marcados como confirmados.',
    columnas: [
      { clave: 'titulo', etiqueta: 'Título' },
      { clave: 'anio', etiqueta: 'Año' },
      { clave: 'tipo', etiqueta: 'Tipo' },
    ],
    campos: [
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', requerido: true },
      { clave: 'anio', etiqueta: 'Año', tipo: 'numero', requerido: true },
      { clave: 'autores', etiqueta: 'Autores (separados por comas)', tipo: 'lista', requerido: true },
      { clave: 'tipo', etiqueta: 'Tipo de recurso', tipo: 'texto', requerido: true },
      { clave: 'enlace', etiqueta: 'Enlace', tipo: 'url' },
      { clave: 'confirmado', etiqueta: 'Confirmado', tipo: 'booleano', ayuda: 'Sin marcar, esta publicación se guarda pero no aparece en el sitio.' },
      { clave: 'cuerpo', etiqueta: 'Detalle (Markdown)', tipo: 'markdown' },
    ],
  },
  galeria: {
    coleccion: 'galeria',
    etiqueta: 'Galería',
    etiquetaSingular: 'fotografía',
    descripcion: 'Registro fotográfico. Solo se publica si está marcado como confirmado.',
    columnas: [
      { clave: 'titulo', etiqueta: 'Título' },
      { clave: 'anio', etiqueta: 'Año' },
    ],
    campos: [
      { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', requerido: true },
      { clave: 'imagen', etiqueta: 'Imagen', tipo: 'imagen', requerido: true, ayuda: 'Ruta dentro de /public/imagenes; el archivo debe existir ya en el repositorio.' },
      { clave: 'alt', etiqueta: 'Texto alternativo', tipo: 'texto', requerido: true },
      { clave: 'pie', etiqueta: 'Pie de foto', tipo: 'texto', requerido: true },
      { clave: 'anio', etiqueta: 'Año', tipo: 'numero' },
      { clave: 'confirmado', etiqueta: 'Confirmado', tipo: 'booleano', ayuda: 'Sin marcar, esta fotografía se guarda pero no aparece en el sitio.' },
    ],
  },
}

export function esquemaDe(coleccion: string): EsquemaColeccion | undefined {
  return ESQUEMAS[coleccion as NombreColeccion]
}
