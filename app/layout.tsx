import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/componentes/Nav'
import Pie from '@/componentes/Pie'
import ProgresoNavegacion from '@/componentes/ProgresoNavegacion'
import { SITIO } from '@/lib/sitio'
import { navegacionVisible } from '@/lib/configuracion'
import { urlSitio } from '@/lib/supabase/config'
import { sitioIndexable } from '@/lib/indexacion'
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
    default: 'ISIA · Semillero de investigación',
    template: '%s · ISIA',
  },
  description: SITIO.descripcion,
  applicationName: SITIO.nombreCorto,
  openGraph: {
    type: 'website',
    siteName: SITIO.nombreCorto,
    locale: SITIO.locale,
    title: 'ISIA · Semillero de investigación',
    description: SITIO.descripcion,
    images: [{ url: '/imagenes/logos/isia-con-texto-recortado.webp', width: 1000, height: 451, alt: SITIO.nombre }],
  },
  twitter: { card: 'summary', title: 'ISIA · Semillero de investigación', description: SITIO.descripcion },
  robots: sitioIndexable()
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false, noimageindex: true },
      },
}

export const viewport = {
  themeColor: '#456A3E',
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
        {sitioIndexable() && sitioBase && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'EducationalOrganization',
                name: SITIO.nombre,
                alternateName: SITIO.sigla,
                url: sitioBase,
                email: SITIO.correo,
                parentOrganization: { '@type': 'CollegeOrUniversity', name: SITIO.universidad },
                address: { '@type': 'PostalAddress', addressLocality: 'Manizales', addressCountry: 'CO' },
              }).replace(/</g, '\\u003c'),
            }}
          />
        )}
        <ProgresoNavegacion />
        <a href="#contenido" className="saltar">
          Saltar al contenido
        </a>
        <Nav items={navegacion} />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <Pie items={navegacion} />
      </body>
    </html>
  )
}
