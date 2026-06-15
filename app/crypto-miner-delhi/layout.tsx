import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export const metadata: Metadata = {
  title: 'Crypto Miner Delhi — Buy ASIC Bitcoin Miners in Delhi NCR',
  description:
    'Buy genuine ASIC Bitcoin miners in Delhi NCR — Antminer S19/S21, Whatsminer & more. Delhi-based supplier with same-region delivery, on-site setup, 12-month India RMA and 24/7 support.',
  keywords: [
    'crypto miner delhi', 'asic miner delhi', 'bitcoin miner delhi', 'antminer delhi',
    'buy crypto miner in delhi', 'whatsminer delhi', 'crypto mining delhi ncr',
    'mining hardware dealer delhi', 'cmm mining',
  ],
  alternates: { canonical: `${SITE_URL}/crypto-miner-delhi` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/crypto-miner-delhi`,
    title: 'Crypto Miner Delhi — Buy ASIC Bitcoin Miners in Delhi NCR',
    description:
      'Delhi-based ASIC miner supplier — Antminer, Whatsminer & more with same-region delivery, on-site setup and 12-month India RMA.',
    images: ['/og-image.png'],
  },
}

export default function CryptoMinerDelhiLayout({ children }: { children: React.ReactNode }) {
  return children
}
