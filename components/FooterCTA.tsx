'use client'

import { useEffect, useRef } from 'react'
import { LogoMark } from '@/components/Logo'

type FooterCTAData = {
  visible?: boolean
  sectionTag?: string
  headlinePrefix?: string
  headlineItalic?: string
  cta?: { label?: string; href?: string }
  quickLinks?: { label: string; href: string }[]
  copyright?: string
  coordinates?: string
} | null

const DEFAULT_LINKS = [
  { label: 'Shop',          href: '/shop' },
  { label: 'Profitability', href: '/profitability' },
  { label: 'Service',       href: '/service-request' },
  { label: 'Track Ticket',  href: '/track-ticket' },
  { label: 'Contact',       href: '/contact' },
  { label: 'Privacy',       href: '#' },
  { label: 'Terms',         href: '#' },
]

export default function FooterCTA({ data }: { data?: FooterCTAData }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) } }),
      { threshold: 0, rootMargin: '0px 0px 9999px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  if (data?.visible === false) return null

  const sectionTag     = data?.sectionTag     ?? 'ready when you are'
  const headlinePrefix = data?.headlinePrefix ?? 'Start mining.'
  const headlineItalic = data?.headlineItalic ?? 'Today.'
  const ctaLabel       = data?.cta?.label     ?? 'Open my contract →'
  const ctaHref        = data?.cta?.href      ?? '#plans'
  const links          = data?.quickLinks && data.quickLinks.length > 0 ? data.quickLinks : DEFAULT_LINKS
  const copyright      = data?.copyright      ?? '© 2026 Crypto Mining Miles · redefined mining · est 2017'
  const coordinates    = data?.coordinates    ?? 'N 28°37′12″ · E 77°13′08″ · New Delhi facility'

  return (
    <footer
      ref={ref}
      style={{
        background: 'var(--navy-900)',
        color: 'var(--cream)',
        padding: 'clamp(80px,12vw,180px) clamp(24px,5vw,80px) 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.14 }} />

      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--mint-500) 0%, transparent 70%)',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <div
          className="reveal"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--mint-300)',
            marginBottom: 32,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mint-400)', display: 'inline-block' }} />
          {sectionTag}
        </div>

        <h2
          className="reveal"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px,12vw,168px)',
            fontWeight: 700,
            letterSpacing: '-0.05em',
            lineHeight: 0.92,
            marginBottom: 56,
            transitionDelay: '80ms',
          }}
        >
          {headlinePrefix}<br />
          <em style={{ fontStyle: 'italic', color: 'var(--mint-400)' }}>{headlineItalic}</em>
        </h2>

        <div className="reveal" style={{ transitionDelay: '160ms' }}>
          <a
            href={ctaHref}
            className="btn-primary"
            style={{
              background: 'var(--mint-400)',
              color: 'var(--navy-900)',
              padding: '20px 36px',
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            <span className="dot" style={{ background: 'var(--navy-900)' }} />
            {ctaLabel}
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(16px,3vw,40px)',
            marginTop: 56,
            flexWrap: 'wrap',
          }}
        >
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="mono"
              style={{
                color: 'rgba(251,251,243,0.45)',
                textDecoration: 'none',
                fontSize: 11,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--mint-300)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(251,251,243,0.45)')}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          maxWidth: 1280,
          margin: '60px auto 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'rgba(251,251,243,0.35)',
          paddingTop: 28,
          borderTop: '1px solid rgba(251,251,243,0.08)',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <LogoMark size={22} tone="var(--mint-300)" />
          {copyright}
        </span>
        <span>{coordinates}</span>
      </div>
    </footer>
  )
}
