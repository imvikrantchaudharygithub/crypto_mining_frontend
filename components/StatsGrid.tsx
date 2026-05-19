'use client'

import { useEffect, useRef } from 'react'
import AnimatedNumber from './AnimatedNumber'

const DEFAULT_STATS = [
  { value: 2840,  decimals: 0, suffix: ' PH/s', label: 'Network hashrate',  detail: 'Across 4 facilities' },
  { value: 52847, decimals: 0, suffix: '',       label: 'Active miners',      detail: 'In 84 countries' },
  { value: 12.4,  decimals: 1, suffix: 'M',      label: 'Paid out 2025',      detail: 'Verified on-chain', prefix: '$' },
  { value: 99.94, decimals: 2, suffix: '%',       label: 'Uptime SLA',         detail: '12-month rolling' },
]

type StatsGridData = {
  visible?: boolean
  sectionTag?: string
  headlineLine1?: string
  headlineLine2?: string
  items?: { label: string; value: number; suffix?: string; detail?: string; decimals?: number; prefix?: string }[]
} | null

export default function StatsGrid({ data }: { data?: StatsGridData }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  if (data?.visible === false) return null

  const sectionTag    = data?.sectionTag    ?? '02 / live numbers'
  const headlineLine1 = data?.headlineLine1 ?? 'The receipts,'
  const headlineLine2 = data?.headlineLine2 ?? 'updated every block.'
  const STATS = data?.items && data.items.length > 0
    ? data.items.map(i => ({ value: i.value, decimals: i.decimals ?? 0, suffix: i.suffix ?? '', label: i.label, detail: i.detail ?? '', prefix: i.prefix }))
    : DEFAULT_STATS

  return (
    <section
      id="stats"
      ref={ref}
      className="cs-cream"
      style={{ padding: 'clamp(80px, 10vw, 160px) clamp(24px, 5vw, 80px)', position: 'relative' }}
    >
      <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
        <div className="section-tag reveal" style={{ marginBottom: 24 }}>
          {sectionTag}
        </div>

        <h2
          className="reveal"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 7vw, 96px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            marginBottom: 'clamp(48px, 6vw, 80px)',
            maxWidth: 900,
            transitionDelay: '80ms',
          }}
        >
          {headlineLine1}<br />{headlineLine2}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            borderTop: '1px solid rgba(10,22,40,0.15)',
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                padding: 'clamp(28px, 4vw, 40px) clamp(16px, 3vw, 32px) clamp(28px, 4vw, 40px) 0',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(10,22,40,0.15)' : 'none',
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="mono" style={{ color: 'var(--navy-500)', marginBottom: 16, fontSize: 10 }}>
                {String(i + 1).padStart(2, '0')} / {s.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(44px, 5.5vw, 76px)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: 'var(--ink)',
                  marginBottom: 12,
                }}
              >
                {s.prefix || ''}
                <AnimatedNumber value={s.value} decimals={s.decimals} />
                {s.suffix}
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--navy-500)' }}>
                {s.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
