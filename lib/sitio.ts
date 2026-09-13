// Fuente única de verdad del sitio.
// Todo lo que sea un dato del grupo (nombre, correo, enlaces, cifras de la
// portada) se edita AQUÍ y no en cada página. Si el correo cambia, se cambia
// una vez y queda corregido en la navegación, el pie, las metaetiquetas y el
// JSON-LD a la vez.

export const SITIO = {
  sigla: 'ISIA',
  nombre: 'Ingeniería de Sistemas Inteligentes y Autónomos',
  // El mismo nombre partido en dos, para el titular de la portada. Se pinta
  // la primera parte en gris y la segunda en negro, que es lo que le da
  // jerarquía a un titular largo en vez de dejarlo como un bloque plano.
  nombreLineas: ['Ingeniería de Sistemas', 'Inteligentes y Autónomos'],
  nombreCorto: 'Grupo ISIA',
  descripcion:
    'Grupo de investigación dedicado al diseño de sistemas que perciben, deciden y actúan por sí mismos, desde el sensor embebido hasta la política de control.',
  // Dominio real del despliegue. De aquí salen las etiquetas canónicas, el
  // sitemap.xml y el robots.txt, así que si algún día el grupo consigue un
  // dominio propio hay que cambiarlo AQUÍ y en ningún otro sitio.
  url: 'https://isia-ingenieria-de-sistemas-intelig.vercel.app',
  correo: 'isia@universidad.edu.co', // TODO: correo real del grupo
  universidad: 'Universidad Nacional de Colombia',
  sede: 'Sede Manizales',
  ubicacion: 'Facultad de Ingeniería y Arquitectura, Campus La Nubia',
  fundacion: 2026,
  locale: 'es_CO',
  redes: {
    github: 'https://github.com/', // TODO: organización del grupo
    linkedin: '',
    instagram: '',
  },
} as const

// Cifras de la barra de la portada. Son texto a propósito: algunas llevan "+"
// o un símbolo y así no hay que pelear con el formateo.
export const CIFRAS: { valor: string; etiqueta: string }[] = [
  { valor: '14', etiqueta: 'Integrantes activos' },
  { valor: '7', etiqueta: 'Proyectos en curso' },
  { valor: '6', etiqueta: 'Líneas de investigación' },
  { valor: String(SITIO.fundacion), etiqueta: 'Año de fundación' },
]

// Navegación principal. Añadir una sección aquí la hace aparecer en la barra
// superior, en el menú móvil y en el pie, todo de una vez.
export const NAVEGACION: { href: string; texto: string }[] = [
  { href: '/novedades', texto: 'Novedades' },
  { href: '/reuniones', texto: 'Reuniones' },
  { href: '/lineas', texto: 'Líneas' },
  { href: '/proyectos', texto: 'Proyectos' },
  { href: '/integrantes', texto: 'Integrantes' },
  { href: '/publicaciones', texto: 'Publicaciones' },
  { href: '/galeria', texto: 'Galería' },
]

// ---------------------------------------------------------------------------
// Contenido de la portada que no viene de archivos .md.
// Son textos fijos del grupo, así que viven aquí y se editan sin tocar JSX.
// TODO: sustituir estos textos de ejemplo por los objetivos y las líneas
// oficiales cuando el grupo los apruebe.
// ---------------------------------------------------------------------------

export const PRESENTACION = {
  titular: 'Sistemas que perciben, deciden y actúan',
  parrafos: [
    'ISIA reúne a estudiantes y docentes alrededor de una misma pregunta: qué hace falta para que una máquina opere por sí sola en el mundo real, con sus ruidos, sus fallos y sus imprevistos.',
    'Trabajamos de extremo a extremo. Del sensor y el firmware que lo gobierna hasta el algoritmo que toma la decisión, pasando por el enlace que transporta el dato. Nos interesa lo que se puede medir, montar y demostrar sobre una mesa de laboratorio.',
  ],
}

export const OBJETIVOS: { titulo: string; texto: string }[] = [
  {
    titulo: 'Formar investigadores',
    texto:
      'Acompañar a estudiantes de pregrado en su primer contacto real con la investigación aplicada, desde la revisión de literatura hasta la defensa de resultados.',
  },
  {
    titulo: 'Construir prototipos verificables',
    texto:
      'Llevar cada línea de trabajo a un montaje que funcione y que se pueda medir, no quedarnos en la simulación.',
  },
  {
    titulo: 'Publicar y divulgar',
    texto:
      'Documentar lo que hacemos en artículos, informes y material abierto para que otros grupos puedan partir de ahí.',
  },
  {
    titulo: 'Conectar con el entorno',
    texto:
      'Buscar problemas reales de la industria y la región que podamos abordar con las capacidades del grupo.',
  },
]

// El campo "icono" enlaza con el mapa de iconos de app/page.tsx. Si añades una
// línea nueva, usa uno de los iconos ya disponibles o añade el tuyo a
// componentes/Iconos.tsx.
export const LINEAS: { icono: string; titulo: string; texto: string }[] = [
  {
    icono: 'ojo',
    titulo: 'Percepción y visión por computador',
    texto: 'Detección, seguimiento y reconstrucción de escenas a partir de cámaras y sensores de profundidad.',
  },
  {
    icono: 'brujula',
    titulo: 'Control y navegación autónoma',
    texto: 'Estimación de estado, planeación de trayectorias y control de vehículos y plataformas móviles.',
  },
  {
    icono: 'antena',
    titulo: 'Redes y sistemas embebidos',
    texto: 'Enlaces de largo alcance, bajo consumo y tiempo real para desplegar nodos fuera del laboratorio.',
  },
  {
    icono: 'red',
    titulo: 'Aprendizaje automático aplicado',
    texto: 'Modelos entrenados con datos propios y llevados a hardware con recursos limitados.',
  },
  {
    icono: 'brazo',
    titulo: 'Robótica y sistemas ciberfísicos',
    texto: 'Integración de mecánica, electrónica y software en sistemas que interactúan con su entorno.',
  },
  {
    icono: 'onda',
    titulo: 'Instrumentación inteligente',
    texto: 'Medida, acondicionamiento y procesamiento de señal para instrumentos que interpretan lo que miden.',
  },
]
