import { NextResponse } from 'next/server'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { supabaseServidorListo } from '@/lib/supabase/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!supabaseServidorListo()) {
    return NextResponse.json({ estado: 'degradado', baseDeDatos: false }, { status: 503 })
  }
  const { error } = await crearClienteAdmin().from('configuracion').select('clave', { head: true, count: 'exact' }).limit(1)
  return NextResponse.json(
    { estado: error ? 'degradado' : 'operativo', baseDeDatos: !error, instante: new Date().toISOString() },
    { status: error ? 503 : 200, headers: { 'Cache-Control': 'no-store' } },
  )
}
