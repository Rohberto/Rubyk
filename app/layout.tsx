import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import CustomCursor from '@/components/CustomCursor'
import PreloaderWrapper from '@/components/PreloaderWrapper'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-cormorant',
  display:  'swap',
})

const outfit = Outfit({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display:  'swap',
})

/* ── Viewport ──────────────────────────────────────────────── */
export const viewport: Viewport = {
  width:              'device-width',
  initialScale:       1,
  maximumScale:       5,
  themeColor:         '#0F0A04',
  colorScheme:        'light',
}

/* ── Metadata ──────────────────────────────────────────────── */
export const metadata: Metadata = {
  /* Core */
  metadataBase: new URL('https://rubyk.co'),
  title: {
    default:  'Rubyk — Stories that move investors, customers and partners',
    template: '%s — Rubyk',
  },
  description:
    'Rubyk turns ideas into narratives that cut through the noise — pitch decks, brand identity, and content strategy built for African founders ready to be heard.',
  keywords: [
    'brand storytelling', 'pitch deck', 'investor narrative', 'African founders',
    'startup branding', 'content strategy', 'fundraising storytelling',
    'brand identity Africa', 'Rubyk', 'founder story',
  ],
  authors:  [{ name: 'Rubyk', url: 'https://rubyk.co' }],
  creator:  'Rubyk',
  publisher:'Rubyk',

  /* Canonical */
  alternates: { canonical: 'https://rubyk.co' },

  /* Robots */
  robots: {
    index:            true,
    follow:           true,
    googleBot: {
      index:              true,
      follow:             true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  /* Open Graph */
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://rubyk.co',
    siteName:    'Rubyk',
    title:       'Rubyk — Stories that move investors, customers and partners',
    description: 'Pitch decks, brand identity, and content strategy built for African founders ready to be heard.',
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'Rubyk — Stories that move investors, customers and partners',
      },
    ],
  },

  /* Twitter / X */
  twitter: {
    card:        'summary_large_image',
    site:        '@rubykcreatives',
    creator:     '@rubykcreatives',
    title:       'Rubyk — Stories that move investors, customers and partners',
    description: 'Pitch decks, brand identity, and content strategy built for African founders.',
    images:      ['/og-image.png'],
  },

  /* Favicon / icons */
  icons: {
    icon: [
      { url: '/favicon.ico',          sizes: 'any' },
      { url: '/icon-16.png',  type: 'image/png', sizes: '16x16'   },
      { url: '/icon-32.png',  type: 'image/png', sizes: '32x32'   },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple:    [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  /* Web app manifest */
  manifest: '/site.webmanifest',

  /* Verification (add your codes when you have them) */
  verification: {
    google: 'add-your-google-search-console-code-here',
  },

  /* App links */
  appLinks: {},

  /* Category */
  category: 'business',
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