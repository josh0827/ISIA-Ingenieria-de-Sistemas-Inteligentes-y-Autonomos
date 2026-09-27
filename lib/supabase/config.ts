export function variableEntorno(nombre: string): string | undefined {
  const valor = process.env[nombre]?.trim()
  return valor || undefined
}

export function urlSupabase(): string | undefined {
  // Next.js solo inserta variables NEXT_PUBLIC en el bundle del navegador
  // cuando el acceso usa el nombre literal, no process.env[nombre].
  const valor = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!valor) return undefined
  try {
    const url = new URL(valor)
    return ['http:', 'https:'].includes(url.protocol) ? url.origin : undefined
  } catch {
    return undefined
  }
}

export function clavePublicaSupabase(): string | undefined {
  const publicable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  const anonima = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  return publicable || anonima || undefined
}

export function claveServicioSupabase(): string | undefined {
  return variableEntorno('SUPABASE_SERVICE_ROLE_KEY')
}

export function supabaseClienteListo(): boolean {
  return Boolean(urlSupabase() && clavePublicaSupabase())
}

export function supabaseServidorListo(): boolean {
  return supabaseClienteListo() && Boolean(claveServicioSupabase())
}
