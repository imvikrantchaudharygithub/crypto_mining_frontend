import type { Metadata, Viewport } from 'next'
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'
const SITE_NAME = 'Crypto Mining India'
const SITE_TAGLINE = 'India\'s #1 trusted crypto mining hardware supplier'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Buy ASIC Bitcoin Miners in India`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    'Buy genuine Bitcoin & crypto mining hardware in India — Antminer S19, S21, Whatsminer & more. Pan-India shipping, 12-month warranty, on-site setup, 24/7 support. India\'s #1 trusted ASIC miner supplier since 2017.',
  keywords: [
    'crypto mining',
    'crypto mining india',
    'buy bitcoin miner india',
    'asic miner india',
    'antminer india',
    'whatsminer india',
    'bitcoin mining hardware',
    'crypto mining setup india',
    'mining rig india',
    'antminer s19',
    'antminer s21',
    'sha-256 miner',
    'crypto mining contracts',
    'mining hardware supplier india',
    'bitcoin mining india',
    'ethash miner',
    'kaspa miner',
    'scrypt miner',
    'cryptominingmiles',
    'cryptominingindia',
    // Brand variants (cmmmining.in → 301)
    'crypto mining miles',
    'cmm mining',
    'cmm crypto mining',
    'crypto mining miles india',
    // Geo + brand-variant intent (cryptominerdelhi.com, cryptominerindias.com → 301)
    'crypto miner delhi',
    'asic miner delhi',
    'bitcoin miner delhi',
    'antminer delhi',
    'buy crypto miner in delhi',
    'crypto miner india',
    'cryptominer india',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: 'business',
  formatDetection: { telephone: true, email: true, address: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Buy ASIC Bitcoin Miners in India`,
    description: SITE_TAGLINE + ' — Pan-India shipping, 12-month warranty, 24/7 support.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Redefined Mining`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Buy ASIC Bitcoin Miners in India`,
    description: SITE_TAGLINE,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Replace this token with the real one from Google Search Console once verified
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport: Viewport = {
  themeColor: '#0A1628',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Site-wide structured data (Organization) — surfaces in Google Knowledge Panel
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: ['Crypto Mining Miles', 'CMM', 'CMM Mining', 'Crypto Miner India', 'Crypto Miner Delhi'],
  url: SITE_URL,
  logo: `${SITE_URL}/cmmlogo.png`,
  description: SITE_TAGLINE,
  foundingDate: '2017',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressLocality: 'New Delhi',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-99119-44472',
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  ],
  sameAs: [
    'https://wa.me/919911944472',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/shop?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

// Local SEO — wins "crypto miner delhi / asic miner near me in delhi" intent
// and Google Maps / local-pack surfacing. Street address, geo coords and
// opening hours should be filled in once finalised (kept minimal, never faked).
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': `${SITE_URL}/#store`,
  name: SITE_NAME,
  alternateName: ['Crypto Miner Delhi', 'CMM Mining'],
  image: `${SITE_URL}/og-image.png`,
  logo: `${SITE_URL}/cmmlogo.png`,
  url: SITE_URL,
  telephone: '+91-99119-44472',
  priceRange: '₹₹₹',
  description: SITE_TAGLINE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'New Delhi',
    addressRegion: 'Delhi',
    addressCountry: 'IN',
  },
  areaServed: [
    { '@type': 'City', name: 'New Delhi' },
    { '@type': 'Country', name: 'India' },
  ],
  sameAs: ['https://wa.me/919911944472'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>
        {children}
        <CallFab />
        <WhatsAppFab />
      </body>
    </html>
  )
}
