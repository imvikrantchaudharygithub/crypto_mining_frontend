'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import InnerHero from '@/components/InnerHero'
import FooterCTA from '@/components/FooterCTA'

/**
 * Bitmain warranty lookup
 *   GET https://shop-repair.bitmain.com/api/warranty/getWarranty?serialNumber=<SN>
 *
 * Observed response shapes:
 *   not found    → { warranty: 0, haveWhiteList: "N", code: 0 }
 *   empty input  → { code: 1, message: "serialNumber is empty" }
 *   found        → { warranty: 346, warrantyEndDate: "2027-05-06 00:00:00",
 *                    haveWhiteList: "N" | "Y", code: 0 }
 *                  `warranty` is days remaining (authoritative).
 *                  `warrantyEndDate` is the expiry timestamp.
 *                  Some units may additionally return productModel / shipDate / status.
 */
const WARRANTY_API = 'https://shop-repair.bitmain.com/api/warranty/getWarranty'

type WarrantyResponse = {
  warranty?: number
  warrantyEndDate?: string
  haveWhiteList?: 'Y' | 'N' | string
  code?: number
  message?: string
  // optional / unknown fields the API may return on a positive lookup
  productModel?: string
  model?: string
  productName?: string
  shipDate?: string
  warrantyStartDate?: string
  warrantyExpireDate?: string
  expireDate?: string
  endDate?: string
  status?: string
  [k: string]: unknown
}

type LookupState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'found'; sn: string; data: WarrantyResponse }
  | { kind: 'not-found'; sn: string; data: WarrantyResponse }
  | { kind: 'error'; message: string }

const pick = (d: WarrantyResponse, ...keys: string[]): string | undefined => {
  for (const k of keys) {
    const v = (d as Record<string, unknown>)[k]
    if (typeof v === 'string' && v.trim()) return v
    if (typeof v === 'number') return String(v)
  }
  return undefined
}

const formatDate = (raw?: string): string | undefined => {
  if (!raw) return undefined
  // Bitmain returns "YYYY-MM-DD HH:mm:ss" — normalize to ISO for Safari compatibility.
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T')
  const d = new Date(normalized)
  if (Number.isNaN(d.getTime())) return raw
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

const daysBetween = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / 86_400_000)

