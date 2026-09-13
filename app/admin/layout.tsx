import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { template: '%s · Panel de administración · ISIA', default: 'Panel de administración' },
  robots: { index: false, follow: false },
}

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return children
}
