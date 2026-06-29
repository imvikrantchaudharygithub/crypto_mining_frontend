import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import FooterCTA from '@/components/FooterCTA'
import { fetchBlogBySlug, fetchBlogs, formatBlogDate, type BlogPost } from '@/lib/blog'

export const revalidate = 600

const ARTICLE_CSS = `
.cmm-art-wrap { max-width: 760px; margin: 0 auto; padding: clamp(96px,11vw,150px) clamp(24px,5vw,40px) clamp(56px,7vw,90px); }
.cmm-art-crumbs { font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--navy-500); margin-bottom:28px; }
.cmm-art-crumbs a { color:var(--navy-500); text-decoration:none; }
.cmm-art-crumbs a:hover { color:var(--mint-500); }
.cmm-art-crumbs .sep { margin:0 8px; opacity:.5; }
.cmm-art-h1 { font-family:var(--font-display); font-size:clamp(32px,5.5vw,56px); font-weight:700; letter-spacing:-0.035em; line-height:1.04; margin:0 0 22px; color:var(--ink); }
.cmm-art-meta { display:flex; flex-wrap:wrap; gap:10px; align-items:center; font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:12px; letter-spacing:0.04em; color:var(--navy-500); margin-bottom:34px; }
.cmm-art-meta .sep { width:4px; height:4px; border-radius:50%; background:var(--navy-500); opacity:.5; }
.cmm-art-cover { position:relative; width:100%; aspect-ratio:16/9; border-radius:18px; overflow:hidden; background:var(--cream-2,#F5F4E8); margin-bottom:44px; }
.cmm-art-cover img { object-fit:cover; }
.cmm-prose { font-size:18px; line-height:1.75; color:var(--navy-900); }
.cmm-prose > * + * { margin-top:1.25em; }
.cmm-prose h1 { font-family:var(--font-display); font-size:clamp(28px,4vw,40px); font-weight:800; letter-spacing:-0.03em; line-height:1.12; margin-top:1.6em; color:var(--ink); }
.cmm-prose h2 { font-family:var(--font-display); font-size:clamp(24px,3.2vw,32px); font-weight:700; letter-spacing:-0.02em; line-height:1.2; margin-top:1.8em; color:var(--ink); }
.cmm-prose h3 { font-family:var(--font-display); font-size:clamp(20px,2.4vw,24px); font-weight:600; letter-spacing:-0.01em; margin-top:1.6em; color:var(--ink); }
.cmm-prose p { max-width:68ch; }
.cmm-prose a { color:var(--mint-500); text-decoration:underline; text-underline-offset:3px; }
.cmm-prose a:hover { color:var(--navy-900); }
.cmm-prose ul, .cmm-prose ol { padding-left:1.4em; max-width:68ch; }
.cmm-prose li + li { margin-top:0.5em; }
.cmm-prose img { max-width:100%; height:auto; border-radius:14px; margin:1.6em 0; }
.cmm-prose blockquote { border-left:3px solid var(--mint-500); padding:4px 0 4px 22px; margin-left:0; color:var(--navy-700); font-style:italic; }
.cmm-prose strong { color:var(--ink); font-weight:700; }
.cmm-prose em { font-style:italic; }
.cmm-prose u { text-decoration:underline; }
.cmm-prose s { text-decoration:line-through; }
.cmm-prose code { font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:0.88em; background:rgba(10,22,40,0.06); padding:2px 6px; border-radius:6px; }
.cmm-prose pre { background:var(--navy-900); color:#e6edf3; padding:1em 1.2em; border-radius:12px; overflow:auto; font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:0.86em; }
.cmm-prose pre code { background:none; padding:0; color:inherit; }
.cmm-art-tags { display:flex; flex-wrap:wrap; gap:10px; margin:48px 0 0; }
.cmm-art-chip { font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--navy-700); background:rgba(143,203,72,0.16); border:1px solid rgba(143,203,72,0.45); padding:5px 12px; border-radius:999px; }
.cmm-rel { max-width:1180px; margin:0 auto; padding:0 clamp(24px,5vw,80px) clamp(60px,8vw,100px); }
.cmm-rel-head { font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--navy-500); margin-bottom:24px; display:flex; align-items:center; gap:12px; }
.cmm-rel-head .dot { width:8px; height:8px; border-radius:50%; background:var(--mint-500); }
.cmm-rel-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(18px,2.5vw,28px); }
@media (max-width:900px){ .cmm-rel-grid{ grid-template-columns:1fr 1fr;} }
@media (max-width:600px){ .cmm-rel-grid{ grid-template-columns:1fr;} }
.cmm-rel-card { display:block; border:1px solid rgba(10,22,40,0.12); border-radius:16px; padding:22px; text-decoration:none; color:inherit; transition:border-color .2s ease, transform .2s ease; }
.cmm-rel-card:hover { border-color:rgba(10,22,40,0.25); transform:translateY(-3px); }
.cmm-rel-card:focus-visible { outline:3px solid var(--mint-500); outline-offset:2px; }
.cmm-rel-card h3 { font-family:var(--font-display); font-size:18px; font-weight:600; line-height:1.25; letter-spacing:-0.01em; margin:0 0 8px; color:var(--ink); }
.cmm-rel-card p { font-family:var(--font-mono,'IBM Plex Mono',monospace); font-size:11px; color:var(--navy-500); margin:0; }
@media (prefers-reduced-motion: reduce){ .cmm-rel-card:hover{ transform:none; } }
`

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogBySlug(params.slug)
  if (!post) notFound()

  const all = await fetchBlogs()
  const related: BlogPost[] = all.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: ARTICLE_CSS }} />
      <Navbar navLinks={[]} />

      <article className="cmm-art-wrap">
        <nav className="cmm-art-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">/</span>
          <Link href="/blog">Blog</Link>
        </nav>

        <h1 className="cmm-art-h1">{post.title}</h1>

        <div className="cmm-art-meta">
          <span>{post.author || 'CMM Mining Team'}</span>
          {post.publishedAt && <span className="sep" aria-hidden="true" />}
          {post.publishedAt && <span>{formatBlogDate(post.publishedAt)}</span>}
          <span className="sep" aria-hidden="true" />
          <span>{post.readTime || 1} min read</span>
        </div>

        {post.coverImage && (
          <div className="cmm-art-cover">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 760px"
            />
          </div>
        )}

        <div className="cmm-prose" dangerouslySetInnerHTML={{ __html: post.body || '' }} />

        {post.tags?.length > 0 && (
          <div className="cmm-art-tags">
            {post.tags.map((t) => (
              <span key={t} className="cmm-art-chip">{t}</span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="cmm-rel">
          <div className="cmm-rel-head">
            <span className="dot" />
            <span>More from the journal</span>
          </div>
          <div className="cmm-rel-grid">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="cmm-rel-card" aria-label={p.title}>
                <h3>{p.title}</h3>
                <p>{formatBlogDate(p.publishedAt)} · {p.readTime || 1} min read</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FooterCTA data={null} />
    </main>
  )
}
