'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

import Navbar from '@/components/Navbar'
import FooterCTA from '@/components/FooterCTA'
import { MiningInteraction } from '@/components/MiningInteraction'
import { type Product } from '@/lib/products'

/* ── helpers ───────────────────────────────────────────── */
function useReveal(ref: React.RefObject<HTMLElement | null>, trigger: unknown = true) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal')
    if (!els || els.length === 0) return
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) } }),
      { threshold: 0, rootMargin: '0px 0px 9999px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [trigger])
}

const fmtINR = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

/* ── section tag ────────────────────────────────────────── */
function ProdTag({ num, label }: { num: string; label: string }) {
  return (
    <div className="reveal" style={{
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--font-mono)', fontSize: 11,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'var(--navy-500)', marginBottom: 36,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--mint-500)', flexShrink: 0 }} />
      <span style={{ color: 'var(--mint-500)', fontWeight: 600 }}>{num}</span>
      <span style={{ color: 'var(--navy-700)' }}>/ {label}</span>
      <span style={{ flex: 1, height: 1, background: 'rgba(10,22,40,0.18)' }} />
    </div>
  )
}

/* ── pulsing dot ────────────────────────────────────────── */
function PulseDot({ color = 'var(--mint-500)', size = 10 }: { color?: string; size?: number }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, flexShrink: 0 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, animation: 'pulseRing 1.6s ease-out infinite' }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
    </span>
  )
}

