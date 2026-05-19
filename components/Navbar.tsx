'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoMark } from '@/components/Logo'
import { fetchSiteSettings, DEFAULT_CONTACT, digitsOnly, type SiteContact } from '@/lib/siteSettings'

const DEFAULT_NAV_LINKS = [
  { label: 'Shop',          href: '/shop' },
  { label: 'Profitability', href: '/profitability' },
  { label: 'Service',       href: '/service-request' },
  { label: 'Warranty',      href: '/warranty' },
  { label: 'Track Ticket',  href: '/track-ticket' },
  { label: 'Contact',       href: '/contact' },
]

export default function Navbar({
  navLinks,
  contact: contactProp,
}: {
  navLinks?: { label: string; href: string }[]
  contact?: SiteContact
}) {
  const NAV_LINKS = navLinks && navLinks.length > 0 ? navLinks : DEFAULT_NAV_LINKS
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contact, setContact] = useState<SiteContact | null>(contactProp ?? null)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    if (contactProp) return
    fetchSiteSettings().then((s) => setContact(s.contact ?? {}))
  }, [contactProp])

  const callLabel = contact?.salesPhoneLabel || DEFAULT_CONTACT.salesPhoneLabel
  const callDisplay = contact?.salesPhone || DEFAULT_CONTACT.salesPhone
  const callHref = `tel:${digitsOnly(callDisplay).replace(/^0+/, '')}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const logoHref = isHome ? '#' : '/'

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          width: 'calc(100% - 48px)',
          maxWidth: 1360,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(10,22,40,0.92)' : 'rgba(10,22,40,0.80)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(168,224,99,0.18)',
          borderRadius: 999,
          boxShadow: scrolled ? '0 8px 32px -8px rgba(0,0,0,0.35)' : 'none',
          transition: 'background 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Logo */}
        <Link href={logoHref} style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <span style={{
            display: 'grid', placeItems: 'center',
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--mint-400)',
            border: '1px solid var(--mint-300)',
            flexShrink: 0,
          }}>
            <LogoMark size={28} tone="var(--navy-900)" />
          </span>
          <span style={{ lineHeight: 1.1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--mint-300)', letterSpacing: '-0.01em' }}>
              Crypto Mining Miles
            </span>
            <span className="mono" style={{ color: 'var(--mint-500)', marginTop: 2, fontSize: 9.5, opacity: 0.75 }}>
              redefined mining · est 2017
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hide-mobile">
          {isHome && (
            <>
              {['Stats','Why Us','FAQ'].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(/\s/g,'-')}`}
                  className="mono"
                  style={{
                    color: 'var(--mint-300)', textDecoration: 'none',
                    padding: '8px 12px', borderRadius: 999, fontSize: 10.5,
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,224,99,0.12)'; e.currentTarget.style.color = 'var(--mint-200)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--mint-300)' }}
                >
                  {label}
                </a>
              ))}
              <span style={{ width: 1, height: 18, background: 'rgba(168,224,99,0.22)', margin: '0 6px' }} />
            </>
          )}
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.label}
                href={l.href}
                className="mono"
                style={{
                  color: active ? 'var(--mint-200)' : 'var(--mint-400)',
                  textDecoration: 'none',
                  padding: '7px 12px',
                  borderRadius: 999,
                  fontSize: 10.5,
                  background: active ? 'rgba(168,224,99,0.16)' : 'transparent',
                  transition: 'background 0.2s, color 0.2s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(168,224,99,0.10)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                {active && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--mint-500)', display: 'inline-block' }} />}
                {l.label}
              </Link>
            )
          })}
        </div>

        {/* Desktop CTA — Call Us */}
        <a
          href={callHref}
          className="btn-primary hide-mobile"
          style={{ padding: '10px 20px', fontSize: 10.5, gap: 8 }}
          aria-label={`${callLabel} — ${callDisplay}`}
          title={callDisplay}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {callLabel}
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            flexDirection: 'column',
            gap: 5,
          }}
          className="mobile-hamburger"
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 22, height: 2,
                background: 'var(--mint-300)',
                borderRadius: 2,
                transition: 'transform 0.3s, opacity 0.3s',
                transformOrigin: 'center',
                transform: menuOpen
                  ? i === 0 ? 'translateY(7px) rotate(45deg)'
                  : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                  : 'scaleX(0)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'var(--cream)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 32,
                color: pathname === l.href ? 'var(--mint-500)' : 'var(--ink)',
                textDecoration: 'none',
                padding: '10px 0',
                opacity: 0,
                animation: `fadeSlideUp 0.4s cubic-bezier(.2,.8,.2,1) ${i * 60}ms forwards`,
              }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={callHref}
            className="btn-primary"
            style={{ marginTop: 24, opacity: 0, animation: `fadeSlideUp 0.4s cubic-bezier(.2,.8,.2,1) 320ms forwards`, gap: 8 }}
            onClick={() => setMenuOpen(false)}
            aria-label={`${callLabel} — ${callDisplay}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {callLabel}
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-hamburger { display: flex !important; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
