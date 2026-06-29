import type { Product } from '@/lib/products'

type QA = { q: string; a: string }

export function faqPageSchema(items: QA[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function productImages(images: any[] | undefined, fallback: string): string[] {
  const urls = (images ?? [])
    .map((i) => (typeof i === 'string' ? i : i?.url))
    .filter((u): u is string => !!u)
  return urls.length ? urls : [fallback]
}

export function offerExtras(siteUrl: string) {
  const validUntil = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10)
  return {
    priceValidUntil: validUntil,
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'IN',
      merchantReturnDays: 365,
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
    },
  }
}

export function productFaqs(p: Product): QA[] {
  return [
    { q: `How much power does the ${p.name} use?`, a: `The ${p.name} draws ${p.power} and delivers ${p.hashrate} on ${p.algo}, at ${p.efficiency} efficiency.` },
    { q: `What is the price of the ${p.name} in India?`, a: `The ${p.name} is priced at ₹${p.price?.toLocaleString('en-IN')} all-in, including GST invoice and 12-month local RMA warranty, with pan-India shipping.` },
    { q: `Does the ${p.name} come with a warranty?`, a: `Yes — a 12-month local RMA warranty handled in India, plus tested-before-dispatch units and setup support.` },
    { q: `How soon does the ${p.name} ship?`, a: `In-stock units dispatch within 48 hours from our Delhi facility with insured, tracked courier across India.` },
  ]
}

export function collectionPageSchema(siteUrl: string, items: { slug: string; title: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Crypto Mining Learn — Guides',
    url: `${siteUrl}/learn`,
    hasPart: items.map((g) => ({ '@type': 'Article', headline: g.title, url: `${siteUrl}/learn/${g.slug}` })),
  }
}

export function articleSchema(siteUrl: string, g: { slug: string; title: string; description: string; updated: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.title,
    description: g.description,
    datePublished: g.updated,
    dateModified: g.updated,
    author: { '@type': 'Organization', name: 'Crypto Mining India' },
    publisher: { '@type': 'Organization', name: 'Crypto Mining India', logo: { '@type': 'ImageObject', url: `${siteUrl}/cmmlogo.png` } },
    mainEntityOfPage: `${siteUrl}/learn/${g.slug}`,
  }
}

export function blogPostSchema(siteUrl: string, post: {
  slug: string; title: string; excerpt: string; coverImage?: string;
  author?: string; publishedAt?: string; updatedAt?: string;
}) {
  const url = `${siteUrl}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    author: { '@type': 'Organization', name: post.author || 'Crypto Mining India' },
    publisher: {
      '@type': 'Organization',
      name: 'Crypto Mining India',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/cmmlogo.png` },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  }
}

export function breadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.item })),
  }
}
