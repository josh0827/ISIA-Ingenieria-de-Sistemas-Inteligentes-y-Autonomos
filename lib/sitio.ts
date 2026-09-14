/** Configuración editorial de la demo. No contiene contactos ni cifras de ejemplo. */
export const SITIO = {
  sigla: 'ISIA',
  nombre: 'Ingeniería de Sistemas Inteligentes y Autónomos',
  nombreLineas: ['Ingeniería de Sistemas', 'Inteligentes y Autónomos'],
  nombreCorto: 'Semillero ISIA',
  descripcion:
    'Semillero de investigación ISIA, Ingeniería de Sistemas Inteligentes y Autónomos, de la Universidad Nacional de Colombia, sede Manizales. Demo académica con contenido ilustrativo pendiente de validación.',
  universidad: 'Universidad Nacional de Colombia',
  sede: 'Sede Manizales',
  ubicacion: 'Manizales, Colombia',
  locale: 'es_CO',
  modo: 'DEMO',
  contactoPendiente: 'Canal de contacto pendiente de confirmar',
  repositorio: 'https://github.com/josh0827/ISIA-Ingenieria-de-Sistemas-Inteligentes-y-Autonomos',
} as const

export const NAVEGACION: { href: string; texto: string }[] = [
  { href: '/lineas', texto: 'Líneas' },
  { href: '/proyectos', texto: 'Proyectos' },
  { href: '/novedades', texto: 'Novedades' },
  { href: '/reuniones', texto: 'Reuniones' },
  { href: '/integrantes', texto: 'Integrantes' },
  { href: '/publicaciones', texto: 'Publicaciones' },
  { href: '/galeria', texto: 'Galería' },
]

export const PRESENTACION = {
  titular: 'Comprender, diseñar y explorar sistemas inteligentes',
  aviso: 'Presentación y objetivos propuestos para esta demo; pendientes de validación por el semillero.',
  parrafos: [
    'ISIA es el semillero de investigación en Ingeniería de Sistemas Inteligentes y Autónomos de la Universidad Nacional de Colombia, sede Manizales.',
    'Esta demo propone una mirada a los sistemas que perciben su entorno, procesan información y actúan a partir de ella. Presenta posibles temas de estudio que conectan software, electrónica, datos y control, con especial atención a la formación de estudiantes de pregrado.',
  ],
}

/** Propuestas editoriales; no son objetivos institucionales aprobados. */
export const OBJETIVOS: { titulo: string; texto: string }[] = [
  {
    titulo: 'Aprender a investigar',
    texto: 'Explorar preguntas de investigación, revisar literatura y formular métodos de estudio con criterios claros.',
  },
  {
    titulo: 'Diseñar y evaluar',
    texto: 'Relacionar conceptos de sistemas inteligentes con propuestas de prototipos y formas reproducibles de evaluación.',
  },
  {
    titulo: 'Documentar y compartir',
    texto: 'Proponer prácticas de documentación que permitan comunicar procesos, limitaciones y aprendizajes.',
  },
  {
    titulo: 'Comprender el entorno',
    texto: 'Examinar posibles preguntas de la región desde la ingeniería, considerando su contexto y alcance.',
  },
]

export const AVISO_LINEAS = 'Líneas de referencia para esta demo. Su denominación y alcance están pendientes de validación; no se presentan como líneas oficiales aprobadas.'

/** El orden y los títulos permiten relacionar las fichas Markdown con cada línea. */
export const LINEAS: { icono: string; titulo: string; texto: string }[] = [
  {
    icono: 'ojo',
    titulo: 'Percepción y visión por computador',
    texto: 'Estudio de cómo interpretar imágenes y señales de sensores para reconocer objetos, estimar movimiento y describir un entorno.',
  },
  {
    icono: 'brujula',
    titulo: 'Control y navegación autónoma',
    texto: 'Exploración de métodos para estimar el estado de un sistema, planear trayectorias y ajustar su movimiento.',
  },
  {
    icono: 'antena',
    titulo: 'Redes y sistemas embebidos',
    texto: 'Diseño de sistemas de cómputo integrados en dispositivos y de enlaces que transportan información con recursos limitados.',
  },
  {
    icono: 'red',
    titulo: 'Aprendizaje automático aplicado',
    texto: 'Análisis de modelos que aprenden de datos y de cómo evaluar sus errores, límites y posibles aplicaciones.',
  },
  {
    icono: 'brazo',
    titulo: 'Robótica y sistemas ciberfísicos',
    texto: 'Estudio de la interacción entre software, sensores, actuadores y procesos físicos en sistemas integrados.',
  },
  {
    icono: 'onda',
    titulo: 'Instrumentación inteligente',
    texto: 'Exploración de técnicas de medición y procesamiento de señales para obtener información útil y valorar su incertidumbre.',
  },
]
