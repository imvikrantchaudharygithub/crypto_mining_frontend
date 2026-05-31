import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export const metadata: Metadata = {
  title: 'ASIC Miner Warranty — 12-Month India RMA',
  description:
    'Every Antminer, Whatsminer and ASIC sold by us comes with a 12-month India-local RMA. No factory ship-back, no overseas wait — local replacement and on-site service.',
  keywords: [
    'antminer warranty india', 'asic miner warranty', 'miner rma india',
    'bitcoin miner warranty', 'crypto mining warranty india',
  ],
  alternates: { canonical: `${SITE_URL}/warranty` },
  openGraph: {
    url: `${SITE_URL}/warranty`,
    title: '12-Month India RMA — Crypto Mining India',
    description: 'Local warranty replacement. No factory ship-back. No overseas wait.',
  },
}

export default function WarrantyLayout({ children }: { children: React.ReactNode }) {
  return children
}
