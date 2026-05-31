import React from 'react'
import Image from 'next/image'

/* ────────────────────────────────────────────────────────────
   ICON MARK — pickaxe + 4 coins, rendered from transparent PNG.
   No chip background; the artwork floats freely on any surface.

   The PNG is cropped tight to the actual artwork (aspect 2.17:1) and
   has a fully transparent background. Two variants:
     • /cmmlogo.png        — navy ink for light surfaces (default)
     • /cmmlogo-light.png  — mint ink for dark surfaces (tone="light")

   `size` is treated as the HEIGHT; width auto-scales by aspect ratio.
   ──────────────────────────────────────────────────────────── */
const LOGO_ASPECT = 892 / 412 // 2.17:1 — derived from the cropped artwork

export function LogoMark({
  size = 28,
  tone,
  className,
  style,
}: {
  size?: number
  /** Pass "light" (or any mint/cream token) when sitting on a dark surface. */
  tone?: string
  className?: string
  style?: React.CSSProperties
}) {
  const isLight =
    tone === 'light' ||
    tone === 'var(--mint-300)' ||
    tone === 'var(--mint-400)' ||
    tone === 'var(--cream)'
  const src = isLight ? '/cmmlogo-light.png' : '/cmmlogo.png'
  const w = Math.round(size * LOGO_ASPECT)

  return (
    <Image
      src={src}
      alt="Crypto Mining Miles"
      width={w}
      height={size}
      priority
      sizes={`${w}px`}
      className={className}
      style={{
        display: 'block',
        height: size,
        width: w,
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

/* ────────────────────────────────────────────────────────────
   HORIZONTAL LOGO — icon + 2-line wordmark inline.
   Used in navbars, anywhere height-constrained.
   ──────────────────────────────────────────────────────────── */
export function LogoHorizontal({
  size = 40,
  tone = 'var(--navy-900)',
  textTone = 'var(--ink)',
  subTone = 'var(--navy-500)',
  showTagline = true,
  className,
  style,
}: {
  size?: number
  tone?: string
  textTone?: string
  subTone?: string
  showTagline?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        textDecoration: 'none',
        ...style,
      }}
    >
      <LogoMark size={size} tone={tone} />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: size * 0.36,
            letterSpacing: '-0.02em',
            color: textTone,
            whiteSpace: 'nowrap',
          }}
        >
          Crypto Mining Miles
        </span>
        {showTagline && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: Math.max(9, size * 0.24),
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: subTone,
              marginTop: 2,
            }}
          >
            redefined mining · est 2017
          </span>
        )}
      </span>
    </span>
  )
}

/* ────────────────────────────────────────────────────────────
   BADGE LOGO — pill version matching the source artwork.
   Mint background, navy rounded pill, mint wordmark inside.
   For hero areas, footer, splash screens.
   ──────────────────────────────────────────────────────────── */
export function LogoBadge({
  width = 360,
  showBg = true,
  className,
  style,
}: {
  width?: number
  showBg?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: showBg ? '32px 36px 22px' : 0,
        background: showBg ? 'var(--mint-100)' : 'transparent',
        borderRadius: showBg ? 24 : 0,
        width,
        ...style,
      }}
    >
      {/* Icon row */}
      <LogoMark size={width * 0.28} tone="var(--navy-900)" />

      {/* Pill wordmark */}
      <div
        style={{
          width: '100%',
          padding: `${width * 0.06}px ${width * 0.05}px`,
          background: 'var(--navy-900)',
          border: '4px solid var(--mint-300)',
          borderRadius: 18,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: width * 0.115,
            color: 'var(--mint-300)',
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
            textTransform: 'uppercase',
          }}
        >
          Crypto<br />
          Mining Miles
        </div>
      </div>

      {/* Tagline row */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 8px',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: width * 0.045,
          color: 'var(--navy-900)',
          letterSpacing: '-0.01em',
        }}
      >
        <span>redefined mining</span>
        <span>est 2017</span>
      </div>
    </div>
  )
}
