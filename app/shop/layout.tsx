import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export const metadata: Metadata = {
  title: 'Shop ASIC Miners — Antminer, Whatsminer, MicroBT',
  description:
    'Buy genuine ASIC Bitcoin miners in India — Antminer S19, S21, S19 K Pro, Whatsminer M50, M60. Real hashrate, real warranty, pan-India shipping. SHA-256, ETHASH, SCRYPT, KASPA.',
  keywords: [
    'buy antminer india', 'antminer s19 price india', 'antminer s21 india',
    'whatsminer india', 'asic miner price india', 'bitcoin miner shop india',
    'sha-256 asic', 'ethash miner', 'kaspa miner', 'crypto mining hardware shop',
  ],
  alternates: { canonical: `${SITE_URL}/shop` },
  openGraph: {
    url: `${SITE_URL}/shop`,
    title: 'Shop ASIC Miners — Crypto Mining India',
    description: 'Genuine ASIC miners with real warranty, pan-India shipping, and 24/7 support.',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