/* ── product hero ───────────────────────────────────────── */
function ProductHero({ p }: { p: Product }) {
  return (
    <section style={{
      position: 'relative',
      padding: 'clamp(120px,14vw,180px) clamp(24px,5vw,80px) clamp(60px,6vw,80px)',
      background: 'var(--cream)',
      overflow: 'hidden',
    }}>
      <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', top: -180, right: -160, width: 520, height: 520,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--mint-400) 0%, transparent 65%)',
        opacity: 0.35, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div className="reveal" style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--navy-500)', marginBottom: 40,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <Link href="/shop" style={{ color: 'var(--navy-500)', textDecoration: 'none' }}>Shop</Link>
          <span style={{ color: 'rgba(10,22,40,0.3)' }}>›</span>
          <span style={{ color: 'var(--navy-500)' }}>{p.algo}</span>
          <span style={{ color: 'rgba(10,22,40,0.3)' }}>›</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{p.name}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 'clamp(40px,5vw,64px)',
          alignItems: 'flex-start',
        }}>
          {/* LEFT: copy */}
          <div>
            <div className="reveal" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 14px',
              border: '1px solid rgba(10,22,40,0.2)',
              borderRadius: 999,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--navy-700)', marginBottom: 32,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--mint-500)' }} />
              Algorithm · {p.algo}
            </div>

            <h1 className="reveal" style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(56px,9vw,96px)',
              lineHeight: 0.92, letterSpacing: '-0.045em',
              color: 'var(--ink)', marginBottom: 28,
            }}>
              {p.name.split(' ').slice(0, -1).join(' ')}<br />
              <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>
                {p.name.split(' ').slice(-1)[0]}.
              </em>
            </h1>

            <div className="reveal" style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '10px 16px 10px 14px',
              background: p.available ? 'var(--mint-100)' : 'rgba(10,22,40,0.06)',
              border: `1px solid ${p.available ? 'var(--mint-300)' : 'rgba(10,22,40,0.15)'}`,
              borderRadius: 999, marginBottom: 28,
            }}>
              <PulseDot color={p.available ? 'var(--mint-500)' : 'var(--navy-300)'} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--navy-900)', fontWeight: 600,
              }}>
                {p.available ? 'In Stock — Ships in 48h' : 'Coming Soon — Notify Me'}
              </span>
            </div>

            <p className="reveal" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13, lineHeight: 1.75, color: 'var(--navy-700)',
              maxWidth: 520,
            }}>
              // {p.tagline}
            </p>
          </div>

          {/* RIGHT: editorial product card */}
          <div className="reveal" style={{
            position: 'relative',
            background: 'var(--navy-900)',
            borderRadius: 22,
            aspectRatio: '0.92',
            padding: 36,
            overflow: 'hidden',
            boxShadow: '0 40px 80px -30px rgba(10,22,40,0.4)',
            maxWidth: 480,
            justifySelf: 'center',
            width: '100%',
          }}>
            <div className="dotgrid" style={{
              position: 'absolute', inset: 0, opacity: 0.55,
              backgroundImage: 'radial-gradient(rgba(168,224,99,0.25) 1px, transparent 1px)',
            }} />
            <div style={{
              position: 'absolute', bottom: -120, right: -100, width: 380, height: 380,
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--mint-500) 0%, transparent 65%)',
              opacity: 0.35, filter: 'blur(40px)',
            }} />

            {/* Top row */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mint-300)', marginBottom: 4 }}>
                  SKU · {p.sku}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.45)' }}>
                  {p.edition}
                </div>
              </div>
              <div style={{
                padding: '6px 10px', border: '1px solid rgba(168,224,99,0.4)', borderRadius: 999,
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--mint-300)',
              }}>
                {p.hashrateNum} {p.hashrateUnit}
              </div>
            </div>

            {/* Floating labels */}
            <div style={{ position: 'absolute', top: 130, left: 36, zIndex: 2, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.55)' }}>
              ↘ {p.specs?.physical?.[2]?.[1] ?? p.specs?.physical?.[0]?.[1] ?? `${p.hashrate ?? ''}`}<br />
              <span style={{ color: 'rgba(168,224,99,0.7)' }}>━━ {p.noiseNum} dB</span>
            </div>
            <div style={{ position: 'absolute', top: 180, right: 36, zIndex: 2, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.55)' }}>
              {p.efficiencyNum} J/TH ↙<br />
              <span style={{ color: 'rgba(168,224,99,0.7)' }}>efficiency ━━</span>
            </div>

            {/* Big centered text */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'clamp(100px,14vw,200px)', lineHeight: 0.88,
                  letterSpacing: '-0.06em', color: 'var(--cream)',
                }}>
                  {p.shortName}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 700,
                  fontSize: 'clamp(44px,6vw,84px)', lineHeight: 0.95,
                  letterSpacing: '-0.04em', color: 'var(--mint-400)', marginTop: -8,
                }}>
                  {p.subName}
                </div>
                <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.5)' }}>
                  ━━ flagship workhorse ━━
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div style={{ position: 'absolute', bottom: 36, left: 36, right: 36, zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.45)' }}>
                Tested @ 25°C<br />
                <span style={{ color: 'var(--mint-300)' }}>━━━ 24h burn-in</span>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--mint-400)', color: 'var(--navy-900)',
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26,
                border: '3px solid var(--cream)',
              }}>₿</div>
            </div>
          </div>
        </div>

        {/* Spec strip */}
        <div className="reveal" style={{
          marginTop: 64,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          padding: 'clamp(20px,3vw,28px) 0',
          borderTop: '1px solid rgba(10,22,40,0.18)',
          borderBottom: '1px solid rgba(10,22,40,0.18)',
        }}>
          {[
            { k: 'HASHRATE',   v: p.hashrateNum, u: p.hashrateUnit },
            { k: 'POWER',      v: p.powerNum,    u: 'WATT' },
            { k: 'EFFICIENCY', v: p.efficiencyNum, u: 'J/TH' },
            { k: 'NOISE',      v: p.noiseNum,    u: 'DB' },
          ].map((s, i) => (
            <div key={s.k} style={{
              padding: 'clamp(0px,0px,0px) clamp(12px,2.5vw,32px)',
              borderLeft: i === 0 ? 'none' : '1px solid rgba(10,22,40,0.12)',
            }}>
              <div className="mono" style={{ color: 'var(--navy-500)', marginBottom: 8, fontSize: 10 }}>━ {s.k}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1, letterSpacing: '-0.04em',
                color: 'var(--ink)',
              }}>
                {s.v}
                <span style={{ fontSize: 'clamp(11px,1.5vw,18px)', color: 'var(--mint-500)', marginLeft: 5, letterSpacing: 0 }}>
                  {s.u}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── specs table ─────────────────────────────────────────── */
function SpecsTable({ p }: { p: Product }) {
  const groups = [
    { label: 'Performance', rows: p.specs.performance },
    { label: 'Power',       rows: p.specs.power },
    { label: 'Physical',    rows: p.specs.physical },
    { label: 'Connectivity',rows: p.specs.connectivity },
  ]
  return (
    <div>
      <ProdTag num="01" label="TECHNICAL SPECS" />
      <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)', lineHeight: 0.95, letterSpacing: '-0.04em', color: 'var(--ink)', marginBottom: 12 }}>
        Every spec, <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>on the table.</em>
      </h2>
      <p className="reveal mono" style={{ color: 'var(--navy-500)', marginBottom: 48, fontSize: 11 }}>
        // Verified by our Delhi engineers · 24h burn-in before dispatch
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0 48px' }}>
        {groups.map(g => (
          <div key={g.label} className="reveal" style={{ marginBottom: 40 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--mint-500)', fontWeight: 600, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mint-500)' }} />
              {g.label}
            </div>
            {g.rows.map(([k, v], i) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '13px 14px',
                background: i % 2 === 0 ? 'var(--cream)' : 'var(--cream-2)',
                borderTop: '1px dashed rgba(10,22,40,0.18)',
                borderBottom: i === g.rows.length - 1 ? '1px dashed rgba(10,22,40,0.18)' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--navy-500)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── profit calculator ───────────────────────────────────── */
function ProfitCalculator({ p }: { p: Product }) {
  const [btcPrice, setBtcPrice] = useState(7800000)
  const [rate, setRate] = useState(8)
  const [duration, setDuration] = useState(12)

  const power = Number(p.powerNum)
  const dailyBTC = 0.00018
  const dailyRevenue = dailyBTC * btcPrice
  const dailyPower = (power / 1000) * 24 * rate
  const dailyProfit = dailyRevenue - dailyPower
  const breakEven = Math.round(p.price / Math.max(1, dailyProfit))

  return (
    <div>
      <ProdTag num="02" label="PROFITABILITY CALCULATOR" />
      <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)', lineHeight: 0.95, letterSpacing: '-0.04em', color: 'var(--ink)', marginBottom: 48 }}>
        Will it <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>print?</em>
      </h2>

      <div className="reveal" style={{
        background: 'var(--navy-900)', color: 'var(--cream)',
        borderRadius: 22, padding: 'clamp(28px,4vw,48px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'radial-gradient(rgba(168,224,99,0.15) 1px, transparent 1px)' }} />
        <div style={{ position: 'absolute', top: -160, right: -120, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, var(--mint-500) 0%, transparent 65%)', opacity: 0.3, filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28, marginBottom: 40 }}>
            {/* BTC Price */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.55)', marginBottom: 12 }}>━ BTC price (₹)</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 18px',
                background: 'rgba(251,251,243,0.06)', border: '1px solid rgba(168,224,99,0.25)', borderRadius: 999,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--mint-300)' }}>₹</span>
                <input
                  type="text"
                  value={btcPrice.toLocaleString('en-IN')}
                  onChange={e => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10); setBtcPrice(isNaN(v) ? 0 : v) }}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--cream)', flex: 1, fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500 }}
                />
              </div>
            </div>

            {/* Electricity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.55)' }}>━ Electricity ₹/kWh</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--mint-300)' }}>₹{rate.toFixed(1)}</span>
              </div>
              <div style={{ padding: '12px 0' }}>
                <input type="range" min={2} max={14} step={0.5} value={rate}
                  onChange={e => setRate(parseFloat(e.target.value))}
                  style={{
                    width: '100%', height: 4, appearance: 'none', WebkitAppearance: 'none',
                    background: `linear-gradient(to right, var(--mint-400) 0%, var(--mint-400) ${(rate - 2) / 12 * 100}%, rgba(251,251,243,0.15) ${(rate - 2) / 12 * 100}%, rgba(251,251,243,0.15) 100%)`,
                    borderRadius: 999, outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(251,251,243,0.4)', letterSpacing: '0.1em' }}>
                <span>₹2</span><span>₹14</span>
              </div>
            </div>
          </div>

          {/* Duration toggle */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.55)', marginBottom: 12 }}>━ Contract duration</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[6, 12, 24].map(d => (
                <button key={d} onClick={() => setDuration(d)} style={{
                  padding: '13px 24px', borderRadius: 999,
                  border: `1px solid ${duration === d ? 'var(--mint-400)' : 'rgba(251,251,243,0.15)'}`,
                  background: duration === d ? 'var(--mint-400)' : 'transparent',
                  color: duration === d ? 'var(--navy-900)' : 'var(--cream)',
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontWeight: duration === d ? 700 : 500, cursor: 'pointer', transition: 'all 0.25s',
                }}>{d} months</button>
              ))}
            </div>
          </div>

          {/* Outputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px 0', paddingTop: 32, borderTop: '1px solid rgba(251,251,243,0.12)' }}>
            {[
              { k: 'DAILY BTC',     v: dailyBTC.toFixed(8), u: 'BTC' },
              { k: 'DAILY REVENUE', v: fmtINR(dailyRevenue), u: '/ day' },
              { k: 'DAILY PROFIT',  v: fmtINR(dailyProfit), u: 'after power' },
              { k: 'BREAK-EVEN',    v: breakEven.toString(), u: 'days' },
            ].map((o, i) => (
              <div key={o.k} style={{ padding: i % 2 === 0 ? '0 24px 0 0' : '0 0 0 24px', borderLeft: i % 2 === 1 ? '1px solid rgba(251,251,243,0.1)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.55)', marginBottom: 10 }}>━ {o.k}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px,3vw,36px)', lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--mint-400)', marginBottom: 5 }}>{o.v}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.45)' }}>{o.u}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px dashed rgba(251,251,243,0.12)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', color: 'rgba(251,251,243,0.4)' }}>
            // Estimates only · Network difficulty resets every 2016 blocks · BTC price assumed steady · Past performance ≠ future returns
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── what's in the box ───────────────────────────────────── */
function InTheBox({ p }: { p: Product }) {
  return (
    <div>
      <ProdTag num="03" label="WHAT'S IN THE BOX" />
      <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)', lineHeight: 0.95, letterSpacing: '-0.04em', color: 'var(--ink)', marginBottom: 40 }}>
        Open the <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>crate.</em>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {p.boxItems.map((it, i) => (
          <div key={i} className="reveal" style={{
            display: 'flex', alignItems: 'center', gap: 20,
            padding: '22px 24px',
            background: 'var(--cream)', border: '1px solid rgba(10,22,40,0.12)', borderRadius: 14,
            transitionDelay: `${i * 60}ms`,
          }}>
            <div style={{
              flex: '0 0 auto', width: 48, height: 48, borderRadius: '50%',
              background: 'var(--navy-900)', color: 'var(--mint-400)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-display)', fontSize: 18,
            }}>{it.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--ink)', marginBottom: 3 }}>{it.label}</div>
              <div className="mono" style={{ color: 'var(--navy-500)' }}>{it.sub}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--mint-500)' }}>0{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── electrical ──────────────────────────────────────────── */
function Electrical({ p }: { p: Product }) {
  return (
    <div>
      <ProdTag num="04" label="ELECTRICAL REQUIREMENTS" />
      <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)', lineHeight: 0.95, letterSpacing: '-0.04em', color: 'var(--ink)', marginBottom: 12 }}>
        Read <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>before</em> you plug in.
      </h2>
      <p className="reveal mono" style={{ color: 'var(--navy-500)', marginBottom: 40, fontSize: 11 }}>
        // Improper wiring will void warranty — when in doubt, call our engineering desk
      </p>
      <div className="reveal" style={{
        background: 'var(--cream-2)',
        border: '1px solid #D9C97A', borderLeft: '4px solid #C9A227',
        borderRadius: 14, padding: 'clamp(24px,3vw,36px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#C9A227', color: 'var(--cream)',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, flexShrink: 0,
          }}>!</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>Site survey strongly recommended</div>
            <div className="mono" style={{ color: 'var(--navy-500)', marginTop: 2 }}>Free with every contract · book at +91 87699 48451</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 36px' }}>
          {p.electricalReqs.map(([k, v], i) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '14px 0', borderTop: '1px dashed rgba(10,22,40,0.18)',
              borderBottom: i >= p.electricalReqs.length - 2 ? '1px dashed rgba(10,22,40,0.18)' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--navy-500)' }}>{k}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── faq ─────────────────────────────────────────────────── */
const FAQS = [
  { q: 'Is this brand new?', a: 'Yes. Every unit ships in a sealed factory box, with our 24-hour burn-in test certificate inside. We do not sell refurbished hardware — that\'s a separate listing.' },
  { q: 'What warranty do I get?', a: '12 months from date of dispatch. Local RMA via our Delhi service centre — no shipping the unit back to China. Most repairs complete within 5 working days.' },
  { q: 'Do you ship pan-India?', a: 'Yes. Insured freight, 3–5 business days to Tier-1 cities, 5–8 business days to remote locations. GST invoice issued on dispatch.' },
  { q: 'Can I mine at home?', a: 'Technically yes — but only if your premises has a dedicated 16A circuit, hot-air exhaust, and sound isolation. Otherwise we recommend our hosted-mining facility in Gurugram.' },
]

function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <div>
      <ProdTag num="05" label="FAQ" />
      <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)', lineHeight: 0.95, letterSpacing: '-0.04em', color: 'var(--ink)', marginBottom: 48 }}>
        Quick <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>answers.</em>
      </h2>
      <div>
        {FAQS.map((it, i) => (
          <div key={i} className="reveal" style={{
            borderTop: '1px solid rgba(10,22,40,0.18)',
            borderBottom: i === FAQS.length - 1 ? '1px solid rgba(10,22,40,0.18)' : 'none',
            transitionDelay: `${i * 60}ms`,
          }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
              padding: '26px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--mint-500)', fontWeight: 600 }}>0{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(16px,2vw,22px)', letterSpacing: '-0.02em', color: 'var(--ink)' }}>{it.q}</span>
              </div>
              <div style={{
                flex: '0 0 auto', width: 36, height: 36, borderRadius: '50%',
                background: open === i ? 'var(--mint-400)' : 'transparent',
                border: `1px solid ${open === i ? 'var(--mint-400)' : 'rgba(10,22,40,0.25)'}`,
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--navy-900)',
                transition: 'all 0.3s',
              }}>{open === i ? '−' : '+'}</div>
            </button>
            {open === i && (
              <div style={{ paddingLeft: 44, paddingBottom: 28, paddingRight: 56, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, color: 'var(--navy-700)' }}>
                // {it.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── buy box (sticky) ────────────────────────────────────── */
function BuyBox({ p }: { p: Product }) {
  const [duration, setDuration] = useState(12)
  const [silencer, setSilencer] = useState(false)
  const total = p.price + (silencer && p.silencerPrice > 0 ? p.silencerPrice : 0)

  return (
    <div style={{ position: 'sticky', top: 100 }}>
     <MiningInteraction>
      <div style={{
        background: 'var(--navy-900)', color: 'var(--cream)',
        borderRadius: 22, padding: 'clamp(24px,3vw,32px)',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 30px 60px -25px rgba(10,22,40,0.4)',
      }}>
        <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(rgba(168,224,99,0.18) 1px, transparent 1px)' }} />
        <div style={{ position: 'absolute', top: -100, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, var(--mint-500) 0%, transparent 65%)', opacity: 0.3, filter: 'blur(30px)' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Stock badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 14px',
            background: 'rgba(168,224,99,0.12)', border: '1px solid rgba(168,224,99,0.4)',
            borderRadius: 999, marginBottom: 24,
          }}>
            <PulseDot color="var(--mint-400)" size={8} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mint-300)', fontWeight: 500 }}>
              {p.available ? 'In Stock — Ships in 48h' : 'Coming Soon'}
            </span>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.5)', marginBottom: 6 }}>━ Price · INR</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(40px,5vw,64px)', lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--cream)' }}>
              ₹{total.toLocaleString('en-IN')}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'rgba(251,251,243,0.5)', marginTop: 8 }}>
              incl. all taxes &amp; GST · ≈ ${Math.round(total / 83.3).toLocaleString()}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(251,251,243,0.12)', margin: '24px 0' }} />

          {/* Duration */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.55)', marginBottom: 12 }}>━ Contract</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[6, 12, 24].map(d => (
                <button key={d} onClick={() => setDuration(d)} style={{
                  flex: 1, padding: '11px 6px', borderRadius: 999,
                  border: `1px solid ${duration === d ? 'var(--mint-400)' : 'rgba(251,251,243,0.18)'}`,
                  background: duration === d ? 'var(--mint-400)' : 'transparent',
                  color: duration === d ? 'var(--navy-900)' : 'var(--cream)',
                  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontWeight: duration === d ? 700 : 500, cursor: 'pointer', transition: 'all 0.25s',
                }}>{d} mo</button>
              ))}
            </div>
          </div>

          {/* Silencer add-on */}
          {p.silencerPrice > 0 && (
            <label style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              border: `1px solid ${silencer ? 'var(--mint-400)' : 'rgba(251,251,243,0.18)'}`,
              borderRadius: 14, cursor: 'pointer', marginBottom: 24,
              transition: 'all 0.25s',
              background: silencer ? 'rgba(168,224,99,0.08)' : 'transparent',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                border: `1px solid ${silencer ? 'var(--mint-400)' : 'rgba(251,251,243,0.4)'}`,
                background: silencer ? 'var(--mint-400)' : 'transparent',
                display: 'grid', placeItems: 'center',
                color: 'var(--navy-900)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                flex: '0 0 auto',
              }}>{silencer ? '✓' : ''}</div>
              <input type="checkbox" checked={silencer} onChange={e => setSilencer(e.target.checked)} style={{ display: 'none' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--cream)' }}>+ Sound Reducer (Silencer)</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'rgba(251,251,243,0.5)', marginTop: 2 }}>Drops noise from {p.noiseNum} dB → 48 dB</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--mint-300)', flexShrink: 0 }}>+₹{p.silencerPrice.toLocaleString('en-IN')}</div>
            </label>
          )}

          {/* CTAs */}
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '19px 24px', background: 'var(--mint-400)', color: 'var(--navy-900)',
            border: 'none', borderRadius: 999,
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700,
            cursor: 'pointer', marginBottom: 10, transition: 'transform 0.25s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--navy-900)' }} />
            {p.available ? 'Buy Contract →' : 'Notify Me →'}
          </button>

          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '17px 24px', background: 'transparent', color: 'var(--cream)',
            border: '1px solid rgba(251,251,243,0.25)', borderRadius: 999,
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
            cursor: 'pointer',
          }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#25D366', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 32 32" fill="#fff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M16.001 4C9.373 4 4 9.373 4 16c0 2.114.553 4.166 1.6 5.978L4 28l6.18-1.621A11.94 11.94 0 0 0 16.001 28C22.628 28 28 22.627 28 16S22.628 4 16.001 4Zm0 21.818a9.83 9.83 0 0 1-5.011-1.367l-.359-.214-3.668.962.978-3.575-.234-.369A9.81 9.81 0 0 1 6.182 16c0-5.413 4.405-9.818 9.819-9.818 5.413 0 9.818 4.405 9.818 9.818 0 5.413-4.405 9.818-9.818 9.818Zm5.378-7.354c-.295-.148-1.745-.861-2.015-.96-.27-.099-.467-.148-.664.148-.197.295-.762.96-.934 1.158-.172.197-.344.222-.638.074-.295-.148-1.245-.459-2.371-1.464-.876-.781-1.467-1.745-1.639-2.04-.172-.295-.018-.455.13-.602.133-.133.295-.345.443-.517.148-.172.197-.295.295-.492.099-.197.05-.369-.025-.517-.074-.148-.664-1.6-.91-2.193-.24-.576-.483-.498-.664-.507a12.83 12.83 0 0 0-.566-.01c-.197 0-.517.074-.787.369-.27.295-1.033 1.009-1.033 2.461 0 1.452 1.058 2.855 1.205 3.052.148.197 2.082 3.18 5.046 4.46.706.305 1.256.487 1.685.623.708.225 1.353.193 1.863.117.568-.085 1.745-.713 1.992-1.402.246-.689.246-1.279.172-1.402-.074-.123-.27-.197-.566-.345Z"/>
              </svg>
            </span>
            Chat on WhatsApp
          </button>

          {/* Trust row */}
          <div style={{ marginTop: 24, paddingTop: 22, borderTop: '1px dashed rgba(251,251,243,0.15)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[{ i: '◈', t: '12mo Warranty' }, { i: '⛟', t: 'Pan-India' }, { i: '₹0', t: 'Maintenance' }].map((it, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', margin: '0 auto 6px', background: 'rgba(168,224,99,0.12)', border: '1px solid rgba(168,224,99,0.3)', color: 'var(--mint-400)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{it.i}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(251,251,243,0.6)' }}>{it.t}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'rgba(251,251,243,0.45)', textAlign: 'center' }}>
            Questions? Call <span style={{ color: 'var(--mint-300)' }}>+91 87699 48451</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--navy-500)', textAlign: 'center' }}>
        ━━ secure checkout · razorpay + bank transfer ━━
      </div>
     </MiningInteraction>
    </div>
  )
}

