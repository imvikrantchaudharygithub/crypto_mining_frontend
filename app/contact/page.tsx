'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import InnerHero from '@/components/InnerHero'
import FooterCTA from '@/components/FooterCTA'
import AnimatedNumber from '@/components/AnimatedNumber'

type ContactData = {
  hero?: { visible?: boolean; tagNum?: string; tagLabel?: string; headline?: string; italicWord?: string; mono?: string }
  methods?: { visible?: boolean; items?: { icon: string; method: string; primary: string; secondary: string; href: string; cta: string; accent?: boolean }[] }
  facility?: {
    visible?: boolean
    sectionTag?: string; cityHeadline?: string; italicWord?: string
    coordsLine?: string; coordsLabel?: string
    mapCta?: { label?: string; href?: string }
    details?: { label: string; value: string }[]
  }
  enquiryForm?: {
    visible?: boolean
    heading?: string
    subjects?: string[]
    submitLabel?: string
    successTitle?: string
    successBody?: string
  }
  numbersSection?: {
    visible?: boolean
    sectionTag?: string
    headlinePrefix?: string
    headlineItalic?: string
    description?: string
    stats?: { idx: string; value: number; suffix?: string; prefix?: string; label: string; hint?: string; decimals?: number }[]
    tickerLine?: string
  }
}

const DEFAULT_METHODS = [
  { icon: '📞', method: 'Phone',                primary: '+91 11 4000 0000',                  secondary: 'Mon–Sat, 9AM–7PM IST',         href: 'tel:+911140000000',                       cta: 'Call now',     accent: true },
  { icon: '✉️', method: 'Email',                primary: 'hello@cryptominingmiles.in',         secondary: 'Response within 4 business hours', href: 'mailto:hello@cryptominingmiles.in',       cta: 'Send email',   accent: false },
  { icon: '💼', method: 'Institutional Desk',   primary: 'institutional@cryptominingmiles.in', secondary: 'For ₹50L+ contracts & facility tours', href: 'mailto:institutional@cryptominingmiles.in', cta: 'Contact desk', accent: false },
]
const DEFAULT_FACILITY_DETAILS = [
  { label: 'Address',        value: 'Tier-3 Data Centre, Sector 62, Noida, UP – 201309' },
  { label: 'Facility tours', value: 'By appointment only · Mountain plan clients preferred' },
  { label: 'Working hours',  value: 'Ops 24/7 · Office: Mon–Sat 9AM–7PM IST' },
  { label: 'GST Number',     value: '07AAHCC1234F1ZP' },
]
const DEFAULT_SUBJECTS = ['General enquiry', 'Sales — new contract', 'Institutional / large volume', 'Facility tour request', 'Media & press', 'Partnership']
const DEFAULT_STATS = [
  { idx: '01', value: 6,    suffix: '+', label: 'Years operating',  hint: 'est. 2017',         decimals: 0 },
  { idx: '02', value: 2400, suffix: '+', label: 'Active contracts', hint: 'live on-chain',     decimals: 0 },
  { idx: '03', value: 99.8, suffix: '%', label: 'Uptime SLA',       hint: 'redundant power',   decimals: 1 },
  { idx: '04', value: 0,    suffix: '',  label: 'Maintenance fee',  hint: 'never. ever.',      decimals: 0, prefix: '₹' },
]

type FormState = { name: string; email: string; phone: string; subject: string; message: string }
type TouchedState = Partial<Record<keyof FormState, boolean>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+\d][\d\s\-()]{6,}$/

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {}
  if (!form.name.trim()) errors.name = 'Please enter your name'
  else if (form.name.trim().length < 2) errors.name = 'Name is too short'

  if (!form.email.trim()) errors.email = 'Please enter your email'
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email'

  if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) errors.phone = 'Enter a valid phone number'

  if (!form.message.trim()) errors.message = 'Please enter a message'
  else if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters'

  return errors
}

