// Envoltura de TODAS las páginas: fuentes, metadatos, navegación y pie.
//
// Si montas una sección nueva no necesitas tocar este archivo. Solo créala en
// app/tu-seccion/page.tsx y ya hereda la barra, el pie y los estilos.

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/componentes/Nav'
import Pie from '@/componentes/Pie'
import { SITIO } from '@/lib/sitio'
import './globals.css'

// Una sola familia para todo el sitio, en varios pesos.
//
// Es lo que hace que un diseno se sienta ordenado sin esfuerzo: los titulares
// se distinguen del texto por tamano y peso, no por cambiar de tipografia.
// Geist se eligio por ser un grotesco neutro y muy legible. Inter se descarto
// a proposito: esta en todas partes y delata al sitio generado.
//
// La monoespaciada queda para lo que de verdad son datos, y se usa poco.
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
  themeColor: '#ffffff',
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
    <html lang="es-CO" className={`${texto.variable} ${mono.variable}`}>
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