export default function WarrantyPage() {
  const [sn, setSn] = useState('')
  const [state, setState] = useState<LookupState>({ kind: 'idle' })
  const inputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const revealRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const els = revealRef.current?.querySelectorAll('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0, rootMargin: '0px 0px 9999px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const submit = async () => {
    const clean = sn.trim()
    if (!clean) {
      setState({ kind: 'error', message: 'Enter the serial number printed on your miner.' })
      inputRef.current?.focus()
      return
    }
    setState({ kind: 'loading' })
    try {
      const res = await fetch(`${WARRANTY_API}?serialNumber=${encodeURIComponent(clean)}`, {
        method: 'GET',
        credentials: 'omit',
      })
      const text = await res.text()
      let data: WarrantyResponse = {}
      try {
        data = JSON.parse(text)
      } catch {
        setState({ kind: 'error', message: 'Unexpected response from the warranty service. Try again in a moment.' })
        return
      }
      if (data.code && data.code !== 0) {
        setState({ kind: 'error', message: data.message || 'Warranty lookup failed.' })
        return
      }
      const hasRecord =
        (typeof data.warranty === 'number' && data.warranty > 0) ||
        data.haveWhiteList === 'Y' ||
        !!pick(data, 'productModel', 'model', 'productName', 'warrantyEndDate', 'warrantyExpireDate', 'expireDate', 'endDate', 'shipDate')

      if (hasRecord) {
        setState({ kind: 'found', sn: clean, data })
      } else {
        setState({ kind: 'not-found', sn: clean, data })
      }
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    } catch {
      setState({ kind: 'error', message: 'Could not reach the warranty service. Check your connection and retry.' })
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <main>
      <Navbar />

      <InnerHero
        tagNum="06"
        tagLabel="warranty check"
        headline="Verify your"
        italicWord="miner."
        mono="real-time lookup · manufacturer database · serial-number indexed"
        bgVariant="cream"
      />

      <section
        ref={revealRef}
        style={{
          padding: 'clamp(48px,6vw,90px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)',
          background: 'var(--cream-2)',
          minHeight: '50vh',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          {/* Lookup card */}
          <div
            className="reveal warranty-card"
            style={{
              background: 'var(--cream)',
              border: '1px solid rgba(10,22,40,0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(24px,3vw,36px)',
              boxShadow: '0 12px 36px -18px rgba(10,22,40,0.18)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: -100,
                right: -80,
                width: 280,
                height: 280,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(168,224,99,0.22) 0%, rgba(168,224,99,0) 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--mint-500)', textTransform: 'uppercase' }}>
                serial number lookup
              </span>
              <span style={{ flex: 1, height: 1, background: 'rgba(10,22,40,0.08)' }} />
            </div>
            <h2
              style={{
                position: 'relative',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px,2.8vw,30px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 6,
                color: 'var(--ink)',
              }}
            >
              Enter your miner&apos;s serial number
            </h2>
            <p className="mono" style={{ position: 'relative', fontSize: 11, color: 'var(--navy-300)', marginBottom: 22, lineHeight: 1.6 }}>
              // 17-character code printed on the white sticker on the side or bottom of the unit
            </p>

            <div
              style={{
                position: 'relative',
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--navy-300)',
                    pointerEvents: 'none',
                    display: 'inline-flex',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <path d="M7 10v4M10 10v4M13 10v4M16 10v4" />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  value={sn}
                  onChange={(e) => setSn(e.target.value.toUpperCase())}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="e.g. BC1NK9DBABB0AAA00"
                  aria-label="Serial number"
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 46px',
                    borderRadius: 'var(--radius)',
                    border:
                      state.kind === 'error'
                        ? '1px solid #ef5350'
                        : '1px solid rgba(10,22,40,0.14)',
                    background: 'var(--cream)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                    letterSpacing: '0.04em',
                    color: 'var(--ink)',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--mint-400)'
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(168,224,99,0.18)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      state.kind === 'error' ? '#ef5350' : 'rgba(10,22,40,0.14)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
              <button
                onClick={submit}
                disabled={state.kind === 'loading'}
                className="btn-primary"
                style={{
                  padding: '16px 26px',
                  fontSize: 11,
                  opacity: state.kind === 'loading' ? 0.7 : 1,
                  cursor: state.kind === 'loading' ? 'wait' : 'pointer',
                }}
              >
                <span className="dot" />
                {state.kind === 'loading' ? 'Checking…' : 'Check Warranty'} <span>→</span>
              </button>
            </div>

            {state.kind === 'idle' && (
              <div
                className="reveal"
                style={{
                  marginTop: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  background: 'rgba(168,224,99,0.10)',
                  border: '1px solid var(--mint-200)',
                  borderRadius: 12,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mint-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--mint-500)', lineHeight: 1.5 }}>
                  Lookup pings the manufacturer in real time — typically returns in under 2 seconds.
                </span>
              </div>
            )}
          </div>

          {/* Result region */}
          <div ref={resultRef} style={{ marginTop: state.kind === 'idle' ? 0 : 28 }}>
            {state.kind === 'loading' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: 'clamp(20px,3vw,28px)',
                  background: 'var(--cream)',
                  border: '1px solid rgba(10,22,40,0.08)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {[60, 92, 70].map((w, i) => (
                  <div
                    key={i}
                    className="warranty-skeleton"
                    style={{ width: `${w}%`, height: i === 1 ? 26 : 14, borderRadius: 6 }}
                  />
                ))}
              </div>
            )}

            {state.kind === 'error' && (
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: '#ef5350',
                  padding: '14px 18px',
                  background: 'rgba(239,83,80,0.08)',
                  border: '1px solid rgba(239,83,80,0.2)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  animation: 'fadeSlideUp 0.35s cubic-bezier(.2,.8,.2,1) forwards',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {state.message}
              </div>
            )}

            {state.kind === 'not-found' && <NotFoundCard sn={state.sn} />}

            {state.kind === 'found' && <FoundCard sn={state.sn} data={state.data} />}
          </div>

          {/* Info grid */}
          <div
            className="reveal"
            style={{
              marginTop: 56,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            <InfoTile
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l9 4-9 4-9-4 9-4z" />
                  <path d="M3 6v6c0 4 4 7 9 7s9-3 9-7V6" />
                </svg>
              }
              title="Coverage period"
              body="Standard hardware warranty runs 180–365 days from ship date. Period and terms are set by the manufacturer."
            />
            <InfoTile
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              }
              title="Where to find SN"
              body="Look for a 17-character code starting with BC… on the white label, usually on the side or bottom panel."
            />
            <InfoTile
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              }
              title="Need RMA help?"
              body="If the unit is in-warranty and faulty, our team handles the entire RMA process — including shipping."
              cta={{ label: 'Open a service request →', href: '/service-request' }}
            />
          </div>

          <p
            className="mono"
            style={{
              marginTop: 32,
              textAlign: 'center',
              fontSize: 9.5,
              color: 'var(--navy-300)',
              lineHeight: 1.7,
            }}
          >
            // results are pulled live from the manufacturer. recently-shipped units may take 24h to appear in their index.
          </p>
        </div>
      </section>

      <FooterCTA />

      <style dangerouslySetInnerHTML={{ __html: WARRANTY_CSS }} />
    </main>
  )
}

function NotFoundCard({ sn }: { sn: string }) {
  return (
    <div
      style={{
        background: 'var(--cream)',
        border: '1px dashed rgba(10,22,40,0.18)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(24px,3vw,36px)',
        animation: 'fadeSlideUp 0.45s cubic-bezier(.2,.8,.2,1) forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <span
          aria-hidden
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(10,22,40,0.06)',
            color: 'var(--navy-500)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>
            No warranty record found
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--navy-300)', marginTop: 2 }}>
            // SN <span style={{ color: 'var(--ink)' }}>{sn}</span> is not in the manufacturer&apos;s database
          </div>
        </div>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
        {[
          'Double-check the 17-character serial — letters and digits look alike (0/O, 1/I).',
          'Newly-shipped units can take up to 24 hours to be indexed.',
          'For second-hand or refurbished units, warranty may have been transferred or void.',
        ].map((line, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              fontSize: 13,
              lineHeight: 1.55,
              color: 'var(--navy-500)',
              padding: '8px 12px',
              background: 'rgba(10,22,40,0.025)',
              borderRadius: 10,
            }}
          >
            <span style={{ color: 'var(--mint-500)', fontWeight: 700, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
            {line}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 20 }}>
        <a href="/contact" className="btn-ghost" style={{ fontSize: 10.5 }}>
          Still stuck? Talk to our team →
        </a>
      </div>
    </div>
  )
}

function FoundCard({ sn, data }: { sn: string; data: WarrantyResponse }) {
  const model = pick(data, 'productModel', 'model', 'productName')
  const shipDate = pick(data, 'shipDate', 'warrantyStartDate', 'startDate')
  const expireDate = pick(data, 'warrantyEndDate', 'warrantyExpireDate', 'expireDate', 'endDate')
  const apiStatus = pick(data, 'status')
  const whitelisted = data.haveWhiteList === 'Y'

  // Prefer the API's authoritative `warranty` (days remaining) when present.
  // Fall back to computing from the expiry date.
  const expiry = useMemo(() => {
    if (!expireDate) return null
    const normalized = expireDate.includes('T') ? expireDate : expireDate.replace(' ', 'T')
    const d = new Date(normalized)
    return Number.isNaN(d.getTime()) ? null : d
  }, [expireDate])
  const apiDays = typeof data.warranty === 'number' ? data.warranty : null
  const remaining =
    apiDays !== null
      ? apiDays
      : expiry
      ? daysBetween(new Date(), expiry)
      : null
  const isExpired = remaining !== null ? remaining <= 0 : false
  const statusLabel = apiStatus
    ? apiStatus
    : isExpired
    ? 'Warranty expired'
    : 'Under warranty'

  // Surface any other top-level fields the API returns (for forward-compat)
  const extraFields = Object.entries(data).filter(
    ([k]) =>
      ![
        'warranty',
        'haveWhiteList',
        'code',
        'message',
        'productModel',
        'model',
        'productName',
        'shipDate',
        'warrantyStartDate',
        'startDate',
        'warrantyEndDate',
        'warrantyExpireDate',
        'expireDate',
        'endDate',
        'status',
      ].includes(k)
  )

  return (
    <div
      style={{
        background: 'var(--navy-900)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(26px,3.5vw,40px)',
        color: 'var(--cream)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeSlideUp 0.5s cubic-bezier(.2,.8,.2,1) forwards',
        boxShadow: '0 24px 60px -28px rgba(10,22,40,0.55)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(55% 60% at 85% 15%, rgba(168,224,99,0.20), rgba(168,224,99,0) 60%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--mint-300)', letterSpacing: '0.16em', marginBottom: 10 }}>
            SERIAL NUMBER
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(20px,2.6vw,26px)',
              fontWeight: 700,
              letterSpacing: '0.04em',
              wordBreak: 'break-all',
            }}
          >
            {sn}
          </div>
          {model && (
            <div
              style={{
                marginTop: 12,
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 16,
                color: 'rgba(251,251,243,0.85)',
              }}
            >
              {model}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <span
            className="mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px 6px 10px',
              borderRadius: 999,
              background: isExpired ? 'rgba(239,83,80,0.15)' : 'rgba(168,224,99,0.18)',
              color: isExpired ? '#ffb1ae' : 'var(--mint-300)',
              border: `1px solid ${isExpired ? 'rgba(239,83,80,0.30)' : 'rgba(168,224,99,0.40)'}`,
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isExpired ? '#ef5350' : 'var(--mint-400)',
                boxShadow: isExpired ? '0 0 8px #ef5350' : '0 0 8px var(--mint-400)',
              }}
            />
            {statusLabel}
          </span>
          {whitelisted && (
            <span
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(251,251,243,0.45)',
              }}
            >
              ✓ verified by manufacturer
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 14,
          padding: '20px 0',
          borderTop: '1px dashed rgba(168,224,99,0.18)',
          borderBottom: remaining !== null || extraFields.length > 0 ? '1px dashed rgba(168,224,99,0.18)' : 'none',
        }}
      >
        <Field label="Ship date" value={formatDate(shipDate) || '—'} />
        <Field label="Warranty expires" value={formatDate(expireDate) || '—'} />
        {remaining !== null && (
          <Field
            label={isExpired ? 'Expired' : 'Days remaining'}
            value={isExpired ? `${Math.abs(remaining)} days ago` : `${remaining} days`}
            accent={!isExpired}
          />
        )}
      </div>

      {extraFields.length > 0 && (
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            paddingTop: 18,
          }}
        >
          {extraFields.map(([k, v]) => (
            <Field key={k} label={k} value={String(v ?? '—')} />
          ))}
        </div>
      )}

      <div
        className="mono"
        style={{
          position: 'relative',
          marginTop: 22,
          fontSize: 9.5,
          color: 'rgba(251,251,243,0.4)',
          lineHeight: 1.6,
        }}
      >
        // data sourced live from the manufacturer&apos;s warranty database
      </div>
    </div>
  )
}

