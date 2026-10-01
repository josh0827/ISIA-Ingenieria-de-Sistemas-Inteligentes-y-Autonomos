import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/componentes/Nav'
import Pie from '@/componentes/Pie'
import { SITIO } from '@/lib/sitio'
import { navegacionVisible } from '@/lib/configuracion'
import { urlSitio } from '@/lib/supabase/config'
import './globals.css'

export const revalidate = 300

const texto = Geist({
  subsets: ['latin'],
  variable: '--fuente-texto',
  display: 'swap',
})
const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--fuente-mono',
  display: 'swap',
})

const sitioBase = urlSitio()

export const metadata: Metadata = {
  metadataBase: sitioBase ? new URL(sitioBase) : undefined,
  title: {
    default: 'ISIA · Semillero de investigación · DEMO',
    template: '%s · ISIA DEMO',
  },
  description:
    'Demo académica del semillero ISIA, Universidad Nacional de Colombia, sede Manizales. Contenido ilustrativo pendiente de validación.',
  applicationName: SITIO.nombreCorto,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export const viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navegacion = await navegacionVisible()

  return (
    <html lang="es-CO" className={`${texto.variable} ${mono.variable}`}>
      <body>
        <a href="#contenido" className="saltar">
          Saltar al contenido
        </a>
        <aside className="demo-bar" aria-label="Estado de la demo">
          <div className="contenedor">
            <span>DEMO ACADÉMICA</span>
            <p>Contenido ilustrativo · Pendiente de validación</p>
          </div>
        </aside>
        <Nav items={navegacion} />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <Pie items={navegacion} />
      </body>
    </html>
  )
}
