import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FooterCTA from '@/components/FooterCTA'
import { GUIDES } from '@/lib/guides'

export default function LearnIndex() {
  return (
    <main>
      <Navbar navLinks={[]} />
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px,7vw,80px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            marginBottom: 24,
          }}
        >
          Crypto mining, explained for India.
        </h1>
        <p style={{ fontSize: 18, color: 'var(--navy-700)', maxWidth: 640, marginBottom: 56 }}>
          Straight-talking guides on profitability, electricity cost, setup and warranty — written by the team that
          ships miners across India.
        </p>
        <div style={{ display: 'grid', gap: 20 }}>
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/learn/${g.slug}`}
              style={{
                display: 'block',
                padding: 28,
                border: '1px solid rgba(10,22,40,0.15)',
                borderRadius: 16,
                textDecoration: 'none',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontWeight: 600,
                  color: 'var(--ink)',
                  marginBottom: 8,
                }}
              >
                {g.title}
              </h2>
              <p style={{ color: 'var(--navy-700)' }}>{g.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <FooterCTA data={null} />
    </main>
  )
}
