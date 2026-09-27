import 'server-only'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  clavePublicaSupabase,
  claveServicioSupabase,
  supabaseClienteListo,
  supabaseServidorListo,
  urlSupabase,
} from './config'

export async function crearClienteServidor(): Promise<SupabaseClient> {
  if (!supabaseClienteListo()) {
    throw new Error('Supabase Auth no está configurado en este entorno.')
  }
  const almacen = await cookies()
  return createServerClient(urlSupabase()!, clavePublicaSupabase()!, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (cookiesNuevas) => {
        try {
          cookiesNuevas.forEach(({ name, value, options }) =>
            almacen.set(name, value, options),
          )
        } catch {
          // Los Server Components no pueden escribir cookies. middleware.ts
          // se encarga de refrescarlas antes de renderizar rutas protegidas.
        }
      },
    },
  })
}

let clienteAdmin: SupabaseClient | undefined

export function crearClienteAdmin(): SupabaseClient {
  if (!supabaseServidorListo()) {
    throw new Error('Supabase no está configurado: faltan variables privadas del servidor.')
  }
  clienteAdmin ??= createClient(urlSupabase()!, claveServicioSupabase()!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
  return clienteAdmin
}
