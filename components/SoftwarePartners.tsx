'use client'

import { useEffect, useRef } from 'react'

export type SoftwarePartner = {
  _id?: string
  name: string
  tagline?: string
  logo?: string
  website?: string
  sortOrder?: number
  status?: string
}

type SectionData = {
  visible?: boolean
  sectionTag?: string
  headlineLine1?: string
  headlineItalic?: string
  asideText?: string
} | null

const DEFAULT_PARTNERS: SoftwarePartner[] = [
  { name: 'Vnish.in',  tagline: 'Custom Firmware', website: 'https://vnish.in',     logo: '' },
  { name: 'Hiveon',    tagline: 'GPU Mining',      website: 'https://hiveon.com',   logo: '' },
  { name: 'ViaBtc',    tagline: 'Mining Pool',     website: 'https://viabtc.com',   logo: '' },
  { name: 'F2Pool',    tagline: 'Mining Pool',     website: 'https://www.f2pool.com', logo: '' },
  { name: 'Antpool',   tagline: 'BTC Pool',        website: 'https://antpool.com',  logo: '' },
  { name: 'Braiins OS', tagline: 'ASIC Firmware',  website: 'https://braiins.com',  logo: '' },
]

function PartnerCard({ p, i }: { p: SoftwarePartner; i: number }) {
  const isLink = !!p.website
  const Tag = (isLink ? 'a' : 'div') as 'a' | 'div'
  const linkProps = isLink
    ? { href: p.website, target: '_blank' as const, rel: 'noopener noreferrer' as const }
    : {}

  return (
    <Tag
      {...(linkProps as Record<string, unknown>)}
      className="reveal partner-card"
      style={{
        transitionDelay: `${i * 70}ms`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        minHeight: 108,
        padding: '20px 22px',
        background: 'rgba(251,251,243,0.85)',
        border: '1px solid rgba(10,22,40,0.06)',
        borderRadius: 20,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px -16px rgba(10,22,40,0.16)',
        textDecoration: 'none',
        color: 'var(--navy-900)',
        cursor: isLink ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label={isLink ? `${p.name} — opens in a new tab` : p.name}
    >
      {p.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.logo}
          alt={p.name}
          style={{
            maxHeight: 44,
            maxWidth: '70%',
            objectFit: 'contain',
            display: 'block',
            filter: 'none',
          }}
        />
      ) : (
        <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--navy-900)',
            }}
          >
            {p.name}
          </div>
          {p.tagline && (
            <div
              className="mono"
              style={{
                marginTop: 4,
                fontSize: 9.5,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--navy-500)',
              }}
            >
              {p.tagline}
            </div>
          )}
        </div>
      )}
    </Tag>
  )
}

export default function SoftwarePartners({
  data,
  partners,
}: {
  data?: SectionData
  partners?: SoftwarePartner[]
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.1 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  if (data?.visible === false) return null

  const sectionTag     = data?.sectionTag     ?? '03 / partners'
  const headlineLine1  = data?.headlineLine1  ?? 'Software'
  const headlineItalic = data?.headlineItalic ?? 'Partners.'
  const asideText      = data?.asideText      ?? 'The firmware, pools, and tooling we trust to run our facility — and you can use the same stack on rigs you buy from us.'
  const LIST = partners && partners.length > 0 ? partners : DEFAULT_PARTNERS

  return (
    <section
      id="software-partners"
      ref={ref}
      className="partners-section"
      style={{
        padding: 'clamp(80px,10vw,160px) clamp(24px,5vw,80px)',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(80% 60% at 100% 0%, rgba(168,224,99,0.10), transparent 55%),' +
          'linear-gradient(135deg, var(--cream-2) 0%, #FBFBF3 60%, #F0F3E5 100%)',
      }}
    >
      {/* Dot grid texture overlay — soft brand reinforcement */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(10,22,40,0.06) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="partners-grid">
          {/* Left column — headline + aside */}
          <div className="partners-head">
            <div className="section-tag reveal" style={{ marginBottom: 22 }}>
              {sectionTag}
            </div>
            <h2
              className="reveal"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 6vw, 88px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 0.96,
                color: 'var(--navy-900)',
                margin: 0,
                transitionDelay: '80ms',
              }}
            >
              {headlineLine1}<br />
              <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>{headlineItalic}</em>
            </h2>
            <p
              className="reveal"
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: 'var(--navy-500)',
                maxWidth: 380,
                marginTop: 22,
                marginBottom: 0,
                transitionDelay: '160ms',
              }}
            >
              {asideText}
            </p>
          </div>

          {/* Right column — logo cards in a responsive grid */}
          <div className="partners-list-wrap">
            {/* Divider line — runs along the top edge of the logo column, matches the reference design */}
            <div
              aria-hidden
              className="reveal"
              style={{
                height: 1,
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(10,22,40,0.18) 12%, rgba(10,22,40,0.18) 88%, transparent 100%)',
                marginBottom: 40,
                transitionDelay: '120ms',
              }}
            />
            <div className="partners-list">
              {LIST.map((p, i) => (
                <PartnerCard key={p._id ?? `${p.name}-${i}`} p={p} i={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .partners-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 2fr);
          gap: clamp(40px, 6vw, 96px);
          align-items: start;
        }
        .partners-list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(14px, 1.6vw, 22px);
        }
        .partner-card {
          transition:
            opacity 0.9s cubic-bezier(.2,.8,.2,1),
            transform 0.35s cubic-bezier(.2,.8,.2,1),
            background 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.3s ease;
        }
        .partner-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.95);
          border-color: rgba(168,224,99,0.55);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.7) inset,
            0 14px 30px -16px rgba(168,224,99,0.45),
            0 6px 18px -10px rgba(10,22,40,0.18);
        }
        .partner-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(120% 80% at 100% 0%, rgba(168,224,99,0.12), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .partner-card:hover::after { opacity: 1; }

        @media (max-width: 1023px) {
          .partners-grid {
            grid-template-columns: 1fr;
          }
          .partners-list {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 720px) {
          .partners-list {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
          .partner-card {
            min-height: 92px !important;
            padding: 16px 18px !important;
            border-radius: 16px !important;
          }
        }
        @media (max-width: 420px) {
          .partners-list {
            grid-template-columns: 1fr;
          }
        }
      `,
        }}
      />
    </section>
  )
}
