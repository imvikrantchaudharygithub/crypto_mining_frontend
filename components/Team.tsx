'use client'

import { useEffect, useRef, useState } from 'react'

export type TeamMember = {
  _id?: string
  name: string
  role: string
  bio?: string
  avatar?: string
  linkedin?: string
  twitter?: string
  email?: string
  sortOrder?: number
  status?: string
}

type TeamSectionData = {
  visible?: boolean
  sectionTag?: string
  headlineLine1?: string
  headlineItalic?: string
  asideText?: string
} | null

const DEFAULT_TEAM: TeamMember[] = [
  {
    name: 'Vikrant Chaudhary',
    role: 'Founder & CEO',
    bio: 'Built the first hashrate desk in India. 10+ years scaling mining infrastructure across two continents.',
    avatar: '',
    linkedin: '#',
    twitter: '#',
    email: 'vikrant@cryptominingmiles.com',
  },
  {
    name: 'Aarav Mehta',
    role: 'Head of Facility',
    bio: 'Runs the Tier-3 site — power, cooling, uptime. Ex-data-center engineer with a thing for clean racks.',
    avatar: '',
    linkedin: '#',
    twitter: '',
    email: 'aarav@cryptominingmiles.com',
  },
  {
    name: 'Saanvi Rao',
    role: 'Performance Desk',
    bio: 'Watches difficulty, pool latency, and payout math so you don\'t have to.',
    avatar: '',
    linkedin: '',
    twitter: '#',
    email: 'saanvi@cryptominingmiles.com',
  },
  {
    name: 'Kabir Singh',
    role: 'Hardware Lead',
    bio: 'Sources, tests, and rebuilds every ASIC before it hits the rack. Has personally racked over 4,000 units.',
    avatar: '',
    linkedin: '#',
    twitter: '#',
    email: '',
  },
  {
    name: 'Mira Iyer',
    role: 'Treasury & Payouts',
    bio: 'Owns the on-chain payout pipeline — reconciles every block, every customer, every 24 hours.',
    avatar: '',
    linkedin: '#',
    twitter: '',
    email: 'mira@cryptominingmiles.com',
  },
  {
    name: 'Rohan Banerjee',
    role: 'Customer Desk',
    bio: 'First voice on the phone, last voice before you sign. Treats every contract like it\'s his own money.',
    avatar: '',
    linkedin: '#',
    twitter: '#',
    email: 'rohan@cryptominingmiles.com',
  },
]

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function InitialsAvatar({ name }: { name: string }) {
  return (
    <div
      aria-hidden
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        background: 'linear-gradient(140deg, var(--mint-100) 0%, var(--mint-200) 100%)',
        display: 'grid',
        placeItems: 'center',
        borderRadius: 22,
        border: '1px solid rgba(10,22,40,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 14,
          left: 16,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(10,22,40,0.45)',
        }}
      >
        miles · team
      </span>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(48px, 7vw, 88px)',
          letterSpacing: '-0.04em',
          color: 'var(--navy-900)',
          lineHeight: 1,
        }}
      >
        {initialsFromName(name)}
      </span>
    </div>
  )
}

// ─── Brand glyphs — monochrome SVGs, sized 16px, tint via currentColor ──
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  )
}

function GmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function SocialChip({
  href,
  ariaLabel,
  icon,
}: {
  href: string
  ariaLabel: string
  icon: React.ReactNode
}) {
  const isExternal = href.startsWith('http')
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
      title={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        color: 'var(--navy-900)',
        background: 'rgba(10,22,40,0.04)',
        border: '1px solid rgba(10,22,40,0.10)',
        borderRadius: 999,
        textDecoration: 'none',
        transition: 'background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--navy-900)'
        e.currentTarget.style.borderColor = 'var(--navy-900)'
        e.currentTarget.style.color = 'var(--mint-300)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(10,22,40,0.04)'
        e.currentTarget.style.borderColor = 'rgba(10,22,40,0.10)'
        e.currentTarget.style.color = 'var(--navy-900)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {icon}
    </a>
  )
}

function isGmail(email: string): boolean {
  return /@gmail\.com\s*$/i.test(email.trim())
}

