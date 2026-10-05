/**
 * Recursos de identidad visual de ISIA.
 *
 * Las rutas y proporciones visibles están centralizadas aquí para que una
 * futura sustitución no requiera editar la navegación ni el pie de página.
 */
export const MARCA_ISIA = {
  simbolo: {
    src: '/imagenes/logos/isia-simbolo.jpg',
    anchoFuente: 2390,
    altoFuente: 1095,
    proporcionVisible: 2244 / 585,
    alt: 'ISIA, Ingeniería de Sistemas Inteligentes y Autónomos',
  },
  completa: {
    src: '/imagenes/logos/isia-con-texto.jpg',
    anchoFuente: 2390,
    altoFuente: 1792,
    proporcionVisible: 2244 / 1007,
    alt: 'ISIA, Semillero de Ingeniería de Sistemas Inteligentes y Autónomos, UNAL Manizales',
  },
} as const

export type VarianteMarcaIsia = keyof typeof MARCA_ISIA
