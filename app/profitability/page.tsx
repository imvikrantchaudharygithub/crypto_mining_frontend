'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import InnerHero from '@/components/InnerHero'
import FooterCTA from '@/components/FooterCTA'

const DEFAULT_MINERS = [
  { name: 'Antminer S19 XP',   hashrate: 140,  power: 3010, algo: 'BTC' },
  { name: 'Antminer S19j Pro', hashrate: 104,  power: 3068, algo: 'BTC' },
  { name: 'Antminer S21 Pro',  hashrate: 234,  power: 3531, algo: 'BTC' },
  { name: 'Jasminer X4-Q',     hashrate: 1040, power: 480,  algo: 'ETH' },
  { name: 'Antminer L7',       hashrate: 9500, power: 3425, algo: 'LTC' },
  { name: 'IceRiver KS3M',     hashrate: 6000, power: 3400, algo: 'KAS' },
  { name: 'Custom',            hashrate: 0,    power: 0,    algo: 'BTC' },
]

const NETWORK = {
  BTC: { difficulty: 83.148e12, blockReward: 3.125, blockTime: 600, symbol: '₿', priceINR: 6800000 },
  ETH: { difficulty: 15e15,     blockReward: 2,     blockTime: 12,  symbol: 'Ξ', priceINR: 330000  },
  LTC: { difficulty: 28e6,      blockReward: 6.25,  blockTime: 150, symbol: 'Ł', priceINR: 9200    },
  KAS: { difficulty: 5e12,      blockReward: 292,   blockTime: 1,   symbol: 'K', priceINR: 12      },
}

const DEFAULT_FAQS = [
  { q: 'Does the calculator include maintenance fees?', a: 'No, because we charge 0%. The only cost modeled is electricity at your specified rate.' },
  { q: 'What BTC price is used?',                       a: 'We use a real-time feed updated every 5 minutes. The rate shown is the current spot price in INR.' },
  { q: 'Why does difficulty matter?',                   a: 'Bitcoin difficulty adjusts every ~2 weeks. Higher difficulty = lower rewards per TH/s. We use the current live difficulty.' },
]

type ProfitData = {
  hero?: { visible?: boolean; tagNum?: string; tagLabel?: string; headline?: string; italicWord?: string; mono?: string }
  calculator?: {
    visible?: boolean
    configHeading?: string
    resultsHeading?: string
    disclaimer?: string
    miners?: { name: string; hashrate: number; power: number; algo: string }[]
    defaults?: { electricityRate?: number; months?: number }
  }
  faqs?: { visible?: boolean; sectionTag?: string; items?: { q: string; a: string }[] }
}

function calcRewards(hashrateRaw: number, algo: string, months: number, electricityRate: number, powerW: number) {
  const net = NETWORK[algo as keyof typeof NETWORK]
  if (!net || hashrateRaw <= 0) return null

  const hashrate = algo === 'ETH' ? hashrateRaw * 1e6 : algo === 'LTC' ? hashrateRaw * 1e6 : algo === 'KAS' ? hashrateRaw * 1e9 : hashrateRaw * 1e12
  const blocksPerDay = 86400 / net.blockTime
  const totalHashrate = net.difficulty * (2 ** 32) / net.blockTime
  const sharePerDay = hashrate / totalHashrate
  const coinsPerDay = sharePerDay * blocksPerDay * net.blockReward

  const priceINR = net.priceINR
  const revenuePerDay = coinsPerDay * priceINR
  const powerCostPerDay = (powerW / 1000) * 24 * electricityRate
  const profitPerDay = revenuePerDay - powerCostPerDay
  const totalRevenue = revenuePerDay * months * 30
  const totalCost = powerCostPerDay * months * 30
  const totalProfit = profitPerDay * months * 30

  return {
    coinsPerDay, revenuePerDay, powerCostPerDay, profitPerDay,
    totalRevenue, totalCost, totalProfit, priceINR,
    symbol: net.symbol,
    roiDays: profitPerDay > 0 ? Math.ceil(totalCost / profitPerDay) : null,
  }
}

