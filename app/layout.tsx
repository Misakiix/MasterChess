import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MasterChessBeta',
  description: 'Jogue e Pratique Xadrez gratuitamente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className} id="_masterchess">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