/* ── related products ────────────────────────────────────── */
function RelatedProducts({ p }: { p: Product }) {
  const [related, setRelated] = useState<Product[]>([])
  useEffect(() => {
    if (!p.relatedSlugs?.length) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-products`)
      .then(r => r.json())
      .then(d => setRelated((d.products ?? []).filter((pr: Product) => p.relatedSlugs.includes(pr.slug))))
      .catch(() => {})
  }, [p.relatedSlugs])
  return (
    <section style={{ padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)', background: 'var(--cream-2)', position: 'relative', overflow: 'hidden' }}>
      <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <ProdTag num="06" label="YOU MAY ALSO LIKE" />
            <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(40px,6vw,64px)', lineHeight: 0.95, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
              More <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>rigs.</em>
            </h2>
          </div>
          <Link href="/shop" className="mono" style={{ color: 'var(--ink)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 20px', border: '1px solid rgba(10,22,40,0.3)', borderRadius: 999 }}>
            See full catalogue →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {related.map((rp, i) => (
            <Link key={rp.slug} href={`/shop/${rp.slug}`} style={{ textDecoration: 'none' }}>
              <div className="reveal mag-card" style={{
                background: 'var(--cream)', border: '1px solid rgba(10,22,40,0.12)', borderRadius: 22,
                padding: 28, display: 'flex', flexDirection: 'column', minHeight: 320,
                transitionDelay: `${i * 80}ms`, cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <span style={{ padding: '5px 10px', background: 'var(--mint-100)', border: '1px solid var(--mint-300)', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--navy-900)', fontWeight: 600 }}>◆ {rp.tag}</span>
                  <span className="mono" style={{ color: 'var(--navy-500)', fontSize: 10 }}>{rp.algo}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--ink)', marginBottom: 20 }}>{rp.name}</h3>
                <div style={{ marginBottom: 20 }}>
                  <div className="mono" style={{ color: 'var(--navy-500)', marginBottom: 4 }}>━ HASHRATE</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(36px,5vw,56px)', lineHeight: 0.95, letterSpacing: '-0.04em', color: 'var(--mint-500)' }}>
                    {rp.hashrateNum}<span style={{ fontSize: 18, color: 'var(--navy-500)', marginLeft: 5 }}>{rp.hashrateUnit}</span>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 18, borderTop: '1px dashed rgba(10,22,40,0.18)' }}>
                  <div>
                    <div className="mono" style={{ color: 'var(--navy-500)', marginBottom: 2 }}>━ PRICE</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{rp.priceDisplay}</div>
                  </div>
                  <span className="mono" style={{ color: 'var(--mint-500)', fontWeight: 600 }}>View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── trust strip ─────────────────────────────────────────── */
function TrustStrip() {
  const items = [
    { n: '6+', l: 'Years operating' },
    { n: '2,400+', l: 'Active contracts' },
    { n: '99.8%', l: 'Uptime SLA' },
    { n: '₹0', l: 'Maintenance fee' },
  ]
  return (
    <section style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)', background: 'var(--navy-900)', color: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
      <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.18 }} />
      <div style={{ position: 'absolute', top: -120, left: -100, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, var(--mint-500) 0%, transparent 65%)', opacity: 0.25 }} />
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0 }}>
        {items.map((it, i) => (
          <div key={i} className="reveal" style={{
            padding: 'clamp(16px,2vw,24px) clamp(20px,3vw,32px)',
            borderLeft: i === 0 ? 'none' : '1px solid rgba(251,251,243,0.12)',
            transitionDelay: `${i * 80}ms`,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(48px,7vw,88px)', lineHeight: 0.95, letterSpacing: '-0.04em', color: 'var(--cream)', marginBottom: 10 }}>{it.n}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--mint-300)' }}>━ {it.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── page ────────────────────────────────────────────────── */
export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-product/${params.slug}`)
      .then(r => r.json())
      .then(d => { if (d.product) setProduct(d.product) })
      .catch(() => {})
  }, [params.slug])

  useReveal(pageRef as React.RefObject<HTMLElement>, product)

  if (!product) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--navy-400)' }}>Loading…</div>
  const p = product

  return (
    <div ref={pageRef}>
      <Navbar />
      <ProductHero p={p} />

      {/* Two-column: content + sticky buy box */}
      <section style={{
        padding: 'clamp(60px,8vw,80px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)',
        background: 'var(--cream)', position: 'relative',
      }}>
        <div className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none' }} />
        <div className="product-detail-grid" style={{ position: 'relative', maxWidth: 1280, margin: '0 auto' }}>
          {/* Left column: all sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(60px,8vw,100px)' }}>
            <SpecsTable p={p} />
            <ProfitCalculator p={p} />
            <InTheBox p={p} />
            <Electrical p={p} />
            <FAQ />
          </div>

          {/* Right: sticky buy box */}
          <div className="hide-mobile">
            <BuyBox p={p} />
          </div>
        </div>

        {/* Mobile buy box below content */}
        <div style={{ maxWidth: 1280, margin: '60px auto 0' }} className="hide-tablet-up">
          <BuyBox p={p} />
        </div>
      </section>

      <RelatedProducts p={p} />
      <TrustStrip />
      <FooterCTA />
    </div>
  )
}