function StatBox({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      padding: 'clamp(20px,2.5vw,28px)',
      background: accent ? 'var(--mint-100)' : 'rgba(251,251,243,0.06)',
      borderRadius: 'var(--radius)',
      border: accent ? '1px solid var(--mint-300)' : '1px solid rgba(251,251,243,0.1)',
    }}>
      <div className="mono" style={{ fontSize: 10, color: accent ? 'var(--mint-600)' : 'rgba(251,251,243,0.45)', marginBottom: 8, letterSpacing: '0.1em' }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(22px,3vw,36px)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: accent ? 'var(--navy-900)' : 'var(--mint-400)',
        lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div className="mono" style={{ fontSize: 9.5, color: accent ? 'var(--navy-500)' : 'rgba(251,251,243,0.35)', marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

export default function ProfitabilityPage() {
  const [page, setPage] = useState<ProfitData | null>(null)
  const [selectedMiner, setSelectedMiner] = useState(0)
  const [hashrate, setHashrate] = useState(140)
  const [power, setPower] = useState(3010)
  const [electricityRate, setElectricityRate] = useState(8)
  const [months, setMonths] = useState(12)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/profitability`, { cache: 'no-store' as RequestCache })
      .then(r => r.json())
      .then(d => {
        const p = d.page ?? null
        setPage(p)
        if (p?.calculator?.defaults?.electricityRate !== undefined) setElectricityRate(p.calculator.defaults.electricityRate)
        if (p?.calculator?.defaults?.months !== undefined) setMonths(p.calculator.defaults.months)
      })
      .catch(() => {})
  }, [])

  const hero = page?.hero
  const calc = page?.calculator
  const faqsBlock = page?.faqs
  const MINERS = calc?.miners && calc.miners.length > 0 ? calc.miners : DEFAULT_MINERS
  const FAQS   = faqsBlock?.items && faqsBlock.items.length > 0 ? faqsBlock.items : DEFAULT_FAQS

  const miner = MINERS[Math.min(selectedMiner, MINERS.length - 1)] ?? MINERS[0]

  useEffect(() => {
    if (miner && miner.name !== 'Custom') {
      setHashrate(miner.hashrate)
      setPower(miner.power)
    }
  }, [selectedMiner, miner])

  const results = calcRewards(hashrate, miner?.algo ?? 'BTC', months, electricityRate, power)

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

  return (
    <main>
      <Navbar />
      {hero?.visible !== false && (
        <InnerHero
          tagNum={hero?.tagNum ?? '02'}
          tagLabel={hero?.tagLabel ?? 'profit calculator'}
          headline={hero?.headline ?? 'Know your'}
          italicWord={hero?.italicWord ?? 'numbers.'}
          mono={hero?.mono ?? 'live network difficulty · real electricity costs · no fluff'}
          bgVariant="navy"
        />
      )}

      {calc?.visible !== false && (
        <section ref={revealRef} style={{
          background: 'var(--navy-900)',
          padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px)',
          paddingTop: 0,
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 'clamp(24px,3vw,40px)',
              alignItems: 'start',
            }}>
              {/* Inputs */}
              <div className="reveal" style={{
                background: 'rgba(251,251,243,0.05)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(24px,3vw,36px)',
                border: '1px solid rgba(251,251,243,0.08)',
              }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--mint-300)', marginBottom: 24, letterSpacing: '0.12em' }}>
                  // {calc?.configHeading ?? 'CONFIGURE YOUR MINER'}
                </div>

                <label style={{ display: 'block', marginBottom: 20 }}>
                  <div className="mono" style={{ fontSize: 10, color: 'rgba(251,251,243,0.4)', marginBottom: 8 }}>HARDWARE MODEL</div>
                  <select
                    value={selectedMiner}
                    onChange={e => setSelectedMiner(Number(e.target.value))}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(251,251,243,0.08)', color: 'var(--cream)',
                      border: '1px solid rgba(251,251,243,0.12)',
                      fontFamily: 'var(--font-display)', fontSize: 14, outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {MINERS.map((m, i) => (
                      <option key={i} value={i} style={{ background: 'var(--navy-800)' }}>{m.name}</option>
                    ))}
                  </select>
                </label>

                <label style={{ display: 'block', marginBottom: 20 }}>
                  <div className="mono" style={{ fontSize: 10, color: 'rgba(251,251,243,0.4)', marginBottom: 8 }}>
                    HASHRATE ({miner?.algo === 'ETH' ? 'MH/s' : miner?.algo === 'LTC' ? 'MH/s' : miner?.algo === 'KAS' ? 'GH/s' : 'TH/s'})
                  </div>
                  <input
                    type="number" value={hashrate}
                    onChange={e => setHashrate(Number(e.target.value))}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(251,251,243,0.08)', color: 'var(--cream)',
                      border: '1px solid rgba(251,251,243,0.12)',
                      fontFamily: 'var(--font-display)', fontSize: 14, outline: 'none',
                    }}
                  />
                </label>

                <label style={{ display: 'block', marginBottom: 20 }}>
                  <div className="mono" style={{ fontSize: 10, color: 'rgba(251,251,243,0.4)', marginBottom: 8 }}>POWER CONSUMPTION (W)</div>
                  <input
                    type="number" value={power}
                    onChange={e => setPower(Number(e.target.value))}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(251,251,243,0.08)', color: 'var(--cream)',
                      border: '1px solid rgba(251,251,243,0.12)',
                      fontFamily: 'var(--font-display)', fontSize: 14, outline: 'none',
                    }}
                  />
                </label>

                <label style={{ display: 'block', marginBottom: 24 }}>
                  <div className="mono" style={{ fontSize: 10, color: 'rgba(251,251,243,0.4)', marginBottom: 8 }}>
                    ELECTRICITY RATE (₹/kWh) — current: ₹{electricityRate}
                  </div>
                  <input
                    type="range" min={2} max={20} step={0.5}
                    value={electricityRate}
                    onChange={e => setElectricityRate(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--mint-400)' }}
                  />
                </label>

                <label style={{ display: 'block' }}>
                  <div className="mono" style={{ fontSize: 10, color: 'rgba(251,251,243,0.4)', marginBottom: 8 }}>
                    CONTRACT DURATION — {months} months
                  </div>
                  <input
                    type="range" min={1} max={24} step={1}
                    value={months}
                    onChange={e => setMonths(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--mint-400)' }}
                  />
                </label>
              </div>

              {/* Results */}
              <div className="reveal" style={{ transitionDelay: '100ms' }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--mint-300)', marginBottom: 20, letterSpacing: '0.12em' }}>
                  // {calc?.resultsHeading ?? 'PROJECTED RETURNS'}
                </div>

                {results ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <StatBox label="DAILY COINS" value={`${results.symbol}${results.coinsPerDay.toFixed(8)}`} sub={`≈ ₹${results.revenuePerDay.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / day`} />
                    <StatBox label="DAILY PROFIT" value={`₹${Math.max(0, results.profitPerDay).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} sub={`after ₹${results.powerCostPerDay.toFixed(0)} electricity`} accent />
                    <StatBox label={`${months}-MONTH REVENUE`} value={`₹${(results.totalRevenue / 100000).toFixed(1)}L`} sub="gross mining income" />
                    <StatBox label={`${months}-MONTH PROFIT`} value={`₹${(Math.max(0, results.totalProfit) / 100000).toFixed(1)}L`} sub="after power costs" accent />
                    <div style={{
                      gridColumn: '1/-1',
                      padding: 'clamp(20px,2.5vw,28px)',
                      background: results.roiDays && results.roiDays < months * 30 ? 'rgba(168,224,99,0.12)' : 'rgba(255,100,100,0.08)',
                      borderRadius: 'var(--radius)',
                      border: `1px solid ${results.roiDays && results.roiDays < months * 30 ? 'rgba(168,224,99,0.2)' : 'rgba(255,100,100,0.15)'}`,
                    }}>
                      <div className="mono" style={{ fontSize: 10, color: 'rgba(251,251,243,0.45)', marginBottom: 8 }}>BREAK-EVEN</div>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(28px,4vw,44px)',
                        fontWeight: 800,
                        letterSpacing: '-0.04em',
                        color: results.roiDays && results.roiDays < months * 30 ? 'var(--mint-400)' : '#ff8a80',
                        lineHeight: 1,
                      }}>
                        {results.roiDays ? `${results.roiDays} days` : 'Not profitable'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(251,251,243,0.3)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Enter hashrate to calculate</div>
                  </div>
                )}

                <p className="mono" style={{ fontSize: 9, color: 'rgba(251,251,243,0.2)', marginTop: 20, lineHeight: 1.6 }}>
                  {calc?.disclaimer ?? '* Estimates based on current network difficulty and BTC price. Past performance does not guarantee future results. Difficulty adjusts every ~2016 blocks.'}
                </p>
              </div>
            </div>
          </div>
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
