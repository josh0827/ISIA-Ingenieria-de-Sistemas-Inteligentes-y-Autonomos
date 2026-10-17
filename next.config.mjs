// El optimizador de imágenes solo acepta el proyecto Supabase configurado;
// con un comodín serviría de proxy para cualquier proyecto ajeno.
function hostSupabase() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname || '*.supabase.co'
  } catch {
    return '*.supabase.co'
  }
}

// CSP en modo solo-informe: no bloquea nada, pero los navegadores registran en
// consola cualquier recurso que una política estricta rechazaría. Next.js
// inyecta scripts y estilos en línea, por eso se admite 'unsafe-inline'.
// Cuando el informe salga limpio puede pasarse a Content-Security-Policy.
function politicaCsp() {
  let origenSupabase = ''
  try {
    origenSupabase = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin
  } catch {
    origenSupabase = 'https://*.supabase.co'
  }
  const websocketSupabase = origenSupabase.replace(/^https:/, 'wss:')
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${origenSupabase}`,
    "font-src 'self' data:",
    `connect-src 'self' ${origenSupabase} ${websocketSupabase}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; ')
}

// Mismo interruptor que lib/indexacion.ts: sin él, el sitio permanece en modo DEMO (noindex).
const indexable = process.env.NEXT_PUBLIC_SITIO_INDEXABLE === 'true' && Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim())

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: hostSupabase(),
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // El Markdown de contenido/ se lee en tiempo de ejecucion. El rastreo
  // automatico de archivos no sigue rutas construidas con process.cwd(), asi
  // que sin esto contenido/ no viaja a las funciones del servidor y el sitio
  // se publica con todas las secciones vacias.
  outputFileTracingIncludes: {
    '/**': ['./contenido/**/*.md'],
  },
  // Cabeceras básicas de seguridad. El formulario público escribe mediante
  // una Server Action; las credenciales y el proveedor de correo permanecen
  // exclusivamente en el servidor.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...(indexable ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }]),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Content-Security-Policy-Report-Only', value: politicaCsp() },
        ],
      },
    ]
  },
}

export default nextConfig
