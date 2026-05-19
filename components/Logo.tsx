import React from 'react'

/* ────────────────────────────────────────────────────────────
   ICON MARK — pickaxe + 4 coins.
   Standalone, scalable, viewBox 0 0 100 80.
   `tone` controls stroke color; default navy.
   ──────────────────────────────────────────────────────────── */
export function LogoMark({
  size = 36,
  tone = 'var(--navy-900)',
  className,
  style,
}: {
  size?: number
  tone?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label="Crypto Mining Miles icon"
    >
      {/* PICKAXE — left side */}
      <g stroke={tone} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Pick head (curved double-edge) */}
        <path d="M 8 22 Q 22 6 42 18" />
        {/* Pick collar (vertical band over the head's center) */}
        <path d="M 22 8 L 22 22" />
        <path d="M 30 12 L 30 26" />
        {/* Handle */}
        <path d="M 26 18 L 38 56" />
        {/* Handle grip (small notches near bottom) */}
        <path d="M 32 44 L 36 42" />
        <path d="M 35 52 L 39 50" />
      </g>

      {/* 4 COINS — right side, 2×2 grid */}
      <g stroke={tone} strokeWidth={2.6} fill="none">
        {/* Top row */}
        <circle cx={62} cy={16} r={7} />
        <circle cx={80} cy={16} r={7} />
        {/* Bottom row */}
        <circle cx={62} cy={34} r={7} />
        <circle cx={80} cy={34} r={7} />
        {/* Inner marks — stylized "M" notch */}
        <path d="M 59 18 L 62 14 L 65 18" strokeWidth={2} />
        <path d="M 77 18 L 80 14 L 83 18" strokeWidth={2} />
        <path d="M 59 36 L 62 32 L 65 36" strokeWidth={2} />
        <path d="M 77 36 L 80 32 L 83 36" strokeWidth={2} />
      </g>
    </svg>
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
