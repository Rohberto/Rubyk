import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import CustomCursor from '@/components/CustomCursor'
import PreloaderWrapper from '@/components/PreloaderWrapper'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rubyk — Stories that move investors, customers and partners',
  description:
    'Rubyk turns ideas into narratives that cut through the noise — pitch decks, brand identity, and content strategy built for founders ready to be heard.',
  openGraph: {
    title: 'Rubyk',
    description: 'Stories that move investors, customers and partners.',
    url: 'https://rubyk.co',
    siteName: 'Rubyk',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Rubyk', description: 'Stories that move investors, customers and partners.' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>
        <LenisProvider>
          <CustomCursor />
          <PreloaderWrapper>
            {children}
          </PreloaderWrapper>
        </LenisProvider>
      </body>
    </html>
  )
}
