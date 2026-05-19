'use client'

import { useEffect, useRef } from 'react'
import HeroParticles from './HeroParticles'
import HeroMiner from './HeroMiner'

type CTA = { label?: string; href?: string }
type TrustItem = { value?: string; label?: string }
type BtcPrice = {
  visible?: boolean
  value?: string
  label?: string
  delta?: string
  deltaDirection?: 'up' | 'down'
}

type HeroProp = {
  visible?: boolean
  sectionTag?: string
  cornerLabelLeft?: string
  cornerLabelRight?: string
  headlineLine1?: string
  headlineItalic?: string
  subtitleLines?: string[]
  primaryCta?: CTA
  ghostCta?: CTA
  liveBadgeText?: string
  trustStrip?: TrustItem[]
  btcPrice?: BtcPrice
} | null

const DEFAULT_TRUST: TrustItem[] = [
  { value: '1000+', label: 'Units Sold' },
  { value: '2017',  label: 'Est. Year' },
  { value: 'GST ✓', label: 'Registered' },
  { value: '99.9%', label: 'Uptime SLA' },
]

const DEFAULT_SUBTITLE = [
  'Industrial-grade hashrate, hosted hardware,',
  'and transparent payouts — built for retail',
  'miners and institutional desks since 2017.',
]

const HERO_CSS = `
.hero-inner {
  padding: clamp(110px, 15vw, 200px) 48px 100px;
}
@media (max-width: 768px) {
  .hero-inner {
    padding: clamp(110px, 15vw, 200px) 20px 100px;
  }
}
.hero-checklist-item {
  transition:
    opacity 0.9s cubic-bezier(.2,.8,.2,1),
    transform 0.35s cubic-bezier(.2,.8,.2,1),
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}
.hero-checklist-item:hover {
  transform: translateY(-2px);
  background: rgba(168, 224, 99, 0.18);
  border-color: rgba(168, 224, 99, 0.55);
  box-shadow: 0 10px 26px -10px rgba(168,224,99,0.45);
}

.btc-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px 7px 9px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(10,22,40,0.96) 0%, rgba(18,37,70,0.96) 100%);
  border: 1px solid rgba(247, 147, 26, 0.42);
  box-shadow:
    0 0 0 1px rgba(247, 147, 26, 0.10),
    0 8px 22px -10px rgba(247, 147, 26, 0.50),
    0 2px 8px -2px rgba(10, 22, 40, 0.30);
  position: relative;
  overflow: hidden;
  animation: btcPillPulse 3.2s ease-in-out infinite;
}
.btc-pill::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(60% 100% at 0% 50%, rgba(247,147,26,0.18), rgba(247,147,26,0) 70%);
  pointer-events: none;
}
.btc-pill__icon {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(247, 147, 26, 0.14);
  border: 1px solid rgba(247, 147, 26, 0.35);
  position: relative;
  z-index: 1;
  box-shadow: 0 0 12px -2px rgba(247, 147, 26, 0.55);
}
.btc-pill__label {
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(247, 147, 26, 0.92);
  position: relative;
  z-index: 1;
  font-weight: 700;
}
.btc-pill__value {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13.5px;
  letter-spacing: -0.01em;
  color: var(--cream);
  position: relative;
  z-index: 1;
}
.btc-pill__delta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 9.5px;
  font-weight: 700;
  padding: 3px 7px 3px 5px;
  border-radius: 999px;
  position: relative;
  z-index: 1;
  letter-spacing: 0.02em;
}
.btc-pill__delta--up {
  background: rgba(34, 197, 94, 0.16);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.30);
}
.btc-pill__delta--down {
  background: rgba(239, 68, 68, 0.16);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.30);
}
@keyframes btcPillPulse {
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(247, 147, 26, 0.10),
      0 8px 22px -10px rgba(247, 147, 26, 0.50),
      0 2px 8px -2px rgba(10, 22, 40, 0.30);
  }
  50% {
    box-shadow:
      0 0 0 3px rgba(247, 147, 26, 0.18),
      0 14px 30px -10px rgba(247, 147, 26, 0.65),
      0 2px 8px -2px rgba(10, 22, 40, 0.30);
  }
}
@media (prefers-reduced-motion: reduce) {
  .btc-pill { animation: none; }
}
`

