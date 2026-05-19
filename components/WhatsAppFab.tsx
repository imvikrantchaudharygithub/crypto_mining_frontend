'use client'

import { useEffect, useState } from 'react'
import { fetchSiteSettings, DEFAULT_CONTACT, digitsOnly, type SiteContact } from '@/lib/siteSettings'

export default function WhatsAppFab({ contact: contactProp }: { contact?: SiteContact }) {
  const [contact, setContact] = useState<SiteContact | null>(contactProp ?? null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (contactProp) return
    fetchSiteSettings().then((s) => setContact(s.contact ?? {}))
  }, [contactProp])

  // Fade in after first paint so the button doesn't punch into the hero
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 300)
    return () => window.clearTimeout(t)
  }, [])

  const enabled = contact?.whatsappEnabled !== false
  if (!enabled) return null

  const number = digitsOnly(contact?.whatsappNumber || DEFAULT_CONTACT.whatsappNumber)
  if (!number) return null

  const message = contact?.whatsappMessage || DEFAULT_CONTACT.whatsappMessage
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
        className="wa-fab"
        style={{
          position: 'fixed',
          right: 'clamp(16px, 3vw, 28px)',
          bottom: 'clamp(16px, 3vw, 28px)',
          zIndex: 90,
          width: 58,
          height: 58,
          borderRadius: 999,
          background: '#25D366',
          color: '#FFFFFF',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          boxShadow:
            '0 12px 28px -8px rgba(37,211,102,0.55), 0 6px 16px -6px rgba(10,22,40,0.25)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.92)',
          transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s ease',
        }}
      >
        {/* Outer ping ring */}
        <span aria-hidden className="wa-ping" />
        {/* Brand glyph */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ position: 'relative', zIndex: 1 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>

      <style>{`
        @keyframes waPing {
          0%   { transform: scale(0.85); opacity: 0.45; }
          70%  { transform: scale(1.6);  opacity: 0; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
        .wa-ping {
          position: absolute;
          inset: -4px;
          border-radius: 999px;
          background: #25D366;
          opacity: 0.35;
          animation: waPing 2.6s cubic-bezier(0,0,0.2,1) infinite;
          pointer-events: none;
        }
        .wa-fab:hover {
          transform: translateY(-2px) scale(1.04) !important;
          box-shadow:
            0 16px 36px -8px rgba(37,211,102,0.65),
            0 8px 22px -6px rgba(10,22,40,0.30) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .wa-ping { animation: none; opacity: 0.25; }
        }
        @media (max-width: 480px) {
          .wa-fab { width: 54px !important; height: 54px !important; }
        }
      `}</style>
    </>
  )
}
