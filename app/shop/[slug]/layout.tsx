import type { Metadata } from 'next'
import type { Product } from '@/lib/products'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cryptominingindia.com/api'

type Props = { params: { slug: string }; children: React.ReactNode }

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/get-product/${slug}`, { next: { revalidate: 600 } })
    if (!res.ok) return null
    const data = await res.json()
    return (data?.product ?? null) as Product | null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await fetchProduct(params.slug)
  if (!p) {
    return {
      title: 'Miner not found',
      robots: { index: false, follow: true },
    }
  }

  const url = `${SITE_URL}/shop/${p.slug}`
  const title = `${p.name} — ${p.hashrate} ${p.algo} ASIC Miner · Buy in India`
  const description = `Buy ${p.name} in India · ${p.hashrate} hashrate · ${p.power} · ${p.efficiency} efficiency · ₹${p.price?.toLocaleString('en-IN')} all-in · 12-month warranty · pan-India shipping · WhatsApp/call support. ${p.tagline ?? ''}`.slice(0, 300)
  const stock = (p as any).computedStatus ?? (p.available ? 'In Stock' : 'Coming Soon')

  return {
    title,
    description,
    keywords: [
      p.name.toLowerCase(),
      `${p.name.toLowerCase()} price india`,
      `buy ${p.name.toLowerCase()} india`,
      `${p.shortName?.toLowerCase()} miner`,
      `${p.algo.toLowerCase()} miner`,
      'asic miner india',
      'crypto mining india',
    ].filter(Boolean) as string[],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Crypto Mining India',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'product:price:amount': String(p.price ?? ''),
      'product:price:currency': 'INR',
      'product:availability': stock,
    },
  }
}

export default async function ProductLayout({ params, children }: Props) {
  const p = await fetchProduct(params.slug)

  // Product schema — eligible for Google's product rich result + Shopping
  const jsonLd = p && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    description: p.tagline,
    image: [`${SITE_URL}/cmmlogo.png`],
    brand: { '@type': 'Brand', name: 'Crypto Mining India' },
    category: `${p.algo} ASIC Miner`,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop/${p.slug}`,
      priceCurrency: 'INR',
      price: p.price,
      availability:
        (p as any).computedStatus === 'Sold Out'
          ? 'https://schema.org/OutOfStock'
          : (p as any).computedStatus === 'Coming Soon'
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Crypto Mining India' },
      areaServed: 'IN',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Hashrate', value: p.hashrate },
      { '@type': 'PropertyValue', name: 'Power', value: p.power },
      { '@type': 'PropertyValue', name: 'Efficiency', value: p.efficiency },
      { '@type': 'PropertyValue', name: 'Algorithm', value: p.algo },
    ],
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Shop',  item: `${SITE_URL}/shop` },
      ...(p
        ? [{ '@type': 'ListItem', position: 3, name: p.name, item: `${SITE_URL}/shop/${p.slug}` }]
        : []),
    ],
  }

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  )
}
