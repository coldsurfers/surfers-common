import Header from '@/ui/Header'
import './globals.css'

export const metadata = {
  title: 'Giggle Official Website',
  description: 'For gigglers!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
