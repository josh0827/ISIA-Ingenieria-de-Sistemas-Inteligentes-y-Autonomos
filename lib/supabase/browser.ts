'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  clavePublicaSupabase,
  supabaseClienteListo,
  urlSupabase,
} from './config'

let cliente: SupabaseClient | undefined

export function crearClienteNavegador(): SupabaseClient {
  if (!supabaseClienteListo()) {
    throw new Error('Supabase Auth no está configurado en este entorno.')
  }
  cliente ??= createBrowserClient(urlSupabase()!, clavePublicaSupabase()!)
  return cliente
}
