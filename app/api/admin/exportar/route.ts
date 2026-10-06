import { requerirEditor } from '@/lib/admin/datos'
import { crearClienteAdmin } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requerirEditor()
  } catch {
    return Response.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const supabase = crearClienteAdmin()
  const [contenido, configuracion, grupos, practicas] = await Promise.all([
    supabase.from('contenido').select('*').order('coleccion').order('slug'),
    supabase.from('configuracion').select('*').order('clave'),
    supabase.from('grupos_trabajo').select('*').order('slug'),
    supabase.from('practicas_ofertas').select('*').order('creado_en'),
  ])
  const error = contenido.error ?? configuracion.error ?? grupos.error ?? practicas.error
  if (error) return Response.json({ error: 'No se pudo preparar la exportación.' }, { status: 500 })

  const fecha = new Date().toISOString()
  return new Response(JSON.stringify({ version: 1, generado_en: fecha, contenido: contenido.data, configuracion: configuracion.data, grupos: grupos.data, practicas: practicas.data }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="isia-respaldo-${fecha.slice(0, 10)}.json"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
