/**
 * Recursos de identidad visual de ISIA.
 *
 * Las rutas y proporciones visibles están centralizadas aquí para que una
 * futura sustitución no requiera editar la navegación ni el pie de página.
 */
export const MARCA_ISIA = {
  simbolo: {
    src: '/imagenes/logos/isia-simbolo-recortado.webp',
    anchoFuente: 1200,
    altoFuente: 313,
    recorte: { x: 0, y: 0, ancho: 1200, alto: 313 },
    alt: 'ISIA, Ingeniería de Sistemas Inteligentes y Autónomos',
  },
  completa: {
    src: '/imagenes/logos/isia-con-texto-recortado.webp',
    anchoFuente: 1000,
    altoFuente: 451,
    recorte: { x: 0, y: 0, ancho: 1000, alto: 451 },
    alt: 'ISIA, Semillero de Ingeniería de Sistemas Inteligentes y Autónomos, UNAL Manizales',
  },
} as const

export type VarianteMarcaIsia = keyof typeof MARCA_ISIA
