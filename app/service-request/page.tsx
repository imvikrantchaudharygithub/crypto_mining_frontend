'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import InnerHero from '@/components/InnerHero'
import FooterCTA from '@/components/FooterCTA'

type SrData = {
  hero?: { visible?: boolean; tagNum?: string; tagLabel?: string; headline?: string; italicWord?: string; mono?: string }
  whyCard?: {
    visible?: boolean
    sectionTag?: string
    headlinePrefix?: string; headlineItalic?: string
    features?: { icon: string; title: string; desc: string }[]
    directContact?: { phone?: string; email?: string }
  }
  form?: {
    visible?: boolean
    heading?: string
    issueTypes?: string[]
    priorityLevels?: string[]
    submitLabel?: string
    successTitle?: string
    successBody?: string
  }
}

const DEFAULT_ISSUE_TYPES = ['Hardware malfunction','Network / connectivity issue','Payout discrepancy','Contract query','Cooling / temperature alert','Hashrate drop','Account access issue','Other']
const DEFAULT_PRIORITY_LEVELS = ['Low', 'Medium', 'High', 'Critical']
const DEFAULT_WHY_FEATURES = [
  { icon: '⚡', title: 'Avg. 2h response',   desc: 'Critical tickets acknowledged within 15 minutes, 24/7.' },
  { icon: '🔧', title: 'On-site engineers',  desc: 'Full-time technicians at the New Delhi facility daily.' },
  { icon: '📊', title: 'Transparent updates', desc: 'Track your ticket status live — no chasing support.' },
  { icon: '🛡️', title: 'SLA-backed',         desc: 'Hardware faults resolved within 48h or contract credit.' },
]

