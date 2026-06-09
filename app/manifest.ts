import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Crypto Mining India',
    short_name: 'CMM',
    description: 'India\'s #1 trusted crypto mining hardware supplier — ASIC miners, contracts, support.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBFBF3',
    theme_color: '#0A1628',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
