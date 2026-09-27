import { cerrarSesion } from '@/lib/sesion'

export const dynamic = 'force-dynamic'

export async function POST() {
  await cerrarSesion()
  return new Response(null, {
    status: 303,
    headers: { Location: '/admin/iniciar-sesion' },
  })
}
