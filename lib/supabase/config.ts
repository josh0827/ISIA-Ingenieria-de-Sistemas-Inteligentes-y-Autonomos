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

/**
 * Las imágenes solo se aceptan desde el proyecto Supabase configurado. Sin
 * variables (desarrollo local y tests) se admite cualquier *.supabase.co.
 */
export function esHostSupabasePropio(hostname: string): boolean {
  const propia = urlSupabase()
  return propia ? hostname === new URL(propia).hostname : hostname.endsWith('.supabase.co')
}

export function urlSitio(): string | undefined {
  const valor = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!valor) return undefined
  try {
    const url = new URL(valor)
    if (!['http:', 'https:'].includes(url.protocol)) return undefined
    return url.origin
  } catch {
    return undefined
  }
}

export function clavePublicaSupabase(): string | undefined {
  // Acceso literal: Next.js solo inserta NEXT_PUBLIC_* en el navegador así.
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || undefined
}

export function claveServicioSupabase(): string | undefined {
  return variableEntorno('SUPABASE_SECRET_KEY')
}

export function supabaseClienteListo(): boolean {
  return Boolean(urlSupabase() && clavePublicaSupabase())
}

export function supabaseServidorListo(): boolean {
  return supabaseClienteListo() && Boolean(claveServicioSupabase())
}
