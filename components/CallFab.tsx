'use client'

import { useEffect, useState } from 'react'
import { fetchSiteSettings, DEFAULT_CONTACT, digitsOnly, type SiteContact } from '@/lib/siteSettings'

export default function CallFab({ contact: contactProp }: { contact?: SiteContact }) {
  const [contact, setContact] = useState<SiteContact | null>(contactProp ?? null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (contactProp) return
    fetchSiteSettings().then((s) => setContact(s.contact ?? {}))
  }, [contactProp])

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 360)
    return () => window.clearTimeout(t)
  }, [])

  const display = contact?.salesPhone || DEFAULT_CONTACT.salesPhone
  const digits = digitsOnly(display).replace(/^0+/, '')
  if (!digits) return null

  const href = `tel:${digits}`

  return (
    <>
      <a
        href={href}
        aria-label={`Call us — ${display}`}
        title={`Call ${display}`}
        className="call-fab"
        style={{
          position: 'fixed',
          right: 'clamp(16px, 3vw, 28px)',
          // Stacked above the WhatsApp FAB (which is 58px tall + ~12px gap)
          bottom: 'calc(clamp(16px, 3vw, 28px) + 70px)',
          zIndex: 90,
          width: 58,
          height: 58,
          borderRadius: 999,
          background: 'var(--navy-900)',
          color: 'var(--mint-300)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          boxShadow:
            '0 12px 28px -8px rgba(10,22,40,0.55), 0 6px 16px -6px rgba(10,22,40,0.30)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.92)',
          transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s ease',
        }}
      >
        {/* Outer ping ring — mint, distinct from WhatsApp's green */}
        <span aria-hidden className="call-ping" />
        {/* Phone receiver glyph */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: 'relative', zIndex: 1 }}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>

      <style>{`
        @keyframes callPing {
          0%   { transform: scale(0.85); opacity: 0.45; }
          70%  { transform: scale(1.6);  opacity: 0; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
        .call-ping {
          position: absolute;
          inset: -4px;
          border-radius: 999px;
          background: var(--mint-400);
          opacity: 0.35;
          animation: callPing 2.6s cubic-bezier(0,0,0.2,1) infinite;
          animation-delay: 0.6s;
          pointer-events: none;
        }
        .call-fab:hover {
          transform: translateY(-2px) scale(1.04) !important;
          box-shadow:
            0 16px 36px -8px rgba(10,22,40,0.65),
            0 8px 22px -6px rgba(10,22,40,0.30) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .call-ping { animation: none; opacity: 0.25; }
        }
        /* Desktop already has the Call CTA in the navbar — hide the FAB above tablet */
        @media (min-width: 769px) {
          .call-fab { display: none !important; }
        }
        @media (max-width: 480px) {
          .call-fab { width: 54px !important; height: 54px !important; }
        }
      `}</style>
    </>
  )
}
