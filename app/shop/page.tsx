import type { Product } from '@/lib/products'
import ShopClient from './ShopClient'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cryptominingindia.com/api'

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/get-products`, { next: { revalidate: 600 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.products ?? []) as Product[]
  } catch {
    return []
  }
}

async function fetchShopPage() {
  try {
    const res = await fetch(`${API_URL}/page/shop`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const data = await res.json()
    return data?.page ?? null
  } catch {
    return null
  }
}

// Server component: fetch the catalogue + CMS copy up front so the hero, the
// product grid and all internal product links render into the initial HTML.
// Interactivity (algorithm filter, WhatsApp deep-links) lives in ShopClient.
export default async function ShopPage() {
  const [products, page] = await Promise.all([fetchProducts(), fetchShopPage()])
  return <ShopClient initialProducts={products} initialPage={page} />
}
