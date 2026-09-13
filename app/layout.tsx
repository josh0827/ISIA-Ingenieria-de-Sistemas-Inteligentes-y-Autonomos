import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/componentes/Nav'
import Pie from '@/componentes/Pie'
import { SITIO } from '@/lib/sitio'
import './globals.css'

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

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CO" className={`${texto.variable} ${mono.variable}`}>
      <body>
        <a href="#contenido" className="saltar">
          Saltar al contenido
        </a>
        <div className="demo-bar">
          <div className="contenedor">
            <span>DEMO ACADÉMICA</span>
            <p>Contenido ilustrativo · Pendiente de validación</p>
          </div>
        </div>
        <Nav />
        <main id="contenido" tabIndex={-1}>
          {children}
        </main>
        <Pie />
      </body>
    </html>
  )
}
