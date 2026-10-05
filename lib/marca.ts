/**
 * Recursos de identidad visual de ISIA.
 *
 * Las rutas y proporciones visibles están centralizadas aquí para que una
 * futura sustitución no requiera editar la navegación ni el pie de página.
 */
export const MARCA_ISIA = {
  simbolo: {
    src: '/imagenes/logos/isia-simbolo.png',
    anchoFuente: 2390,
    altoFuente: 1095,
    recorte: { x: 71, y: 265, ancho: 2248, alto: 587 },
    alt: 'ISIA, Ingeniería de Sistemas Inteligentes y Autónomos',
  },
  completa: {
    src: '/imagenes/logos/isia-con-texto.png',
    anchoFuente: 1448,
    altoFuente: 1086,
    recorte: { x: 8, y: 284, ancho: 1432, alto: 646 },
    alt: 'ISIA, Semillero de Ingeniería de Sistemas Inteligentes y Autónomos, UNAL Manizales',
  },
} as const

export type VarianteMarcaIsia = keyof typeof MARCA_ISIA
