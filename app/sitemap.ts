import type { MetadataRoute } from 'next'
import { allGuideSlugs } from '@/lib/guides'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cryptominingindia.com/api'

// Revalidate the sitemap once per hour so new products get indexed quickly
export const revalidate = 3600

type ProductSlug = { slug: string; updatedAt?: string }

async function fetchProductSlugs(): Promise<ProductSlug[]> {
  try {
    const res = await fetch(`${API_URL}/get-products`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    const products = (data?.products ?? []) as Array<{ slug?: string; updatedAt?: string }>
    return products
      .filter((p) => p.slug)
      .map((p) => ({ slug: p.slug!, updatedAt: p.updatedAt }))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/shop`,            lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/crypto-miner-delhi`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/profitability`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/service-request`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/warranty`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/track-ticket`,    lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/learn`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
  ]

  const products = await fetchProductSlugs()
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const guideRoutes: MetadataRoute.Sitemap = allGuideSlugs().map((slug) => ({
    url: `${SITE_URL}/learn/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...guideRoutes]
}
