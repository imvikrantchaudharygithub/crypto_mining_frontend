import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchBlogBySlug } from '@/lib/blog'
import { blogPostSchema, breadcrumbSchema } from '@/lib/schema'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchBlogBySlug(params.slug)
  if (!post) return { title: 'Post not found', robots: { index: false, follow: true } }
  const url = `${SITE_URL}/blog/${post.slug}`
  const title = post.seo?.title || post.title
  const description = post.seo?.description || post.excerpt
  const images = post.coverImage ? [post.coverImage] : []
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title, description, images },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

export default async function BlogPostLayout({
  params,
  children,
}: {
  params: { slug: string }
  children: React.ReactNode
}) {
  const post = await fetchBlogBySlug(params.slug)
  if (!post) notFound()
  const url = `${SITE_URL}/blog/${post.slug}`
  const schemas = [
    blogPostSchema(SITE_URL, post),
    breadcrumbSchema([
      { name: 'Home', item: SITE_URL },
      { name: 'Blog', item: `${SITE_URL}/blog` },
      { name: post.title, item: url },
    ]),
  ]
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      {children}
    </>
  )
}
