'use client'

import { useEffect, useRef } from 'react'

type HowItWorksData = {
  visible?: boolean
  sectionTag?: string
  headlinePrefix?: string
  headlineItalic?: string
  steps?: { num: string; title: string; body: string }[]
} | null

const DEFAULT_STEPS = [
  { num: '01', title: 'Pick your plan',       body: 'Choose Pebble, Boulder, or Mountain — or build a custom contract with our team.' },
  { num: '02', title: 'Connect your wallet',  body: 'Provide your payout address. Non-custodial. Always under your control.' },
  { num: '03', title: 'We assign your rigs',  body: 'Within 12 hours, your hashrate is allocated to physical hardware in our facility.' },
  { num: '04', title: 'Mining starts',        body: 'Your rigs hash 24/7 against your chosen pool. Live dashboard shows real-time output.' },
  { num: '05', title: 'Payouts hit daily',    body: 'Every 24 hours, settled BTC lands at your address. On-chain. Verifiable. Forever.' },
]

export default function HowItWorks({ data }: { data?: HowItWorksData }) {
  const wrapRef  = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap  = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return

    let enabled = window.innerWidth >= 768
    const onResize = () => { enabled = window.innerWidth >= 768 }
    window.addEventListener('resize', onResize)

    const onScroll = () => {
      if (!enabled) { track.style.transform = ''; return }
      const r       = wrap.getBoundingClientRect()
      const total   = wrap.offsetHeight - window.innerHeight
      const progress = Math.min(1, Math.max(0, -r.top / total))
      const maxSlide = track.scrollWidth - window.innerWidth + 160
      track.style.transform = `translateX(${-progress * maxSlide}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  if (data?.visible === false) return null

  const sectionTag     = data?.sectionTag     ?? '05 / process'
  const headlinePrefix = data?.headlinePrefix ?? 'From signup to first payout'
  const headlineItalic = data?.headlineItalic ?? 'under a day.'
  const STEPS = data?.steps && data.steps.length > 0 ? data.steps : DEFAULT_STEPS

  return (
    <section
      ref={wrapRef}
      style={{ background: 'var(--navy-900)', color: 'var(--cream)', position: 'relative' }}
    >
      <div className="hide-mobile" style={{ height: '300vh', position: 'relative' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ padding: '0 80px', marginBottom: 48 }}>
            <div className="section-tag" style={{ marginBottom: 20, color: 'var(--mint-300)' }}>
              {sectionTag}
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px,6vw,88px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: 'var(--cream)',
              }}
            >
              {headlinePrefix}<br />
              in{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--mint-400)' }}>{headlineItalic}</em>
            </h2>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <div ref={trackRef} className="h-track" style={{ paddingLeft: 80, transition: 'transform 0.05s linear' }}>
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: 420,
                    padding: 36,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(168,224,99,0.2)',
                    borderRadius: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 340,
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <div className="mono" style={{ color: 'var(--mint-300)', marginBottom: 20, fontSize: 11 }}>
                      STEP {s.num}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 40,
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.06,
                        marginBottom: 20,
                      }}
                    >
                      {s.title}
                    </h3>
                    <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(251,251,243,0.7)', maxWidth: 340 }}>
                      {s.body}
                    </p>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 160,
                      fontWeight: 700,
                      color: 'var(--mint-400)',
                      opacity: 0.12,
                      alignSelf: 'flex-end',
                      lineHeight: 0.8,
                      letterSpacing: '-0.05em',
                      userSelect: 'none',
                    }}
                  >
                    {s.num}
                  </div>
                </div>
              ))}
              <div style={{ minWidth: 180, flexShrink: 0 }} />
            </div>
          </div>

          <div
            style={{
              position: 'absolute', bottom: 28, left: 80, right: 80,
              display: 'flex', justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24,
            }}
          >
            <span className="mono" style={{ color: 'var(--mint-300)', fontSize: 11 }}>scroll →</span>
            <span className="mono" style={{ color: 'var(--mint-300)', fontSize: 11 }}>
              {String(STEPS.length).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div
        className="hide-tablet"
        style={{ padding: '80px 24px', display: 'none' }}
      >
        <div style={{ marginBottom: 40 }}>
          <div className="section-tag" style={{ marginBottom: 20, color: 'var(--mint-300)' }}>
            {sectionTag}
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: 'var(--cream)',
            }}
          >
            {headlinePrefix} in{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--mint-400)' }}>{headlineItalic}</em>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                padding: 24,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(168,224,99,0.18)',
                borderRadius: 16,
              }}
            >
              <div className="mono" style={{ color: 'var(--mint-300)', marginBottom: 12, fontSize: 10 }}>
                STEP {s.num}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  marginBottom: 10,
                }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(251,251,243,0.7)' }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hide-tablet { display: block !important; }
          .hide-mobile  { display: none !important; }
        }
      `}</style>
    </section>
  )
}
