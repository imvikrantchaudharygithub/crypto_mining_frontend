'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import InnerHero from '@/components/InnerHero'
import FooterCTA from '@/components/FooterCTA'

type TicketStep = { label: string; desc: string; time: string; done: boolean; active: boolean }
type ApiTicket = {
  id?: string; ticketId?: string; issue?: string; issueDescription?: string;
  created?: string; createdAt?: string; eta?: string;
  status?: string; minerModel?: string; customerName?: string;
  steps?: { label?: string; description?: string; timestamp?: string; done?: boolean }[]
}

type TrackData = {
  hero?: { visible?: boolean; tagNum?: string; tagLabel?: string; headline?: string; italicWord?: string; mono?: string }
  lookup?: { visible?: boolean; placeholder?: string; submitLabel?: string; notFoundMessage?: string; emptyHint?: string }
  escalation?: { visible?: boolean; copy?: string; ctaLabel?: string; ctaHref?: string }
}

function Timeline({ steps }: { steps: TicketStep[] }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 32 }}>
      <div style={{
        position: 'absolute', left: 11, top: 12, bottom: 12,
        width: 2, background: 'rgba(10,22,40,0.1)',
        borderRadius: 1,
      }} />
      {steps.map((step, i) => (
        <div key={i} style={{ position: 'relative', paddingBottom: i < steps.length - 1 ? 32 : 0 }}>
          <div style={{
            position: 'absolute', left: -32, top: 4,
            width: 22, height: 22, borderRadius: '50%',
            background: step.done ? 'var(--navy-900)' : step.active ? 'var(--mint-400)' : 'var(--cream)',
            border: step.done ? '2px solid var(--navy-900)' : step.active ? '2px solid var(--mint-400)' : '2px solid rgba(10,22,40,0.15)',
            display: 'grid', placeItems: 'center', zIndex: 1,
          }}>
            {step.done && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5.5L4 7.5L8 3" stroke="var(--mint-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {step.active && (
              <>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--navy-900)' }} />
                <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid var(--mint-400)', animation: 'pulseRing 1.5s ease-out infinite' }} />
              </>
            )}
          </div>
          <div style={{
            background: step.active ? 'var(--navy-900)' : step.done ? 'var(--cream)' : 'rgba(10,22,40,0.03)',
            border: step.active ? '1px solid var(--navy-900)' : '1px solid rgba(10,22,40,0.08)',
            borderRadius: 'var(--radius)',
            padding: '16px 20px',
            color: step.active ? 'var(--cream)' : step.done ? 'var(--ink)' : 'var(--navy-300)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{step.label}</span>
              <span className="mono" style={{ fontSize: 10, color: step.active ? 'var(--mint-300)' : 'var(--navy-300)' }}>{step.time}</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: step.active ? 'rgba(251,251,243,0.65)' : step.done ? 'var(--navy-500)' : 'rgba(10,22,40,0.3)' }}>{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TrackTicketPage() {
  const [page, setPage] = useState<TrackData | null>(null)
  const [ticketId, setTicketId] = useState('')
  const [ticket, setTicket] = useState<ApiTicket | null>(null)
  const [error, setError] = useState('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/track-ticket`, { cache: 'no-store' as RequestCache })
      .then(r => r.json())
      .then(d => setPage(d.page ?? null))
      .catch(() => {})
  }, [])

  const hero       = page?.hero
  const lookup     = page?.lookup
  const escalation = page?.escalation

  const revealRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const els = revealRef.current?.querySelectorAll('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) } }),
      { threshold: 0, rootMargin: '0px 0px 9999px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const search = async () => {
    const id = ticketId.trim()
    if (!id) return
    setSearching(true)
    setError('')
    setTicket(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-ticket/${id}`)
      if (res.status === 404) { setError(lookup?.notFoundMessage ?? 'No ticket found for that ID.'); return }
      const data = await res.json()
      if (data.ticket) { setTicket(data.ticket) }
      else { setError(lookup?.notFoundMessage ?? 'No ticket found for that ID.') }
    } catch {
      setError('Could not connect to server. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <main>
      <Navbar />
      {hero?.visible !== false && (
        <InnerHero
          tagNum={hero?.tagNum ?? '04'}
          tagLabel={hero?.tagLabel ?? 'ticket tracker'}
          headline={hero?.headline ?? 'Your fix,'}
          italicWord={hero?.italicWord ?? 'live.'}
          mono={hero?.mono ?? 'real-time status · no refresh needed · on-site updates'}
          bgVariant="cream"
        />
      )}

      <section ref={revealRef} style={{
        padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)',
        background: 'var(--cream-2)',
        minHeight: '60vh',
      }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>

          {lookup?.visible !== false && (
            <>
              <div className="reveal" style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, position: 'relative', minWidth: 260 }}>
                  <input
                    value={ticketId}
                    onChange={e => setTicketId(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && search()}
                    placeholder={lookup?.placeholder ?? 'Enter ticket ID — e.g. CMM-2024-0042'}
                    style={{
                      width: '100%', padding: '16px 20px',
                      borderRadius: 'var(--radius)',
                      border: error ? '1px solid #ef5350' : '1px solid rgba(10,22,40,0.12)',
                      background: 'var(--cream)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 15, color: 'var(--ink)', outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>
                <button onClick={search} disabled={searching} className="btn-primary" style={{ padding: '16px 28px', fontSize: 11, opacity: searching ? 0.6 : 1 }}>
                  <span className="dot" /> {searching ? 'Searching…' : (lookup?.submitLabel ?? 'Track')}
                </button>
              </div>

              {error && (
                <div className="mono" style={{
                  fontSize: 11, color: '#ef5350',
                  padding: '14px 20px',
                  background: 'rgba(239,83,80,0.08)',
                  borderRadius: 10, marginBottom: 32,
                  border: '1px solid rgba(239,83,80,0.2)',
                }}>{error}</div>
              )}

              {!ticket && !error && !searching && (
                <div className="reveal" style={{
                  background: 'rgba(168,224,99,0.1)',
                  border: '1px solid var(--mint-200)',
                  borderRadius: 'var(--radius)',
                  padding: '16px 20px', marginBottom: 48,
                }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--mint-500)' }}>
                    // {lookup?.emptyHint ?? 'Enter your ticket ID to track its status in real time'}
                  </span>
                </div>
              )}
            </>
          )}

          {ticket && (() => {
            const displayId = ticket.ticketId ?? ticket.id ?? ticketId
            const displayIssue = ticket.issueDescription ?? ticket.issue ?? ''
            const displayCreated = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : (ticket.created ?? '—')
            const displayEta = ticket.eta ?? '—'
            const rawSteps = ticket.steps ?? []
            const steps: TicketStep[] = rawSteps.map((s, i) => ({
              label: s.label ?? `Step ${i + 1}`,
              desc: s.description ?? '',
              time: s.timestamp ? new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
              done: s.done ?? false,
              active: !s.done && rawSteps.slice(i + 1).some(ns => !ns.done) === false && i === rawSteps.findIndex(ns => !ns.done),
            }))
            return (
              <div style={{ animation: 'fadeSlideUp 0.5s cubic-bezier(.2,.8,.2,1) forwards' }}>
                <div style={{
                  background: 'var(--navy-900)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(24px,3vw,36px)',
                  color: 'var(--cream)', marginBottom: 32,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--mint-300)', marginBottom: 10 }}>TICKET ID</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>{displayId}</div>
                      <p style={{ fontSize: 14, color: 'rgba(251,251,243,0.6)', lineHeight: 1.5 }}>{displayIssue}</p>
                      {ticket.status && (
                        <span className="mono" style={{ display: 'inline-block', marginTop: 10, padding: '4px 10px', borderRadius: 999, background: 'rgba(168,224,99,0.15)', color: 'var(--mint-300)', fontSize: 10 }}>
                          {ticket.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: 9.5, color: 'rgba(251,251,243,0.35)', marginBottom: 4 }}>OPENED</div>
                      <div className="mono" style={{ fontSize: 12, color: 'var(--mint-300)' }}>{displayCreated}</div>
                      {displayEta !== '—' && (
                        <>
                          <div className="mono" style={{ fontSize: 9.5, color: 'rgba(251,251,243,0.35)', marginTop: 10, marginBottom: 4 }}>ESTIMATED RESOLUTION</div>
                          <div className="mono" style={{ fontSize: 12, color: 'var(--mint-300)' }}>{displayEta}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {steps.length > 0 && <Timeline steps={steps} />}

                {escalation?.visible !== false && (
                  <div style={{ marginTop: 40, textAlign: 'center' }}>
                    <p className="mono" style={{ fontSize: 10, color: 'var(--navy-300)', marginBottom: 16 }}>
                      {escalation?.copy ?? 'Need to escalate? Contact us directly.'}
                    </p>
                    <a href={escalation?.ctaHref ?? '/contact'} className="btn-ghost" style={{ fontSize: 10.5 }}>
                      {escalation?.ctaLabel ?? 'Contact support →'}
                    </a>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </section>

      <FooterCTA />
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
