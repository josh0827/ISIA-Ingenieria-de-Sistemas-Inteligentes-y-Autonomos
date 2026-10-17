import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { interpretarForkGithub, firmaGithubValida } from '@/lib/github/webhook'
import { obtenerFilaContenido, guardarFilaContenido } from '@/lib/supabase/contenido'
import { crearClienteAdmin } from '@/lib/supabase/server'
import { supabaseServidorListo } from '@/lib/supabase/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function actualizarEvento(entrega: string, estado: string, detalle: Record<string, unknown>) {
  await crearClienteAdmin().from('integraciones_github_eventos').update({ estado, detalle }).eq('entrega_id', entrega)
}

export async function POST(request: Request) {
  const secreto = process.env.GITHUB_WEBHOOK_SECRET?.trim()
  const propietarioPermitido = process.env.GITHUB_ALLOWED_OWNER?.trim().toLowerCase()
  if (!secreto || !propietarioPermitido || !supabaseServidorListo()) {
    return NextResponse.json({ ok: false, error: 'integracion_no_configurada' }, { status: 503 })
  }

  const longitud = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(longitud) && longitud > 1_000_000) {
    return NextResponse.json({ ok: false, error: 'payload_demasiado_grande' }, { status: 413 })
  }
  const cuerpo = await request.text()
  if (cuerpo.length > 1_000_000) {
    return NextResponse.json({ ok: false, error: 'payload_demasiado_grande' }, { status: 413 })
  }
  if (!firmaGithubValida(cuerpo, request.headers.get('x-hub-signature-256'), secreto)) {
    return NextResponse.json({ ok: false, error: 'firma_invalida' }, { status: 401 })
  }

  const entrega = request.headers.get('x-github-delivery')?.trim()
  const evento = request.headers.get('x-github-event')?.trim()
  if (!entrega || entrega.length > 100 || !/^[a-zA-Z0-9-]+$/.test(entrega)) {
    return NextResponse.json({ ok: false, error: 'entrega_invalida' }, { status: 400 })
  }
  if (evento !== 'fork') return NextResponse.json({ ok: true, estado: 'ignorado' }, { status: 202 })

  let payload: unknown
  try {
    payload = JSON.parse(cuerpo)
  } catch {
    return NextResponse.json({ ok: false, error: 'json_invalido' }, { status: 400 })
  }
  const borrador = interpretarForkGithub(payload)
  if (!borrador) return NextResponse.json({ ok: false, error: 'evento_invalido' }, { status: 400 })

  const { error: errorRegistro } = await crearClienteAdmin().from('integraciones_github_eventos').insert({
    entrega_id: entrega,
    evento,
    propietario: borrador.propietario,
    repositorio_origen: borrador.repositorioOrigen,
    repositorio_creado: borrador.repositorio,
    estado: 'recibido',
  })
  if (errorRegistro?.code === '23505') return NextResponse.json({ ok: true, estado: 'duplicado' })
  if (errorRegistro) return NextResponse.json({ ok: false, error: 'registro_fallido' }, { status: 500 })

  try {
    if (borrador.propietario.toLowerCase() !== propietarioPermitido) {
      await actualizarEvento(entrega, 'rechazado', { motivo: 'propietario_no_permitido' })
      return NextResponse.json({ ok: true, estado: 'rechazado' }, { status: 202 })
    }

    if (await obtenerFilaContenido('proyectos', borrador.slug)) {
      await actualizarEvento(entrega, 'ignorado', { motivo: 'proyecto_existente', slug: borrador.slug })
      return NextResponse.json({ ok: true, estado: 'existente', slug: borrador.slug })
    }

    await guardarFilaContenido('proyectos', borrador.slug, {
      titulo: borrador.titulo,
      estado: 'En formulación',
      linea: '',
      resumen: borrador.resumen,
      repositorio: borrador.repositorio,
      origen: 'GitHub',
      integrantes: [],
      confirmado: false,
      estadoEditorial: 'Borrador',
    }, [
      '## Origen',
      `Borrador creado a partir de un fork de \`${borrador.repositorioOrigen}\`.`,
      '',
      'Debe revisarse, completarse y confirmarse editorialmente antes de publicarlo.',
    ].join('\n'))
    await actualizarEvento(entrega, 'borrador_creado', { slug: borrador.slug })
    revalidatePath('/admin/proyectos')
    revalidatePath('/admin/integraciones')
    return NextResponse.json({ ok: true, estado: 'borrador_creado', slug: borrador.slug }, { status: 201 })
  } catch (error) {
    // Se libera la entrega para que el reintento de GitHub pueda procesarla
    // en vez de responder "duplicado" sobre un borrador que nunca se creó.
    console.error('[github-webhook] Falló el procesamiento.', error instanceof Error ? error.message : error)
    await crearClienteAdmin().from('integraciones_github_eventos').delete().eq('entrega_id', entrega)
    return NextResponse.json({ ok: false, error: 'procesamiento_fallido' }, { status: 500 })
  }
}
