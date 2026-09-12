// Envoltura de TODAS las páginas: fuentes, metadatos, navegación y pie.
//
// Si montas una sección nueva no necesitas tocar este archivo. Solo créala en
// app/tu-seccion/page.tsx y ya hereda la barra, el pie y los estilos.

import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import Nav from '@/componentes/Nav'
import Pie from '@/componentes/Pie'
import { SITIO } from '@/lib/sitio'
import './globals.css'

// Tres fuentes con papeles bien separados: display para titulares, Inter para
// leer, y la monoespaciada para fechas, cifras y etiquetas, que es lo que le
// da al sitio el aire de laboratorio.
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--fuente-display',
  display: 'swap',
})

const texto = Inter({
  subsets: ['latin'],
  variable: '--fuente-texto',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--fuente-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: `${SITIO.sigla} · ${SITIO.nombre}`,
    // Cada página pone su propio título y aquí se le añade la sigla.
    template: `%s · ${SITIO.sigla}`,
  },
  description: SITIO.descripcion,
  applicationName: SITIO.nombreCorto,
  keywords: [
    'grupo de investigación',
    'sistemas autónomos',
    'inteligencia artificial',
    'robótica',
    'sistemas embebidos',
    SITIO.universidad,
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITIO.locale,
    url: SITIO.url,
    siteName: SITIO.nombreCorto,
    title: `${SITIO.sigla} · ${SITIO.nombre}`,
    description: SITIO.descripcion,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITIO.sigla} · ${SITIO.nombre}`,
    description: SITIO.descripcion,
  },
  robots: { index: true, follow: true },
}

export const viewport = {
  themeColor: '#070a0e',
  width: 'device-width',
  initialScale: 1,
}

// Datos estructurados para que Google entienda que esto es un grupo de
// investigación de una universidad y no una empresa cualquiera.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  name: `${SITIO.sigla} · ${SITIO.nombre}`,
  alternateName: SITIO.sigla,
  description: SITIO.descripcion,
  url: SITIO.url,
  email: SITIO.correo,
  foundingDate: String(SITIO.fundacion),
  parentOrganization: {
    '@type': 'CollegeOrUniversity',
    name: SITIO.universidad,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITIO.sede,
    addressCountry: 'CO',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${display.variable} ${texto.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#contenido" className="saltar">
          Saltar al contenido
        </a>
        <Nav />
        <main id="contenido">{children}</main>
        <Pie />
      </body>
    </html>
  )
}