export default function ServiceRequestPage() {
  const [page, setPage] = useState<SrData | null>(null)
  const [form, setForm] = useState({
    contractId: '', name: '', email: '', phone: '',
    issueType: DEFAULT_ISSUE_TYPES[0], priority: 'Medium',
    description: '', attachFile: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketIdRes] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/service-request`, { cache: 'no-store' as RequestCache })
      .then(r => r.json())
      .then(d => setPage(d.page ?? null))
      .catch(() => {})
  }, [])

  const hero    = page?.hero
  const whyCard = page?.whyCard
  const formCfg = page?.form
  const ISSUE_TYPES      = formCfg?.issueTypes      && formCfg.issueTypes.length      > 0 ? formCfg.issueTypes      : DEFAULT_ISSUE_TYPES
  const PRIORITY_LEVELS  = formCfg?.priorityLevels  && formCfg.priorityLevels.length  > 0 ? formCfg.priorityLevels  : DEFAULT_PRIORITY_LEVELS
  const WHY_FEATURES     = whyCard?.features        && whyCard.features.length        > 0 ? whyCard.features        : DEFAULT_WHY_FEATURES

  useEffect(() => {
    if (!ISSUE_TYPES.includes(form.issueType)) {
      setForm(f => ({ ...f, issueType: ISSUE_TYPES[0] }))
    }
    if (!PRIORITY_LEVELS.includes(form.priority)) {
      setForm(f => ({ ...f, priority: PRIORITY_LEVELS[Math.min(1, PRIORITY_LEVELS.length - 1)] }))
    }
  }, [page])

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

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  })

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    borderRadius: 10, outline: 'none',
    border: '1px solid rgba(10,22,40,0.12)',
    background: 'var(--cream)',
    fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)',
    transition: 'border-color 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--navy-500)', marginBottom: 6,
  }

  return (
    <main>
      <Navbar />
      {hero?.visible !== false && (
        <InnerHero
          tagNum={hero?.tagNum ?? '03'}
          tagLabel={hero?.tagLabel ?? 'service request'}
          headline={hero?.headline ?? 'We fix it,'}
          italicWord={hero?.italicWord ?? 'fast.'}
          mono={hero?.mono ?? 'avg response time 2h · 24/7 ops team · ticket number issued instantly'}
          bgVariant="mint"
        />
      )}

      <section ref={revealRef} style={{
        padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)',
        background: 'var(--cream-2)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start' }}>

          {whyCard?.visible !== false && (
            <div className="reveal" style={{
              background: 'var(--navy-900)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(28px,4vw,48px)',
              color: 'var(--cream)',
              position: 'sticky', top: 100,
            }}>
              <div className="section-tag reveal" style={{ marginBottom: 28, color: 'var(--mint-300)' }}>
                <span style={{ background: 'var(--mint-400)', width: 8, height: 8, borderRadius: '50%', display: 'inline-block', marginRight: 10 }} />
                {whyCard?.sectionTag ?? 'why choose us'}
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px,4vw,40px)',
                fontWeight: 700, letterSpacing: '-0.03em',
                lineHeight: 1.1, marginBottom: 32,
              }}>
                {whyCard?.headlinePrefix ?? 'Ops team that'}<br />
                <em style={{ fontStyle: 'italic', color: 'var(--mint-400)' }}>{whyCard?.headlineItalic ?? 'never sleeps.'}</em>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {WHY_FEATURES.map(({ icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(168,224,99,0.15)',
                      display: 'grid', placeItems: 'center',
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title}</div>
                      <p style={{ fontSize: 12.5, color: 'rgba(251,251,243,0.5)', lineHeight: 1.6 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {(whyCard?.directContact?.phone || whyCard?.directContact?.email) && (
                <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(251,251,243,0.08)' }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--mint-300)', marginBottom: 12 }}>DIRECT CONTACT</div>
                  {whyCard?.directContact?.phone && (
                    <a href={`tel:${whyCard.directContact.phone.replace(/\s+/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--cream)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                      📞 {whyCard.directContact.phone}
                    </a>
                  )}
                  {whyCard?.directContact?.email && (
                    <a href={`mailto:${whyCard.directContact.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(251,251,243,0.55)', textDecoration: 'none', fontSize: 13 }}>
                      ✉️ {whyCard.directContact.email}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {formCfg?.visible !== false && (
            <div className="reveal" style={{ transitionDelay: '120ms' }}>
              {submitted ? (
                <div style={{
                  background: 'var(--cream)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 48, textAlign: 'center',
                  border: '1px solid var(--mint-200)',
                }}>
                  <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
                    {formCfg?.successTitle ?? 'Ticket submitted!'}
                  </h3>
                  <p style={{ color: 'var(--navy-500)', lineHeight: 1.65, marginBottom: 24 }}>
                    {ticketId ? (
                      <>Your ticket ID is <strong style={{ color: 'var(--ink)' }}>{ticketId}</strong>. Track it at <a href="/track-ticket" style={{ color: 'var(--mint-500)' }}>/track-ticket</a>.</>
                    ) : (
                      formCfg?.successBody ?? "You'll receive a ticket number via email within 5 minutes. Our team will respond within 2 hours."
                    )}
                  </p>
                  <button className="btn-ghost" onClick={() => setSubmitted(false)} style={{ fontSize: 11 }}>
                    Submit another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-ticket`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          customer: { name: form.name, email: form.email, phone: form.phone },
                          contractId: form.contractId,
                          issueType: form.issueType,
                          description: form.description,
                          priority: form.priority,
                        }),
                      })
                      if (!res.ok) throw new Error(`status ${res.status}`)
                      const data = await res.json()
                      if (data.ticketId) setTicketIdRes(data.ticketId)
                      setSubmitted(true)
                    } catch (err) {
                      console.error('service-request submit failed', err)
                      alert('Sorry, your ticket could not be submitted. Please try again or contact us directly.')
                      return
                    }
                  }}
                  style={{
                    background: 'var(--cream)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'clamp(28px,4vw,48px)',
                    border: '1px solid rgba(10,22,40,0.08)',
                    display: 'flex', flexDirection: 'column', gap: 20,
                  }}
                >
                  <div className="mono" style={{ fontSize: 10, color: 'var(--mint-500)', letterSpacing: '0.12em' }}>// {formCfg?.heading ?? 'SERVICE REQUEST FORM'}</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <label>
                      <span style={labelStyle}>Contract ID</span>
                      <input required placeholder="CMM-XXXX-XXXX" style={inputStyle} {...field('contractId')} />
                    </label>
                    <label>
                      <span style={labelStyle}>Full Name</span>
                      <input required placeholder="Your name" style={inputStyle} {...field('name')} />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <label>
                      <span style={labelStyle}>Email</span>
                      <input required type="email" placeholder="you@example.com" style={inputStyle} {...field('email')} />
                    </label>
                    <label>
                      <span style={labelStyle}>Phone</span>
                      <input placeholder="+91 98765 43210" style={inputStyle} {...field('phone')} />
                    </label>
                  </div>

                  <label>
                    <span style={labelStyle}>Issue Type</span>
                    <select required style={{ ...inputStyle, cursor: 'pointer' }} {...field('issueType')}>
                      {ISSUE_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </label>

                  <div>
                    <span style={labelStyle}>Priority Level</span>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {PRIORITY_LEVELS.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, priority: p }))}
                          className="mono"
                          style={{
                            padding: '7px 16px', borderRadius: 999, fontSize: 10, border: 'none',
                            cursor: 'pointer', transition: 'all 0.2s',
                            background: form.priority === p
                              ? p === 'Critical' ? '#ef5350' : p === 'High' ? 'var(--navy-900)' : 'var(--mint-500)'
                              : 'rgba(10,22,40,0.06)',
                            color: form.priority === p ? (p === 'Low' || p === 'Medium' ? 'var(--navy-900)' : 'white') : 'var(--navy-500)',
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label>
                    <span style={labelStyle}>Describe the issue</span>
                    <textarea required rows={5} placeholder="Describe what's happening, when it started, and any error messages you've seen..." style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} {...field('description')} />
                  </label>

                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center', fontSize: 12 }}>
                    <span className="dot" /> {formCfg?.submitLabel ?? 'Submit Service Request'}
                  </button>

                  <p className="mono" style={{ fontSize: 9.5, color: 'var(--navy-300)', textAlign: 'center' }}>
                    Ticket number issued instantly · avg response 2h
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      <FooterCTA />
    </main>
  )
}