function Field({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.45)', marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '-0.005em',
          color: accent ? 'var(--mint-300)' : 'var(--cream)',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function InfoTile({
  icon,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode
  title: string
  body: string
  cta?: { label: string; href: string }
}) {
  return (
    <div
      style={{
        background: 'var(--cream)',
        border: '1px solid rgba(10,22,40,0.08)',
        borderRadius: 'var(--radius)',
        padding: 22,
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      className="warranty-tile"
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'rgba(168,224,99,0.14)',
          color: 'var(--mint-500)',
          display: 'grid',
          placeItems: 'center',
          marginBottom: 14,
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 6, color: 'var(--ink)' }}>
        {title}
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--navy-500)', margin: 0 }}>
        {body}
      </p>
      {cta && (
        <a
          href={cta.href}
          className="mono"
          style={{
            display: 'inline-block',
            marginTop: 12,
            fontSize: 10,
            color: 'var(--mint-500)',
            textDecoration: 'none',
            borderBottom: '1px dashed var(--mint-500)',
            paddingBottom: 1,
          }}
        >
          {cta.label}
        </a>
      )}
    </div>
  )
}

const WARRANTY_CSS = `
.warranty-tile:hover {
  transform: translateY(-3px);
  border-color: rgba(168,224,99,0.45);
  box-shadow: 0 14px 30px -16px rgba(10,22,40,0.18);
}
.warranty-skeleton {
  background: linear-gradient(90deg, rgba(10,22,40,0.04) 0%, rgba(10,22,40,0.10) 50%, rgba(10,22,40,0.04) 100%);
  background-size: 200% 100%;
  animation: warrantyShimmer 1.2s ease-in-out infinite;
}
@keyframes warrantyShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .warranty-skeleton { animation: none; }
}
`
