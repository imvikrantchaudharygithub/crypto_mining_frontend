'use client'

import { useEffect, useRef, useState } from 'react'

type FAQData = {
  visible?: boolean
  sectionTag?: string
  headlineLine1?: string
  headlineLine2?: string
  items?: { q: string; a: string }[]
} | null

const DEFAULT_FAQS = [
  { q: 'How is this different from cloud mining scams?', a: 'Most "cloud mining" is a paper claim with no hardware behind it. We own the rigs, publish facility audits, and let you trace your contract to specific machines.' },
  { q: 'When do I get paid, and to where?',              a: 'Every 24 hours, automatically, to the wallet address you provide at signup. We never custody your funds. All payouts are on-chain and verifiable.' },
  { q: 'What happens after my contract ends?',           a: 'You can renew at the current rate, upgrade to a larger plan, or simply walk away. There is no auto-renewal or lock-in.' },
  { q: 'Is there a minimum payout?',                     a: '0.0001 BTC. Below that, payouts roll over to the next day to avoid network fees eating your earnings.' },
  { q: 'What if Bitcoin price crashes?',                 a: "Your hashrate keeps producing the same BTC regardless of price. We don't hedge for you — that's your call. We do publish a break-even calculator." },
  { q: 'Do you offer an institutional desk?',            a: 'Yes. The Mountain plan is the entry point; for $250k+ commitments, we offer custom contracts, dedicated AMs, and direct facility tours.' },
]

export default function FAQ({ data }: { data?: FAQData }) {
  const [open, setOpen] = useState<number | null>(0)
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

  const sectionTag    = data?.sectionTag    ?? '06 / questions'
  const headlineLine1 = data?.headlineLine1 ?? 'The honest'
  const headlineLine2 = data?.headlineLine2 ?? 'answers.'
  const FAQS = data?.items && data.items.length > 0 ? data.items : DEFAULT_FAQS

  return (
    <section
      id="faq"
      ref={ref}
      className="cs-cream"
      style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,5vw,80px)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-tag reveal" style={{ marginBottom: 24 }}>{sectionTag}</div>

        <h2
          className="reveal"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px,7vw,96px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            marginBottom: 'clamp(48px,6vw,80px)',
            transitionDelay: '80ms',
          }}
        >
          {headlineLine1}<br />{headlineLine2}
        </h2>

        <div style={{ borderTop: '1px solid rgba(10,22,40,0.15)' }}>
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                borderBottom: '1px solid rgba(10,22,40,0.15)',
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: 'clamp(20px,3vw,32px) 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 20,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(16px,2.2vw,28px)',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: 'var(--ink)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                  <span className="mono" style={{ color: 'var(--mint-500)', fontSize: 12, flexShrink: 0 }}>
                    0{i + 1}
                  </span>
                  <span style={{ textAlign: 'left' }}>{f.q}</span>
                </span>
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: open === i ? 'var(--navy-900)' : 'transparent',
                    border: '1px solid rgba(10,22,40,0.2)',
                    display: 'grid',
                    placeItems: 'center',
                    color: open === i ? 'var(--mint-400)' : 'var(--ink)',
                    transition: 'all 0.3s cubic-bezier(.2,.8,.2,1)',
                    flexShrink: 0,
                    fontSize: 20,
                    fontWeight: 300,
                  }}
                >
                  {open === i ? '−' : '+'}
                </span>
              </button>

              <div
                style={{
                  maxHeight: open === i ? 400 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.5s cubic-bezier(.2,.8,.2,1)',
                }}
              >
                <p
                  style={{
                    paddingBottom: 28,
                    paddingLeft: 'clamp(28px,4vw,52px)',
                    fontSize: 'clamp(14px,1.4vw,17px)',
                    lineHeight: 1.65,
                    color: 'var(--navy-700)',
                    maxWidth: 720,
                  }}
                >
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