export default function ContactPage() {
  const [page, setPage] = useState<ContactData | null>(null)
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', subject: '', message: '' })
  const [touched, setTouched] = useState<TouchedState>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(form)
  const isValid = Object.keys(errors).length === 0
  const showError = (key: keyof FormState) => touched[key] && errors[key]

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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/contact`, { cache: 'no-store' as RequestCache })
      .then(r => r.json())
      .then(d => setPage(d.page ?? null))
      .catch(() => {})
  }, [])

  const hero        = page?.hero
  const methodsB    = page?.methods
  const facility    = page?.facility
  const enquiryForm = page?.enquiryForm
  const numbers     = page?.numbersSection
  const METHODS  = methodsB?.items && methodsB.items.length > 0 ? methodsB.items : DEFAULT_METHODS
  const DETAILS  = facility?.details && facility.details.length > 0 ? facility.details : DEFAULT_FACILITY_DETAILS
  const SUBJECTS = enquiryForm?.subjects && enquiryForm.subjects.length > 0 ? enquiryForm.subjects : DEFAULT_SUBJECTS
  const STATS    = numbers?.stats && numbers.stats.length > 0 ? numbers.stats : DEFAULT_STATS

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
    onBlur: () => setTouched(t => ({ ...t, [key]: true })),
  })

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    borderRadius: 10, outline: 'none',
    border: '1px solid rgba(10,22,40,0.12)',
    background: 'var(--cream)',
    fontFamily: 'var(--font-body)',
    fontSize: 14, color: 'var(--ink)',
    transition: 'border-color 0.2s',
  }
  const errorBorder = '1px solid #d93838'
  const inputStyleFor = (key: keyof FormState): React.CSSProperties =>
    showError(key) ? { ...inputStyle, border: errorBorder } : inputStyle
  const errorTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 10, color: '#d93838',
    marginTop: 6, letterSpacing: '0.04em',
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
          tagNum={hero?.tagNum ?? '05'}
          tagLabel={hero?.tagLabel ?? 'contact us'}
          headline={hero?.headline ?? "Let's"}
          italicWord={hero?.italicWord ?? 'talk.'}
          mono={hero?.mono ?? 'sales · support · institutional desk · facility tours'}
          bgVariant="navy"
        />
      )}

      {methodsB?.visible !== false && (
        <section style={{ background: 'var(--navy-900)', padding: '0 clamp(24px,5vw,80px) clamp(60px,8vw,80px)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {METHODS.map(({ icon, method, primary, secondary, href, cta, accent }) => (
                <div key={method} style={{
                  background: accent ? 'var(--mint-400)' : 'rgba(251,251,243,0.05)',
                  border: accent ? 'none' : '1px solid rgba(251,251,243,0.08)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'clamp(24px,3vw,32px)',
                  color: accent ? 'var(--navy-900)' : 'var(--cream)',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>
                  <div className="mono" style={{ fontSize: 10, marginBottom: 8, opacity: accent ? 0.6 : 0.4 }}>{method}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(14px,1.5vw,17px)', marginBottom: 6, lineHeight: 1.3, wordBreak: 'break-all' }}>{primary}</div>
                  <p style={{ fontSize: 12, opacity: accent ? 0.7 : 0.45, marginBottom: 24, lineHeight: 1.5 }}>{secondary}</p>
                  <a href={href} className="mono" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 10.5, textDecoration: 'none',
                    color: accent ? 'var(--navy-900)' : 'var(--mint-300)',
                    borderBottom: '1px solid currentColor', paddingBottom: 2,
                  }}>{cta} →</a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section ref={revealRef} style={{ background: 'var(--cream-2)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 40 }}>

          {facility?.visible !== false && (
            <div className="reveal">
              <div className="section-tag" style={{ marginBottom: 24 }}>{facility?.sectionTag ?? 'our facility'}</div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px,5vw,52px)',
                fontWeight: 700, letterSpacing: '-0.03em',
                lineHeight: 1.05, marginBottom: 24,
              }}>
                {facility?.cityHeadline ?? 'New Delhi'}<br />
                <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>{facility?.italicWord ?? 'Data Center.'}</em>
              </h2>

              <div style={{
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                border: '1px solid rgba(10,22,40,0.1)', marginBottom: 28,
                background: 'var(--navy-900)', height: 280,
                display: 'grid', placeItems: 'center', position: 'relative',
              }}>
                <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
                <div style={{ textAlign: 'center', position: 'relative' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--cream)' }}>
                    {facility?.coordsLine ?? 'N 28°37′12″ · E 77°13′08″'}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--mint-300)', marginTop: 6 }}>{facility?.coordsLabel ?? 'New Delhi, India'}</div>
                  <a
                    href={facility?.mapCta?.href ?? 'https://maps.google.com'}
                    target="_blank" rel="noopener noreferrer"
                    className="mono"
                    style={{
                      display: 'inline-block', marginTop: 16,
                      padding: '8px 18px', borderRadius: 999,
                      background: 'var(--mint-400)', color: 'var(--navy-900)',
                      fontSize: 10, textDecoration: 'none',
                    }}
                  >
                    {facility?.mapCta?.label ?? 'Open in Maps →'}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {DETAILS.map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <span className="mono" style={{ fontSize: 9.5, color: 'var(--navy-300)', minWidth: 110, paddingTop: 1 }}>{label}</span>
                    <span style={{ fontSize: 13, color: 'var(--navy-700)', lineHeight: 1.5 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {enquiryForm?.visible !== false && (
            <div className="reveal" style={{ transitionDelay: '120ms' }}>
              {submitted ? (
                <div style={{
                  background: 'var(--cream)', borderRadius: 'var(--radius-lg)',
                  padding: 48, textAlign: 'center',
                  border: '1px solid var(--mint-200)',
                }}>
                  <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
                    {enquiryForm?.successTitle ?? 'Message sent!'}
                  </h3>
                  <p style={{ color: 'var(--navy-500)', lineHeight: 1.65, marginBottom: 24 }}>
                    {enquiryForm?.successBody ?? "We'll get back to you within 4 business hours."}
                  </p>
                  <button className="btn-ghost" onClick={() => setSubmitted(false)} style={{ fontSize: 11 }}>
                    Send another
                  </button>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (!isValid) {
                      setTouched({ name: true, email: true, phone: true, subject: true, message: true })
                      return
                    }
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-lead`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...form, source: 'website-contact' }),
                    }).catch(() => {})
                    setSubmitted(true)
                  }}
                  style={{
                    background: 'var(--cream)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'clamp(28px,4vw,44px)',
                    border: '1px solid rgba(10,22,40,0.08)',
                    display: 'flex', flexDirection: 'column', gap: 20,
                  }}
                >
                  <div className="mono" style={{ fontSize: 10, color: 'var(--mint-500)', letterSpacing: '0.12em' }}>// {enquiryForm?.heading ?? 'SEND AN ENQUIRY'}</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <label>
                      <span style={labelStyle}>Full Name</span>
                      <input
                        placeholder="Your name"
                        style={inputStyleFor('name')}
                        aria-invalid={!!showError('name')}
                        {...field('name')}
                      />
                      {showError('name') && <div style={errorTextStyle}>{errors.name}</div>}
                    </label>
                    <label>
                      <span style={labelStyle}>Email</span>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        style={inputStyleFor('email')}
                        aria-invalid={!!showError('email')}
                        {...field('email')}
                      />
                      {showError('email') && <div style={errorTextStyle}>{errors.email}</div>}
                    </label>
                  </div>

                  <label>
                    <span style={labelStyle}>Phone (optional)</span>
                    <input
                      placeholder="+91 98765 43210"
                      style={inputStyleFor('phone')}
                      aria-invalid={!!showError('phone')}
                      {...field('phone')}
                    />
                    {showError('phone') && <div style={errorTextStyle}>{errors.phone}</div>}
                  </label>

                  <label>
                    <span style={labelStyle}>Subject</span>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} {...field('subject')}>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </label>

                  <label>
                    <span style={labelStyle}>Message</span>
                    <textarea
                      rows={5}
                      placeholder="Tell us what you're looking for..."
                      style={{ ...inputStyleFor('message'), resize: 'vertical', lineHeight: 1.65 }}
                      aria-invalid={!!showError('message')}
                      {...field('message')}
                    />
                    {showError('message') && <div style={errorTextStyle}>{errors.message}</div>}
                  </label>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={!isValid}
                    aria-disabled={!isValid}
                    style={{
                      justifyContent: 'center',
                      fontSize: 12,
                      opacity: isValid ? 1 : 0.5,
                      cursor: isValid ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <span className="dot" /> {enquiryForm?.submitLabel ?? 'Send message'}
                  </button>

                  <p className="mono" style={{ fontSize: 9.5, color: 'var(--navy-300)', textAlign: 'center' }}>
                    Response within 4 business hours · no spam, ever
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {numbers?.visible !== false && (
        <section style={{
          background: 'var(--navy-900)', color: 'var(--cream)',
          padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px) clamp(60px,7vw,80px)',
          borderTop: '1px solid var(--mint-200)', position: 'relative', overflow: 'hidden',
        }}>
          <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: 'radial-gradient(rgba(168,224,99,0.25) 1px, transparent 1px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -180, left: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, var(--mint-500) 0%, transparent 65%)', opacity: 0.25, filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -160, right: -120, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, var(--mint-400) 0%, transparent 65%)', opacity: 0.18, filter: 'blur(60px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 'clamp(48px,6vw,72px)' }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--mint-300)', marginBottom: 24,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mint-400)' }} />
                  <span style={{ color: 'var(--mint-400)', fontWeight: 600 }}>07</span>
                  <span style={{ opacity: 0.5 }}>/ {numbers?.sectionTag ?? 'by the numbers'}</span>
                  <span style={{ width: 48, height: 1, background: 'rgba(168,224,99,0.4)' }} />
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'clamp(36px,5vw,64px)', lineHeight: 0.96,
                  letterSpacing: '-0.04em', color: 'var(--cream)', maxWidth: 720,
                }}>
                  {numbers?.headlinePrefix ?? "Numbers don't"} <em style={{ fontStyle: 'italic', color: 'var(--mint-400)' }}>{numbers?.headlineItalic ?? 'negotiate.'}</em>
                </h2>
              </div>
              <p className="mono" style={{ fontSize: 11, color: 'rgba(251,251,243,0.45)', letterSpacing: '0.04em', maxWidth: 280, lineHeight: 1.7 }}>
                // {numbers?.description ?? 'Verified by our finance desk · audited quarterly · live on the public dashboard'}
              </p>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0,
              borderTop: '1px solid rgba(251,251,243,0.12)',
              borderBottom: '1px solid rgba(251,251,243,0.12)',
            }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{
                  padding: 'clamp(28px,3vw,40px) clamp(20px,2.5vw,32px)',
                  borderLeft: i === 0 ? 'none' : '1px solid rgba(251,251,243,0.1)',
                  position: 'relative', transition: 'background 0.3s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,224,99,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'var(--mint-400)', marginBottom: 16, fontWeight: 600,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--mint-400)' }} />
                    {s.idx}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: 'clamp(56px,8vw,96px)', lineHeight: 0.92,
                    letterSpacing: '-0.05em', color: 'var(--cream)',
                    marginBottom: 16, display: 'flex', alignItems: 'baseline',
                  }}>
                    {s.prefix && <span style={{ color: 'var(--mint-400)', marginRight: 2 }}>{s.prefix}</span>}
                    <AnimatedNumber value={s.value} decimals={s.decimals ?? 0} />
                    {s.suffix && <em style={{ fontStyle: 'italic', color: 'var(--mint-400)', fontSize: '0.55em', marginLeft: 4, fontWeight: 700 }}>{s.suffix}</em>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--cream)', marginBottom: 6, letterSpacing: '-0.01em' }}>{s.label}</div>
                  {s.hint && (
                    <div className="mono" style={{ fontSize: 10, color: 'rgba(168,224,99,0.6)', letterSpacing: '0.06em' }}>━ {s.hint}</div>
                  )}
                </div>
              ))}
            </div>

            {numbers?.tickerLine && (
              <div style={{
                marginTop: 'clamp(40px,5vw,56px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(251,251,243,0.45)', flexWrap: 'wrap',
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mint-400)', animation: 'pulseRing 1.6s ease-out infinite' }} />
                  <span style={{ color: 'var(--mint-300)' }}>LIVE</span>
                </span>
                <span style={{ color: 'rgba(251,251,243,0.25)' }}>━━</span>
                <span>{numbers.tickerLine}</span>
              </div>
            )}
          </div>
        </section>
      )}

      <FooterCTA />
    </main>
  )
}
