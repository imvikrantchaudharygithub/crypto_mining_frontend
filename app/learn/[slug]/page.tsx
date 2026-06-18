import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import FooterCTA from '@/components/FooterCTA'
import { getGuide } from '@/lib/guides'

export default function GuidePage({ params }: { params: { slug: string } }) {
  const g = getGuide(params.slug)
  if (!g) notFound()
  return (
    <main>
      <Navbar navLinks={[]} />
      <article style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(100px,12vw,150px) clamp(24px,5vw,40px)' }}>
        <nav style={{ fontSize: 13, color: 'var(--navy-500)', marginBottom: 24 }}>
          <Link href="/">Home</Link> / <Link href="/learn">Learn</Link> / <span>{g.title}</span>
        </nav>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px,6vw,56px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          {g.title}
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.6, fontWeight: 500, color: 'var(--ink)', marginBottom: 16 }}>{g.answer}</p>
        <p style={{ fontSize: 13, color: 'var(--navy-500)', marginBottom: 48 }}>
          Last updated {new Date(g.updated).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>

        {g.sections.map((s, i) => (
          <section key={i} style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px,3vw,32px)',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {s.heading}
            </h2>
            {s.body.map((para, j) => (
              <p key={j} style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--navy-700)', marginBottom: 14 }}>
                {para}
              </p>
            ))}
            {s.table && (
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: 15 }}>
                <thead>
                  <tr>
                    {s.table.head.map((h, k) => (
                      <th key={k} style={{ textAlign: 'left', borderBottom: '2px solid rgba(10,22,40,0.2)', padding: '8px 12px' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((c, k) => (
                        <td key={k} style={{ borderBottom: '1px solid rgba(10,22,40,0.12)', padding: '8px 12px' }}>
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}

        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px,3vw,32px)',
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            FAQ
          </h2>
          {g.faqs.map((f, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{f.q}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--navy-700)' }}>{f.a}</p>
            </div>
          ))}
        </section>

        <section style={{ borderTop: '1px solid rgba(10,22,40,0.15)', paddingTop: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Related</h2>
          <ul>
            {g.related.map((r, i) => (
              <li key={i}>
                <Link href={r.href}>{r.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
      <FooterCTA data={null} />
    </main>
  )
}
