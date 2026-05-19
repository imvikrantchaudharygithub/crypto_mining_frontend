import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import WhatsAppFab from '@/components/WhatsAppFab'
import CallFab from '@/components/CallFab'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Crypto Mining Miles — Redefined Mining',
  description:
    'Industrial-grade hashrate, hosted hardware, and transparent payouts — built for retail miners and institutional desks since 2017.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}>
      <body>
        {children}
        <CallFab />
        <WhatsAppFab />
      </body>
    </html>
  )
}
