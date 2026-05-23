'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import InnerHero from '@/components/InnerHero'
import FooterCTA from '@/components/FooterCTA'

// BTC mined per TH/s per day. Reflects current network difficulty + block subsidy + fees.
// Matches the reference calculator (xyzmining.co.in) so user-facing numbers are comparable.
const BTC_PER_TH_PER_DAY = 4.66e-7

// Fixed power draw used by the cost model. Matches the reference calculator exactly
// (Antminer S21-class). Intentionally NOT scaled with hashrate so output matches xyzmining.
const FIXED_POWER_KW = 3.5

const FALLBACK_BTC_INR = 8_500_000

const DEFAULT_FAQS = [
  { q: 'Does the calculator include maintenance fees?', a: 'No, because we charge 0%. The only cost modelled is electricity at your specified rate.' },
  { q: 'What BTC price is used?',                       a: 'A live BTC/INR spot price pulled from a public market feed. If the feed is unreachable a cached fallback (₹85,00,000) is used so the page never blocks.' },
  { q: 'How is power consumption estimated?',           a: 'A fixed 3.5 kW draw is assumed (Antminer S21-class). For different hardware, adjust your electricity rate accordingly so the daily cost ends up correct.' },
]

type ProfitData = {
  hero?: { visible?: boolean; tagNum?: string; tagLabel?: string; headline?: string; italicWord?: string; mono?: string }
  calculator?: {
    visible?: boolean
    configHeading?: string
    resultsHeading?: string
    disclaimer?: string
    defaults?: { electricityRate?: number; hashrate?: number }
  }
  faqs?: { visible?: boolean; sectionTag?: string; items?: { q: string; a: string }[] }
}

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function Row({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <span className="mono" style={{ fontSize: 10, color: 'rgba(251,251,243,0.45)', letterSpacing: '0.08em' }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 13.5,
        color: negative ? 'rgba(255,138,128,0.85)' : 'rgba(251,251,243,0.92)',
      }}>
        {value}
      </span>
    </div>
  )
}

function PeriodCard({
  idx, label, days, revenuePerDay, costPerDay,
}: {
  idx: string; label: string; days: number; revenuePerDay: number; costPerDay: number
}) {
  const revenue = revenuePerDay * days
  const cost = costPerDay * days
  const profit = revenue - cost
  const positive = profit >= 0
  return (
    <div style={{
      padding: 'clamp(20px,2.5vw,28px)',
      background: positive ? 'rgba(168,224,99,0.06)' : 'rgba(255,100,100,0.05)',
      borderRadius: 'var(--radius-lg)',
      border: positive ? '1px solid rgba(168,224,99,0.18)' : '1px solid rgba(255,100,100,0.18)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--mint-300)', letterSpacing: '0.16em', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--mint-400)', fontWeight: 700 }}>{idx}</span>
        <span style={{ opacity: 0.5 }}>/</span>
        <span>{label}</span>
      </div>

      <Row label="REVENUE"     value={formatINR(revenue)} />
      <Row label="ELECTRICITY" value={`− ${formatINR(cost)}`} negative />

      <div style={{ borderTop: '1px dashed rgba(168,224,99,0.18)', paddingTop: 14, marginTop: 4 }}>
        <div className="mono" style={{ fontSize: 9, color: 'rgba(251,251,243,0.45)', letterSpacing: '0.16em', marginBottom: 6 }}>
          NET PROFIT
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(24px,3vw,32px)',
          letterSpacing: '-0.03em',
          color: positive ? 'var(--mint-400)' : '#ff8a80',
          lineHeight: 1,
        }}>
          {formatINR(profit)}
        </div>
      </div>
    </div>
  )
}

