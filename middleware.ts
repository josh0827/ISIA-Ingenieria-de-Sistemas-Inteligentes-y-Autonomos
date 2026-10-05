import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  clavePublicaSupabase,
  supabaseClienteListo,
  urlSupabase,
} from '@/lib/supabase/config'

export async function middleware(request: NextRequest) {
  if (!supabaseClienteListo()) return NextResponse.next({ request })

  let respuesta = NextResponse.next({ request })
  const supabase = createServerClient(urlSupabase()!, clavePublicaSupabase()!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesNuevas) => {
        cookiesNuevas.forEach(({ name, value }) => request.cookies.set(name, value))
        respuesta = NextResponse.next({ request })
        cookiesNuevas.forEach(({ name, value, options }) =>
          respuesta.cookies.set(name, value, options),
        )
      },
    },
  })

  // Verifica la firma del JWT y refresca las cookies cuando sea necesario.
  // Con claves asimetricas, getClaims reutiliza el JWKS y evita una solicitud
  // a Supabase Auth en cada cambio de pagina del panel.
  await supabase.auth.getClaims()
  return respuesta
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*', '/api/sesion/:path*'],
}
