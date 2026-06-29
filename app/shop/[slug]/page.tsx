import { notFound } from 'next/navigation'
import type { Product } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cryptominingindia.com/api'

// Same fetch (URL + options) as layout.tsx so Next dedupes it within a render.
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

// Server component: the product is fetched here so the full body (H1, specs,
// FAQ, buy box) is server-rendered into the initial HTML instead of appearing
// only after a client-side fetch. The interactive parts live in the client
// island (ProductDetailClient).
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}
