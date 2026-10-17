import { NextResponse } from 'next/server'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { supabaseServidorListo } from '@/lib/supabase/config'

export const dynamic = 'force-dynamic'

const CABECERAS = { 'Cache-Control': 'no-store' }

// Solo expone si cada servicio responde y qué versión está desplegada; nunca valores de configuración.
function informacionBase() {
  return {
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local',
    entorno: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    correo: Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim()),
    instante: new Date().toISOString(),
  }
}

export async function GET() {
  if (!supabaseServidorListo()) {
    return NextResponse.json(
      { estado: 'degradado', baseDeDatos: false, ...informacionBase() },
      { status: 503, headers: CABECERAS },
    )
  }
  const { error } = await crearClienteAdmin().from('configuracion').select('clave', { head: true, count: 'exact' }).limit(1)
  if (error) console.error('[salud] La comprobación de Supabase falló.', error.message)
  return NextResponse.json(
    { estado: error ? 'degradado' : 'operativo', baseDeDatos: !error, ...informacionBase() },
    { status: error ? 503 : 200, headers: CABECERAS },
  )
}
