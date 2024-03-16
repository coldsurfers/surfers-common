import Header from '@/ui/Header'
import './globals.css'
import { Metadata } from 'next'
import StyledComponentsRegistry from './StyledComponentsRegistry'

export const metadata: Metadata = {
  title: 'Giggle Official Website',
  description: 'Giggle is another gig platform based on artists and venues!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Header />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
