'use client'

import { useEffect, useRef } from 'react'

interface InnerHeroProps {
  tagNum: string
  tagLabel: string
  headline: string
  italicWord: string
  mono?: string
  bgVariant?: 'cream' | 'navy' | 'mint'
}

export default function InnerHero({ tagNum, tagLabel, headline, italicWord, mono, bgVariant = 'cream' }: InnerHeroProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal')
    if (!els) return
    // Immediately mark in-view hero elements visible; use rootMargin for below-fold
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) } }),
      { threshold: 0, rootMargin: '0px 0px 0px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const bgMap = { cream: 'var(--cream)', navy: 'var(--navy-900)', mint: 'var(--mint-100)' }
  const colorMap = { cream: 'var(--ink)', navy: 'var(--cream)', mint: 'var(--ink)' }

  return (
    <section
      ref={ref}
      style={{
        paddingTop: 'clamp(120px,15vw,180px)',
        paddingBottom: 'clamp(60px,8vw,100px)',
        paddingLeft: 'clamp(24px,5vw,80px)',
        paddingRight: 'clamp(24px,5vw,80px)',
        background: bgMap[bgVariant],
        color: colorMap[bgVariant],
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative dot grid */}
      <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: bgVariant === 'navy' ? 0.08 : 0.12 }} />

      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 480, height: 480,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--mint-400) 0%, transparent 70%)',
        opacity: bgVariant === 'navy' ? 0.2 : 0.3,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
        <div
          className="reveal"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: bgVariant === 'navy' ? 'var(--mint-300)' : 'var(--navy-500)',
            marginBottom: 28,
          }}
        >
          <span style={{ color: 'var(--mint-400)', fontSize: 11 }}>{tagNum}</span>
          <span style={{ width: 32, height: 1, background: 'currentColor', opacity: 0.3 }} />
          {tagLabel}
        </div>

        <h1
          className="reveal"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(52px,10vw,140px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 0.94,
            transitionDelay: '80ms',
          }}
        >
          {headline}<br />
          <em style={{ fontStyle: 'italic', color: 'var(--mint-400)' }}>{italicWord}</em>
        </h1>

        {mono && (
          <p
            className="reveal mono"
            style={{
              marginTop: 'clamp(20px,3vw,32px)',
              color: bgVariant === 'navy' ? 'rgba(251,251,243,0.45)' : 'var(--navy-300)',
              fontSize: 12,
              transitionDelay: '160ms',
            }}
          >
            // {mono}
          </p>
        )}
      </div>
    </section>
  )
}
