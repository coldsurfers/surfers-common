import '@coldsurfers/hotsurf/global.css'
import type { Metadata } from 'next'
import StyledComponentsRegistry from '../registry/StyledComponentsRegistry'
import StyleSheetRegistry from '../registry/StyleSheetRegistry'
import RegistryProvider from '../registry/RegistryProvider'

export const metadata: Metadata = {
  title: 'ColdSurf Accounts',
  description: 'https://accounts.coldsurf.io',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <RegistryProvider
          registries={[StyledComponentsRegistry, StyleSheetRegistry]}
        >
          {children}
        </RegistryProvider>
      </body>
    </html>
  )
}
