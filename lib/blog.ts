const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cryptominingindia.com/api'

export interface BlogPost {
  _id?: string
  slug: string
  title: string
  excerpt: string
  coverImage: string
  coverImageAlt: string
  body: string
  author: string
  tags: string[]
  readTime: number
  seo?: { title?: string; description?: string; ogImage?: string }
  status?: 'draft' | 'published'
  publishedAt?: string
  updatedAt?: string
  createdAt?: string
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/get-blogs`, { next: { revalidate: 600 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.posts ?? []) as BlogPost[]
  } catch {
    return []
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/get-blog/${slug}`, { next: { revalidate: 600 } })
    if (!res.ok) return null
    const data = await res.json()
    return (data?.post ?? null) as BlogPost | null
  } catch {
    return null
  }
}

export function formatBlogDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}