export default function ProfitabilityPage() {
  const [page, setPage] = useState<ProfitData | null>(null)
  const [hashrate, setHashrate] = useState(200)
  const [electricityRate, setElectricityRate] = useState(8)
  const [btcPrice, setBtcPrice] = useState<number | null>(null)
  const [btcError, setBtcError] = useState(false)

  // CMS content
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/profitability`, { cache: 'no-store' as RequestCache })
      .then(r => r.json())
      .then(d => {
        const p = d.page ?? null
        setPage(p)
        if (p?.calculator?.defaults?.electricityRate !== undefined) setElectricityRate(p.calculator.defaults.electricityRate)
        if (p?.calculator?.defaults?.hashrate !== undefined) setHashrate(p.calculator.defaults.hashrate)
      })
      .catch(() => {})
  }, [])

  // Live BTC/INR price — Coinbase spot (matches the reference calculator exactly),
  // with a constant fallback if the feed is unreachable.
  useEffect(() => {
    let aborted = false
    const fetchBtc = async () => {
      try {
        const r = await fetch('https://api.coinbase.com/v2/prices/BTC-INR/spot')
        if (r.ok) {
          const d = await r.json()
          const v = parseFloat(d?.data?.amount)
          if (Number.isFinite(v) && v > 0) { if (!aborted) setBtcPrice(v); return }
        }
      } catch { /* fall through */ }

      if (!aborted) { setBtcPrice(FALLBACK_BTC_INR); setBtcError(true) }
    }
    fetchBtc()
    return () => { aborted = true }
  }, [])

  const hero = page?.hero
  const calc = page?.calculator
  const faqsBlock = page?.faqs
  const FAQS = faqsBlock?.items && faqsBlock.items.length > 0 ? faqsBlock.items : DEFAULT_FAQS

  // Derived numbers — formulas mirror the reference calculator (xyzmining.co.in) exactly:
  //   revenue = hash × 0.000000466 × btcPrice
  //   cost    = 3.5 × 24 × kwh   (fixed 3.5 kW power draw, not scaled with hashrate)
  const safeHash = Number.isFinite(hashrate) ? Math.max(0, hashrate) : 0
  const safeRate = Number.isFinite(electricityRate) ? Math.max(0, electricityRate) : 0
  const effectiveBtc = btcPrice ?? FALLBACK_BTC_INR
  const revenuePerDay = safeHash * BTC_PER_TH_PER_DAY * effectiveBtc
  const costPerDay = FIXED_POWER_KW * 24 * safeRate

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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    background: 'rgba(251,251,243,0.06)',
    color: 'var(--cream)',
    border: '1px solid rgba(251,251,243,0.14)',
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'rgba(251,251,243,0.45)',
    marginBottom: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  }

  return (
    <main>
      <Navbar />
      {hero?.visible !== false && (
        <InnerHero
          tagNum={hero?.tagNum ?? '02'}
          tagLabel={hero?.tagLabel ?? 'profit calculator'}
          headline={hero?.headline ?? 'Know your'}
          italicWord={hero?.italicWord ?? 'numbers.'}
          mono={hero?.mono ?? 'live BTC price · two inputs · 1, 7 & 15-day projections'}
          bgVariant="navy"
        />
      )}

      {calc?.visible !== false && (
        <section ref={revealRef} style={{
          background: 'var(--navy-900)',
          padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px)',
          paddingTop: 0,
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(28px,3.5vw,40px)' }}>

            {/* Inputs panel — full width */}
            <div className="reveal" style={{
              background: 'rgba(251,251,243,0.05)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(24px,3vw,36px)',
              border: '1px solid rgba(251,251,243,0.08)',
            }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--mint-300)', marginBottom: 20, letterSpacing: '0.14em' }}>
                // {calc?.configHeading ?? 'CONFIGURE YOUR MINER'}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 18,
                marginBottom: 22,
              }}>
                <label>
                  <span style={labelStyle}>Hashrate (TH/s)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={1}
                    value={Number.isFinite(hashrate) ? hashrate : ''}
                    onChange={e => setHashrate(e.target.value === '' ? 0 : Number(e.target.value))}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--mint-400)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(168,224,99,0.18)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(251,251,243,0.14)'; e.currentTarget.style.boxShadow = 'none' }}
                    style={inputStyle}
                  />
                </label>

                <label>
                  <span style={labelStyle}>Electricity (₹/kWh)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.5}
                    value={Number.isFinite(electricityRate) ? electricityRate : ''}
                    onChange={e => setElectricityRate(e.target.value === '' ? 0 : Number(e.target.value))}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--mint-400)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(168,224,99,0.18)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(251,251,243,0.14)'; e.currentTarget.style.boxShadow = 'none' }}
                    style={inputStyle}
                  />
                </label>
              </div>

              {/* Live BTC pill + derived power estimate */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div className="prof-btc-pill" aria-live="polite">
                  <span className="prof-btc-pill__dot" aria-hidden />
                  <span className="prof-btc-pill__label mono">{btcError ? 'BTC / INR (cached)' : 'LIVE BTC / INR'}</span>
                  <span className="prof-btc-pill__value">
                    {btcPrice ? formatINR(btcPrice) : '…'}
                  </span>
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'rgba(251,251,243,0.4)', letterSpacing: '0.06em' }}>
                  // power assumed {FIXED_POWER_KW} kW (Antminer S21-class)
                </div>
              </div>
            </div>

            {/* Results — three time windows */}
            <div className="reveal" style={{ transitionDelay: '100ms' }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--mint-300)', marginBottom: 20, letterSpacing: '0.14em' }}>
                // {calc?.resultsHeading ?? 'PROJECTED PROFIT'}
              </div>

              <div className="prof-period-grid" style={{ display: 'grid', gap: 16 }}>
                <PeriodCard idx="01" label="1 DAY"     days={1}   revenuePerDay={revenuePerDay} costPerDay={costPerDay} />
                <PeriodCard idx="02" label="7 DAYS"    days={7}   revenuePerDay={revenuePerDay} costPerDay={costPerDay} />
                <PeriodCard idx="03" label="15 DAYS"   days={15}  revenuePerDay={revenuePerDay} costPerDay={costPerDay} />
                <PeriodCard idx="04" label="1 MONTH"   days={30}  revenuePerDay={revenuePerDay} costPerDay={costPerDay} />
                <PeriodCard idx="05" label="6 MONTHS"  days={180} revenuePerDay={revenuePerDay} costPerDay={costPerDay} />
                <PeriodCard idx="06" label="1 YEAR"    days={365} revenuePerDay={revenuePerDay} costPerDay={costPerDay} />
              </div>

              <p className="mono" style={{ fontSize: 9.5, color: 'rgba(251,251,243,0.28)', marginTop: 20, lineHeight: 1.6 }}>
                {calc?.disclaimer ?? `* Estimates based on a fixed yield of ${BTC_PER_TH_PER_DAY.toExponential(2)} BTC / TH / day and current BTC/INR spot. Network difficulty adjusts every ~2016 blocks; real returns will drift.`}
              </p>
            </div>
          </div>

          <style>{`
            .prof-period-grid {
              grid-template-columns: 1fr;
            }
            @media (min-width: 640px) {
              .prof-period-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            }
            @media (min-width: 1024px) {
              .prof-period-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            }
            .prof-btc-pill {
              display: inline-flex;
              align-items: center;
              gap: 10px;
              padding: 7px 14px 7px 11px;
              border-radius: 999px;
              background: rgba(34, 197, 94, 0.10);
              border: 1px solid rgba(34, 197, 94, 0.32);
              animation: profBtcGlow 1.8s ease-in-out infinite;
            }
            .prof-btc-pill__dot {
              width: 7px; height: 7px;
              border-radius: 50%;
              background: #4ade80;
              box-shadow: 0 0 6px #4ade80, 0 0 12px rgba(74,222,128,0.6);
              animation: profBtcDot 1.2s ease-in-out infinite;
            }
            .prof-btc-pill__label {
              font-size: 9.5px;
              font-weight: 800;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: #4ade80;
              text-shadow: 0 0 6px rgba(74,222,128,0.55);
            }
            .prof-btc-pill__value {
              font-family: var(--font-display);
              font-weight: 700;
              font-size: 13.5px;
              color: var(--cream);
              letter-spacing: -0.01em;
            }
            @keyframes profBtcGlow {
              0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
              50%      { box-shadow: 0 0 14px 0 rgba(74,222,128,0.5), 0 0 0 3px rgba(74,222,128,0.10); }
            }
            @keyframes profBtcDot {
              0%, 100% { opacity: 1;   transform: scale(1); }
              50%      { opacity: 0.55; transform: scale(0.85); }
            }
            @media (prefers-reduced-motion: reduce) {
              .prof-btc-pill, .prof-btc-pill__dot { animation: none; }
            }
          `}</style>
        </section>
      )}

      {faqsBlock?.visible !== false && (
        <section style={{
          background: 'var(--mint-100)',
          padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div className="section-tag" style={{ marginBottom: 24 }}>{faqsBlock?.sectionTag ?? 'common questions'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {FAQS.map(({ q, a }) => (
                <div key={q} style={{
                  background: 'var(--cream)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 28,
                  border: '1px solid rgba(10,22,40,0.08)',
                }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>{q}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--navy-700)', lineHeight: 1.65 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FooterCTA />
    </main>
  )
}
