import type { Metadata } from 'next'
import { GUIDES } from '@/lib/guides'
import { collectionPageSchema } from '@/lib/schema'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export const metadata: Metadata = {
  title: 'Learn — Crypto Mining Guides for India',
  description:
    'Expert guides on Bitcoin mining in India: profitability, electricity cost by state, ASIC miner setup, warranty, and the best miners to buy in 2026.',
  alternates: { canonical: `${SITE_URL}/learn` },
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const schema = collectionPageSchema(
    SITE_URL,
    GUIDES.map((g) => ({ slug: g.slug, title: g.title }))
  )
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