export default function Hero({ hero }: { hero?: HeroProp }) {
  const sectionRef = useRef<HTMLElement>(null)
  const h = hero ?? {}

  if (h.visible === false) return null

  const sectionTag       = h.sectionTag       ?? 'A new kind of mining'
  const cornerLeft       = h.cornerLabelLeft  ?? '[ 01 ] — Hashrate as a service'
  const cornerRight      = h.cornerLabelRight ?? 'N 28°37′ · E 77°13′\nMining facility · live'
  const headlineLine1    = h.headlineLine1    ?? 'Mine smarter,'
  const headlineItalic   = h.headlineItalic   ?? 'earn everywhere'
  const subtitleLines    = h.subtitleLines && h.subtitleLines.length > 0 ? h.subtitleLines : DEFAULT_SUBTITLE
  const primary          = h.primaryCta       ?? { label: 'Start Mining', href: '#plans' }
  const ghost            = h.ghostCta         ?? { label: 'View Plans',   href: '#plans' }
  const liveBadgeText    = h.liveBadgeText    ?? '52,847 miners online now'
  const trustItems       = h.trustStrip && h.trustStrip.length > 0 ? h.trustStrip : DEFAULT_TRUST

  const btc = h.btcPrice ?? {}
  const btcVisible       = btc.visible !== false
  const btcValue         = btc.value ?? '₹ 58,42,310'
  const btcLabel         = btc.label ?? 'BTC / INR'
  const btcDelta         = btc.delta ?? '2.4%'
  const btcDirection     = btc.deltaDirection === 'down' ? 'down' : 'up'
  const btcShow          = btcVisible && !!btcValue

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ minHeight: '100vh', position: 'relative', background: 'var(--cream)', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <HeroParticles intensity={0.2} />
      </div>

      <div
        className="mono hide-mobile"
        style={{ position: 'absolute', top: 110, left: 48, color: 'var(--navy-500)', zIndex: 2, whiteSpace: 'pre-line' }}
      >
        {cornerLeft}
      </div>
      <div
        className="mono hide-mobile"
        style={{ position: 'absolute', top: 110, right: 48, color: 'var(--navy-500)', zIndex: 2, textAlign: 'right', whiteSpace: 'pre-line' }}
      >
        {cornerRight}
      </div>

      <div
        className="hero-inner"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <div
          className="reveal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
            marginBottom: 28,
          }}
        >
          <div className="section-tag" style={{ marginBottom: 0 }}>
            {sectionTag}
          </div>
          {btcShow && (
            <div
              className="btc-pill"
              role="status"
              aria-label={`${btcLabel} ${btcValue}`}
            >
              <span className="btc-pill__icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="#F7931A" />
                  <path
                    d="M15.5 10.6c.18-1.2-.74-1.84-2-2.27l.4-1.64-1-.25-.4 1.6c-.27-.07-.55-.13-.83-.2l.4-1.6-1-.26-.4 1.65c-.22-.05-.45-.1-.66-.16v-.01L8.6 7.1l-.27 1.08s.75.17.73.18c.4.1.48.37.46.58l-.47 1.88c.03.01.07.02.11.03l-.11-.03-.66 2.63c-.05.13-.18.31-.46.24.01.01-.74-.18-.74-.18L7 14.78l1.32.33c.25.06.49.13.72.18l-.4 1.66 1 .25.4-1.65c.28.07.54.14.81.21l-.4 1.64 1 .25.41-1.66c1.7.32 2.98.2 3.53-1.34.44-1.24-.02-1.96-.92-2.42.65-.15 1.14-.58 1.27-1.47Zm-2.27 3.2c-.31 1.24-2.4.57-3.07.4l.54-2.18c.68.17 2.86.5 2.53 1.78Zm.32-3.21c-.29 1.13-2.02.55-2.59.41l.49-1.98c.56.14 2.4.4 2.1 1.57Z"
                    fill="#fff"
                  />
                </svg>
              </span>
              <span className="btc-pill__label mono">{btcLabel}</span>
              <span className="btc-pill__value">{btcValue}</span>
              {btcDelta && (
                <span
                  className={`btc-pill__delta btc-pill__delta--${btcDirection} mono`}
                  aria-label={`${btcDirection === 'up' ? 'up' : 'down'} ${btcDelta}`}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {btcDirection === 'up' ? (
                      <polyline points="6 14 12 8 18 14" />
                    ) : (
                      <polyline points="6 10 12 16 18 10" />
                    )}
                  </svg>
                  {btcDelta}
                </span>
              )}
            </div>
          )}
        </div>

        <h1
          className="reveal"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(48px, 10vw, 144px)',
            lineHeight: 0.93,
            letterSpacing: '-0.04em',
            color: 'var(--ink)',
            marginBottom: 32,
          }}
        >
          {headlineLine1}<br />
          {' '}
          <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>{headlineItalic}</em>.
        </h1>

        <ul
          className="hero-checklist"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            maxWidth: 560,
          }}
        >
          {subtitleLines.map((line, i) => (
            <li
              key={i}
              className="reveal hero-checklist-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px 10px 12px',
                background: 'rgba(168, 224, 99, 0.10)',
                border: '1px solid rgba(168, 224, 99, 0.28)',
                borderRadius: 14,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transitionDelay: `${80 + i * 90}ms`,
                boxShadow: '0 4px 18px -10px rgba(10,22,40,0.12)',
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--mint-400)',
                  border: '1.5px solid var(--navy-900)',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 4px 12px -4px rgba(168,224,99,0.6)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A1628" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(12.5px, 1.3vw, 14.5px)',
                  color: 'var(--navy-900)',
                  lineHeight: 1.4,
                  letterSpacing: '-0.005em',
                }}
              >
                {line}
              </span>
            </li>
          ))}
        </ul>

        <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

        <div
          className="reveal"
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            flexWrap: 'wrap',
            transitionDelay: '160ms',
          }}
        >
          <a href={primary.href ?? '#plans'} className="btn-primary">
            <span className="dot" />
            {primary.label ?? 'Start Mining'} <span>→</span>
          </a>
          <a href={ghost.href ?? '#plans'} className="btn-ghost">{ghost.label ?? 'View Plans'}</a>

          <div
            className="mono"
            style={{ marginLeft: 16, color: 'var(--navy-500)', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'block', flexShrink: 0 }} />
              <span style={{
                position: 'absolute', inset: -4, borderRadius: '50%',
                border: '2px solid #22c55e',
                animation: 'pulseRing 1.6s infinite',
              }} />
            </span>
            {liveBadgeText}
          </div>
        </div>

        <div
          className="reveal"
          style={{
            display: 'flex',
            gap: 'clamp(20px, 4vw, 48px)',
            marginTop: 64,
            paddingTop: 40,
            borderTop: '1px solid rgba(10,22,40,0.12)',
            flexWrap: 'wrap',
            transitionDelay: '240ms',
          }}
        >
          {trustItems.map((t, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(22px, 3vw, 32px)',
                  color: 'var(--ink)',
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {t.value}
              </div>
              <div className="mono" style={{ color: 'var(--navy-500)', fontSize: 10 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      <HeroMiner />

      <div
        className="float-coin hide-mobile"
        style={{ position: 'absolute', bottom: '20%', left: '4%', zIndex: 2, animationDelay: '1s' }}
      >
        <div className="coin" style={{ width: 54, height: 54, fontSize: 16 }}>BTC</div>
      </div>
      <div
        className="float-coin hide-mobile"
        style={{ position: 'absolute', top: '38%', left: '15%', zIndex: 2, animationDelay: '2s' }}
      >
        <div className="coin" style={{ width: 42, height: 42, fontSize: 13 }}>ETH</div>
      </div>
    </section>
  )
}
