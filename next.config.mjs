// El optimizador de imágenes solo acepta el proyecto Supabase configurado;
// con un comodín serviría de proxy para cualquier proyecto ajeno.
function hostSupabase() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname || '*.supabase.co'
  } catch {
    return '*.supabase.co'
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
