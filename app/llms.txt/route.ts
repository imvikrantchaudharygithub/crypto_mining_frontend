import { GUIDES } from '@/lib/guides'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'
export const revalidate = 3600

export async function GET() {
  const guideLines = GUIDES.map((g) => `- [${g.title}](${SITE_URL}/learn/${g.slug}): ${g.description}`).join('\n')
  const body = `# Crypto Mining India

> India's trusted supplier of genuine ASIC Bitcoin mining hardware (Antminer, Whatsminer) since 2017. Pan-India shipping from Delhi, 12-month local RMA warranty, GST invoice, on-site setup support.

## Key pages
- [Shop all miners](${SITE_URL}/shop)
- [Profitability calculator](${SITE_URL}/profitability)
- [Warranty & RMA](${SITE_URL}/warranty)
- [Crypto miner Delhi](${SITE_URL}/crypto-miner-delhi)
- [Contact](${SITE_URL}/contact)

## Guides
${guideLines}

## Contact
WhatsApp/Phone: +91-99119-44472 · Location: New Delhi, India
`
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
