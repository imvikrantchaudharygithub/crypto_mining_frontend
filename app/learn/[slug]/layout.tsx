import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGuide, allGuideSlugs } from '@/lib/guides'
import { articleSchema, breadcrumbSchema, faqPageSchema } from '@/lib/schema'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export function generateStaticParams() {
  return allGuideSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const g = getGuide(params.slug)
  if (!g) return { title: 'Guide not found', robots: { index: false, follow: true } }
  const url = `${SITE_URL}/learn/${g.slug}`
  return {
    title: g.metaTitle,
    description: g.description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: g.metaTitle, description: g.description },
    twitter: { card: 'summary_large_image', title: g.metaTitle, description: g.description },
  }
}

export default function GuideLayout({ params, children }: { params: { slug: string }; children: React.ReactNode }) {
  const g = getGuide(params.slug)
  if (!g) notFound()
  const url = `${SITE_URL}/learn/${g.slug}`
  const schemas = [
    articleSchema(SITE_URL, g),
    faqPageSchema(g.faqs),
    breadcrumbSchema([
      { name: 'Home', item: SITE_URL },
      { name: 'Learn', item: `${SITE_URL}/learn` },
      { name: g.title, item: url },
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
