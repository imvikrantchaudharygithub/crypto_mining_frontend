'use client'

import { useEffect, useRef } from 'react'

type PlanItem = {
  name: string; price: number; hashrate: string;
  tag?: string; duration?: string; featured?: boolean; features?: string[]
}

type PlansSection = {
  visible?: boolean
  sectionTag?: string
  headlineLine1?: string
  headlineLine2?: string
  asideText?: string
} | null

const DEFAULT_PLANS: PlanItem[] = [
  { tag: 'STARTER',       name: 'Pebble',   price: 49,   hashrate: '5 TH/s',   duration: '12 months', featured: false, features: ['Hosted hardware', 'Daily payouts', '0% maintenance fee', 'Email support'] },
  { tag: 'POPULAR',       name: 'Boulder',  price: 199,  hashrate: '25 TH/s',  duration: '24 months', featured: true,  features: ['Hosted hardware', 'Daily payouts', '0% maintenance fee', 'Priority support', 'Pool selection', 'Tax reporting'] },
  { tag: 'INSTITUTIONAL', name: 'Mountain', price: 1499, hashrate: '250 TH/s', duration: '36 months', featured: false, features: ['Dedicated rigs', 'Direct settlement', 'White-glove onboarding', 'API access', 'Custom pool', 'Dedicated AM'] },
]

export default function Plans({ plans, section }: { plans?: PlanItem[]; section?: PlansSection }) {
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

  if (section?.visible === false) return null

  const sectionTag    = section?.sectionTag    ?? '03 / pick your rig'
  const headlineLine1 = section?.headlineLine1 ?? 'Plans built for'
  const headlineLine2 = section?.headlineLine2 ?? 'every appetite.'
  const asideText     = section?.asideText     ?? 'All plans include hosted hardware in our Tier-3 facility, 24/7 monitoring, and transparent on-chain payouts.'
  const PLANS = plans && plans.length > 0 ? plans : DEFAULT_PLANS

  return (
    <section
      id="plans"
      ref={ref}
      className="cs-cream"
      style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,5vw,80px)', position: 'relative', overflow: 'hidden' }}
    >
      <div className="blob" style={{ width: 360, height: 360, background: 'var(--mint-300)', top: '10%', right: '-80px' }} />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 'clamp(48px,6vw,80px)',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div className="section-tag reveal" style={{ marginBottom: 24 }}>{sectionTag}</div>
            <h2
              className="reveal"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px,7vw,96px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                transitionDelay: '80ms',
              }}
            >
              {headlineLine1}<br />{headlineLine2}
            </h2>
          </div>
          <p
            className="mono reveal"
            style={{ color: 'var(--navy-500)', maxWidth: 280, lineHeight: 1.65, transitionDelay: '160ms', fontSize: 11 }}
          >
            {asideText}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {PLANS.map((p, i) => (
            <div
              key={i}
              className="reveal mag-card"
              style={{
                padding: 'clamp(24px,3vw,36px)',
                borderRadius: 24,
                background: p.featured ? 'var(--navy-900)' : 'var(--cream-2)',
                color: p.featured ? 'var(--cream)' : 'var(--ink)',
                border: p.featured ? 'none' : '1px solid rgba(10,22,40,0.1)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 480,
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <span
                  className="mono"
                  style={{
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: p.featured ? 'var(--mint-400)' : 'rgba(10,22,40,0.06)',
                    color: p.featured ? 'var(--navy-900)' : 'var(--navy-700)',
                    fontWeight: 600,
                    fontSize: 10,
                  }}
                >
                  {p.tag}
                </span>
                <span className="mono" style={{ color: p.featured ? 'var(--mint-300)' : 'var(--navy-500)', fontSize: 11 }}>
                  0{i + 1}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(40px, 5vw, 56px)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {p.name}
              </h3>

              <div className="mono" style={{ color: p.featured ? 'var(--mint-300)' : 'var(--navy-500)', marginBottom: 24, fontSize: 11 }}>
                {p.hashrate} · {p.duration}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 28 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(44px,5vw,64px)',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}
                >
                  ${p.price}
                </span>
                <span className="mono" style={{ color: p.featured ? 'var(--mint-300)' : 'var(--navy-500)', fontSize: 10 }}>
                  / contract
                </span>
              </div>

              <div
                style={{
                  borderTop: `1px solid ${p.featured ? 'rgba(255,255,255,0.12)' : 'rgba(10,22,40,0.1)'}`,
                  paddingTop: 20,
                  marginBottom: 28,
                }}
              >
                {(p.features ?? []).map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0', fontSize: 14 }}>
                    <span style={{ color: 'var(--mint-400)', flexShrink: 0 }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button
                className="btn-primary"
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  justifyContent: 'center',
                  background: p.featured ? 'var(--mint-400)' : 'var(--navy-900)',
                  color: p.featured ? 'var(--navy-900)' : 'var(--mint-300)',
                }}
              >
                <span className="dot" style={{ background: p.featured ? 'var(--navy-900)' : 'var(--mint-400)' }} />
                Start Mining →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
