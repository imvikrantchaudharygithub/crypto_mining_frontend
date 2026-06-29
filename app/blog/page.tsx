import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import FooterCTA from '@/components/FooterCTA'
import { fetchBlogs, formatBlogDate, type BlogPost } from '@/lib/blog'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Blog — Crypto Mining India',
  description:
    'Guides, news and field notes on crypto mining in India — profitability, electricity cost, hardware and setup, from the team that ships miners nationwide.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/blog`,
    title: 'Blog — Crypto Mining India',
    description: 'Guides, news and field notes on crypto mining in India.',
  },
}

const BLOG_CSS = `
.cmm-blog-wrap { max-width: 1180px; margin: 0 auto; padding: clamp(100px,12vw,160px) clamp(24px,5vw,80px) clamp(60px,8vw,100px); }
.cmm-blog-tag { display:flex; align-items:center; gap:12px; font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--navy-500); margin-bottom:28px; }
.cmm-blog-tag .dot { width:8px; height:8px; border-radius:50%; background:var(--mint-500); }
.cmm-blog-h1 { font-family:var(--font-display); font-size:clamp(40px,7.5vw,84px); font-weight:700; letter-spacing:-0.04em; line-height:0.98; margin:0 0 24px; color:var(--ink); }
.cmm-blog-h1 em { font-style:italic; color:var(--mint-500); }
.cmm-blog-lead { font-size:clamp(16px,2vw,19px); line-height:1.6; color:var(--navy-700); max-width:62ch; margin:0 0 64px; }
.cmm-blog-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(20px,2.5vw,32px); }
@media (max-width:900px){ .cmm-blog-grid{ grid-template-columns:repeat(2,1fr);} }
@media (max-width:600px){ .cmm-blog-grid{ grid-template-columns:1fr;} }
.cmm-blog-card { display:flex; flex-direction:column; border:1px solid rgba(10,22,40,0.12); border-radius:18px; overflow:hidden; background:#fff; text-decoration:none; color:inherit; transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
.cmm-blog-card:hover { transform:translateY(-4px); box-shadow:0 18px 40px -22px rgba(10,22,40,0.35); border-color:rgba(10,22,40,0.22); }
.cmm-blog-card:focus-visible { outline:3px solid var(--mint-500); outline-offset:2px; }
.cmm-blog-cover { position:relative; width:100%; aspect-ratio:16/10; background:var(--cream-2,#F5F4E8); overflow:hidden; }
.cmm-blog-cover img { object-fit:cover; }
.cmm-blog-cover-empty { display:flex; align-items:center; justify-content:center; height:100%; font-family:var(--font-display); font-size:40px; font-weight:700; color:rgba(10,22,40,0.12); }
.cmm-blog-body { display:flex; flex-direction:column; gap:12px; padding:24px 22px 26px; flex:1; }
.cmm-blog-chip { align-self:flex-start; font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--navy-700); background:rgba(143,203,72,0.16); border:1px solid rgba(143,203,72,0.45); padding:4px 10px; border-radius:999px; }
.cmm-blog-card-title { font-family:var(--font-display); font-size:21px; font-weight:600; line-height:1.2; letter-spacing:-0.02em; color:var(--ink); margin:0; }
.cmm-blog-excerpt { font-size:14.5px; line-height:1.6; color:var(--navy-700); margin:0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.cmm-blog-meta { margin-top:auto; padding-top:14px; display:flex; gap:10px; align-items:center; font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:11px; letter-spacing:0.04em; color:var(--navy-500); }
.cmm-blog-meta .sep { width:4px; height:4px; border-radius:50%; background:var(--navy-500); opacity:.5; }
.cmm-blog-empty { border:1px dashed rgba(10,22,40,0.2); border-radius:18px; padding:64px 32px; text-align:center; color:var(--navy-500); }
@media (prefers-reduced-motion: reduce){ .cmm-blog-card{ transition:none; } .cmm-blog-card:hover{ transform:none; } }
`

function BlogCard({ post }: { post: BlogPost }) {
  const tag = post.tags?.[0]
  return (
    <Link href={`/blog/${post.slug}`} className="cmm-blog-card" aria-label={post.title}>
      <div className="cmm-blog-cover">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt || post.title}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 380px"
          />
        ) : (
          <div className="cmm-blog-cover-empty" aria-hidden="true">CMM</div>
        )}
      </div>
      <div className="cmm-blog-body">
        {tag && <span className="cmm-blog-chip">{tag}</span>}
        <h2 className="cmm-blog-card-title">{post.title}</h2>
        {post.excerpt && <p className="cmm-blog-excerpt">{post.excerpt}</p>}
        <div className="cmm-blog-meta">
          {post.publishedAt && <span>{formatBlogDate(post.publishedAt)}</span>}
          {post.publishedAt && <span className="sep" aria-hidden="true" />}
          <span>{post.readTime || 1} min read</span>
        </div>
      </div>
    </Link>
  )
}

export default async function BlogIndex() {
  const posts = await fetchBlogs()

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: BLOG_CSS }} />
      <Navbar navLinks={[]} />
      <section className="cmm-blog-wrap">
        <div className="cmm-blog-tag">
          <span className="dot" />
          <span>Journal / Insights</span>
        </div>
        <h1 className="cmm-blog-h1">
          Crypto mining, <em>in the open.</em>
        </h1>
        <p className="cmm-blog-lead">
          Field notes, profitability breakdowns and straight-talking guides — written by the team
          that ships and services miners across India.
        </p>

        {posts.length === 0 ? (
          <div className="cmm-blog-empty">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginBottom: 8, color: 'var(--ink)' }}>
              No posts yet.
            </p>
            <p>New articles are on the way. Check back soon.</p>
          </div>
        ) : (
          <div className="cmm-blog-grid">
            {posts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>
      <FooterCTA data={null} />
    </main>
  )
}
