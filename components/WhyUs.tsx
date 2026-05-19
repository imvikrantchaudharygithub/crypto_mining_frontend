'use client'

import { useEffect, useRef } from 'react'

type WhyUsData = {
  visible?: boolean
  sectionTag?: string
  headlineLine1?: string
  headlineItalic?: string
  features?: { num: string; title: string; body: string }[]
} | null

const DEFAULT_FEATURES = [
  { num: '01', title: 'Real hardware. Real watts.', body: 'No tokenized hashrate, no sub-leases. We own and operate every rig in our facilities — and you can audit the units assigned to your contract.' },
  { num: '02', title: 'Daily on-chain payouts.',    body: 'Settlement happens automatically every 24 hours, posted to a public address you control. No custodial wallets, no rug pulls.' },
  { num: '03', title: 'Hydro-cooled at scale.',     body: 'Tier-3 datacenter with closed-loop hydro cooling, redundant power, and biometric access. Built to run for the next decade.' },
  { num: '04', title: '0% maintenance fees.',       body: 'Most operators take 20–30% off the top for "maintenance." We don\'t. Your contract price is the price.' },
]

export default function WhyUs({ data }: { data?: WhyUsData }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  if (data?.visible === false) return null

  const sectionTag     = data?.sectionTag     ?? '04 / why us'
  const headlineLine1  = data?.headlineLine1  ?? 'Built different,'
  const headlineItalic = data?.headlineItalic ?? 'on purpose.'
  const FEATURES = data?.features && data.features.length > 0 ? data.features : DEFAULT_FEATURES

  return (
    <section
      id="why-us"
      ref={ref}
      className="cs-mint"
      style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,5vw,80px)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="section-tag reveal" style={{ marginBottom: 24 }}>{sectionTag}</div>

        <h2
          className="reveal"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px,8vw,112px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 0.96,
            marginBottom: 'clamp(56px,7vw,96px)',
            transitionDelay: '80ms',
          }}
        >
          {headlineLine1}<br />
          <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>{headlineItalic}</em>
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(40px,5vw,60px) clamp(32px,5vw,80px)',
          }}
        >
          {FEATURES.map((f, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <span className="mono" style={{ color: 'var(--mint-500)', fontSize: 13 }}>{f.num}</span>
                <div style={{ height: 1, flex: 1, background: 'rgba(10,22,40,0.15)' }} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px,2.5vw,36px)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: 14,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--navy-700)', maxWidth: 460 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
