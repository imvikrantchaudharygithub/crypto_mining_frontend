import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import FooterCTA from '@/components/FooterCTA'

export const metadata: Metadata = {
  title: 'Page not found (404)',
  robots: { index: false, follow: true },
}

const LINKS: { href: string; label: string; sub: string }[] = [
  { href: '/shop', label: 'Shop miners', sub: 'Antminer · Whatsminer · in stock' },
  { href: '/learn', label: 'Learn', sub: 'Mining guides & how-tos' },
  { href: '/profitability', label: 'Profitability', sub: 'Estimate returns & break-even' },
  { href: '/contact', label: 'Contact', sub: 'Talk to our Delhi team' },
]

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section style={{
        minHeight: '70vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(120px,14vw,180px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)',
        background: 'var(--cream)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
          <div className="section-tag" style={{ marginBottom: 20 }}>error · 404</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(40px,8vw,96px)', lineHeight: 0.95, letterSpacing: '-0.04em',
            color: 'var(--ink)', marginBottom: 20,
          }}>
            Page not <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>found.</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', lineHeight: 1.7, color: 'var(--navy-700)', maxWidth: 560, marginBottom: 44 }}>
            The page or miner you’re looking for has moved or no longer exists. Try one of these instead:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '22px 24px', borderRadius: 14,
                  background: 'var(--cream-2)', border: '1px solid rgba(10,22,40,0.12)',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink)', marginBottom: 4 }}>{l.label} →</div>
                  <div className="mono" style={{ color: 'var(--navy-500)', fontSize: 11 }}>{l.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FooterCTA />
    </main>
  )
}