export default function Team({
  data,
  members,
}: {
  data?: TeamSectionData
  members?: TeamMember[]
}) {
  const ref = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

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

  // Slider position tracking — uses scroll math so it works for any cards-per-view
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const update = () => {
      const a = grid.children[0] as HTMLElement | undefined
      const b = grid.children[1] as HTMLElement | undefined
      if (!a) return
      const step = b ? b.offsetLeft - a.offsetLeft : a.offsetWidth
      if (step > 0) setActiveIdx(Math.max(0, Math.round(grid.scrollLeft / step)))
      setAtStart(grid.scrollLeft <= 4)
      setAtEnd(grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4)
    }

    update()
    grid.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      grid.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [members])

  const scrollByStep = (direction: 1 | -1) => {
    const grid = gridRef.current
    if (!grid) return
    const a = grid.children[0] as HTMLElement | undefined
    const b = grid.children[1] as HTMLElement | undefined
    if (!a) return
    const step = b ? b.offsetLeft - a.offsetLeft : a.offsetWidth
    grid.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  const goToCard = (i: number) => {
    const grid = gridRef.current
    if (!grid) return
    const card = grid.children[i] as HTMLElement | undefined
    if (!card) return
    grid.scrollTo({ left: card.offsetLeft - grid.offsetLeft, behavior: 'smooth' })
  }

  if (data?.visible === false) return null

  const sectionTag     = data?.sectionTag     ?? '07 / our team'
  const headlineLine1  = data?.headlineLine1  ?? 'The people behind'
  const headlineItalic = data?.headlineItalic ?? 'the rigs.'
  const asideText      = data?.asideText      ?? 'Engineers, operators, and analysts running our Tier-3 facility 24/7. Real people, real shifts — not a faceless brand.'
  const TEAM = members && members.length > 0 ? members : DEFAULT_TEAM

  return (
    <section
      id="team"
      ref={ref}
      className="cs-cream"
      style={{
        padding: 'clamp(80px,10vw,160px) clamp(24px,5vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header block — headline left, aside right */}
        <div
          className="team-head"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: 'clamp(32px,5vw,80px)',
            alignItems: 'end',
            marginBottom: 'clamp(56px,7vw,96px)',
          }}
        >
          <div>
            <div className="section-tag reveal" style={{ marginBottom: 24 }}>{sectionTag}</div>
            <h2
              className="reveal"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px,7.5vw,104px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 0.96,
                transitionDelay: '80ms',
                margin: 0,
              }}
            >
              {headlineLine1}<br />
              <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>{headlineItalic}</em>
            </h2>
          </div>

          <div className="reveal" style={{ transitionDelay: '160ms' }}>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                color: 'var(--navy-500)',
                maxWidth: 420,
                margin: 0,
              }}
            >
              {asideText}
            </p>

            {/* Desktop arrow controls */}
            <div className="team-controls" aria-label="Team slider controls">
              <button
                type="button"
                className="team-arrow"
                onClick={() => scrollByStep(-1)}
                disabled={atStart}
                aria-label="Previous team members"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <span className="mono team-counter">
                {String(Math.min(activeIdx + 1, TEAM.length)).padStart(2, '0')} <span style={{ opacity: 0.35 }}>/ {String(TEAM.length).padStart(2, '0')}</span>
              </span>
              <button
                type="button"
                className="team-arrow"
                onClick={() => scrollByStep(1)}
                disabled={atEnd}
                aria-label="Next team members"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Slider — 3 cards desktop, 2 tablet, 1 mobile */}
        <div ref={gridRef} className="team-grid">
          {TEAM.map((m, i) => {
            const idx = String(i + 1).padStart(2, '0')
            const socials: { key: string; ariaLabel: string; href: string; icon: React.ReactNode }[] = []
            if (m.linkedin) {
              socials.push({ key: 'li', ariaLabel: `${m.name} on LinkedIn`, href: m.linkedin, icon: <LinkedInIcon /> })
            }
            if (m.twitter) {
              socials.push({ key: 'x', ariaLabel: `${m.name} on X`, href: m.twitter, icon: <XIcon /> })
            }
            if (m.email) {
              const gmail = isGmail(m.email)
              socials.push({
                key: 'mail',
                ariaLabel: gmail ? `Email ${m.name} on Gmail` : `Email ${m.name}`,
                href: `mailto:${m.email}`,
                icon: gmail ? <GmailIcon /> : <MailIcon />,
              })
            }

            return (
              <article
                key={m._id ?? `${m.name}-${i}`}
                className="reveal team-card"
                style={{
                  transitionDelay: `${i * 80}ms`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                {/* Avatar */}
                <div className="team-avatar-wrap" style={{ position: 'relative' }}>
                  {m.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.avatar}
                      alt={m.name}
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover',
                        borderRadius: 22,
                        border: '1px solid rgba(10,22,40,0.08)',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <InitialsAvatar name={m.name} />
                  )}
                  <span
                    className="mono"
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 16,
                      background: 'rgba(251,251,243,0.92)',
                      color: 'var(--navy-900)',
                      padding: '4px 8px',
                      borderRadius: 999,
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      border: '1px solid rgba(10,22,40,0.06)',
                    }}
                  >
                    {idx}
                  </span>
                </div>

                {/* Identity */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(20px, 1.6vw, 24px)',
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      lineHeight: 1.12,
                      color: 'var(--navy-900)',
                      margin: 0,
                    }}
                  >
                    {m.name}
                  </h3>
                  <p
                    className="mono"
                    style={{
                      marginTop: 6,
                      fontSize: 11,
                      letterSpacing: '0.10em',
                      textTransform: 'uppercase',
                      color: 'var(--mint-500)',
                    }}
                  >
                    {m.role}
                  </p>
                </div>

                {/* Bio */}
                {m.bio && (
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: 'var(--navy-700)',
                      maxWidth: 360,
                      margin: 0,
                    }}
                  >
                    {m.bio}
                  </p>
                )}

                {/* Socials */}
                {socials.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
                    {socials.map((s) => (
                      <SocialChip key={s.key} href={s.href} ariaLabel={s.ariaLabel} icon={s.icon} />
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {/* Mobile slider dots */}
        <div className="team-dots" role="tablist" aria-label="Team carousel">
          {TEAM.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={activeIdx === i}
              aria-label={`Go to team member ${i + 1}`}
              onClick={() => goToCard(i)}
              className={activeIdx === i ? 'team-dot is-active' : 'team-dot'}
            />
          ))}
        </div>
      </div>

      <style>{`
        .team-grid {
          --team-gap: 24px;
          display: flex;
          gap: var(--team-gap);
          overflow-x: auto;
          overflow-y: visible;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 0 8px;
        }
        .team-grid::-webkit-scrollbar { display: none; }
        .team-grid .team-card {
          flex: 0 0 calc((100% - 2 * var(--team-gap)) / 3);
          max-width: calc((100% - 2 * var(--team-gap)) / 3);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        .team-avatar-wrap {
          transition: transform 0.4s cubic-bezier(.2,.8,.2,1);
        }
        .team-card:hover .team-avatar-wrap {
          transform: translateY(-4px);
        }

        /* Controls — desktop only */
        .team-controls {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 28px;
        }
        .team-arrow {
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: var(--cream);
          color: var(--navy-900);
          border: 1px solid rgba(10,22,40,0.14);
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
        }
        .team-arrow:hover:not(:disabled) {
          background: var(--navy-900);
          color: var(--mint-300);
          border-color: var(--navy-900);
          transform: translateY(-1px);
        }
        .team-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .team-counter {
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--navy-900);
          min-width: 56px;
          text-align: center;
        }

        /* Dots — mobile only */
        .team-dots { display: none; }
        .team-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: rgba(10,22,40,0.18);
          border: 0;
          padding: 0;
          cursor: pointer;
          transition: width 0.25s ease, background 0.25s ease;
        }
        .team-dot.is-active {
          width: 24px;
          background: var(--navy-900);
        }

        /* Tablet — 2 cards per view */
        @media (max-width: 1023px) {
          .team-grid .team-card {
            flex-basis: calc((100% - var(--team-gap)) / 2);
            max-width: calc((100% - var(--team-gap)) / 2);
          }
        }

        /* Mobile — 1 card per view, edge-to-edge, arrows hidden, dots shown */
        @media (max-width: 768px) {
          .team-head {
            grid-template-columns: 1fr !important;
            align-items: start !important;
          }
          .team-controls { display: none; }
          .team-grid {
            --team-gap: 16px;
            margin: 0 calc(-1 * clamp(24px, 5vw, 80px));
            padding: 4px clamp(24px, 5vw, 80px);
            scroll-padding-inline: clamp(24px, 5vw, 80px);
          }
          .team-grid .team-card {
            flex: 0 0 calc(100vw - 2 * clamp(24px, 5vw, 80px));
            max-width: calc(100vw - 2 * clamp(24px, 5vw, 80px));
            scroll-snap-align: start;
          }
          .team-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 32px;
          }
        }
      `}</style>
    </section>
  )
}
