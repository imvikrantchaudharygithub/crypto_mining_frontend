'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import InnerHero from '@/components/InnerHero'
import FooterCTA from '@/components/FooterCTA'
import { type Product } from '@/lib/products'
import { fetchSiteSettings, DEFAULT_CONTACT, digitsOnly, type SiteContact } from '@/lib/siteSettings'

type PublicStockStatus = 'In Stock' | 'Sold Out' | 'Coming Soon'

const fmtINR = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

function buildWaHref(p: Product, contact: SiteContact | null, origin: string): string | undefined {
  const number = digitsOnly(contact?.whatsappNumber || DEFAULT_CONTACT.whatsappNumber)
  if (!number) return undefined
  const link = origin ? `${origin}/shop/${p.slug}` : ''
  const lines = [
    `Hi, I'm interested in the *${p.name}*.`,
    '',
    p.hashrate ? `• Hashrate: ${p.hashrate}` : '',
    p.power ? `• Power: ${p.power}` : '',
    typeof p.price === 'number' && p.price > 0 ? `• Price: ${fmtINR(p.price)}` : '',
    p.sku ? `• SKU: ${p.sku}` : '',
    link ? `• Link: ${link}` : '',
    '',
    'Please share availability and shipping details.',
  ].filter(Boolean)
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`
}

function statusOf(p: Pick<Product, 'computedStatus' | 'available'>): PublicStockStatus {
  if (p?.computedStatus === 'In Stock' || p?.computedStatus === 'Sold Out' || p?.computedStatus === 'Coming Soon') {
    return p.computedStatus
  }
  return p?.available ? 'In Stock' : 'Coming Soon'
}

const DEFAULT_FILTERS = ['All', 'SHA-256', 'ETHASH', 'SCRYPT', 'KASPA']
const DEFAULT_TRUST = [
  { icon: '⚡', label: 'Same-day activation', desc: 'Contracts go live within 24h of payment' },
  { icon: '🔗', label: 'On-chain proof',      desc: 'Every payout verifiable on the blockchain' },
  { icon: '🛡️', label: '99.8% uptime SLA',    desc: 'Redundant power + hydro cooling' },
  { icon: '💬', label: '24/7 support',        desc: 'Dedicated account manager for all plans' },
]

type ShopPageData = {
  hero?: { visible?: boolean; tagNum?: string; tagLabel?: string; headline?: string; italicWord?: string; mono?: string }
  filters?: { visible?: boolean; algos?: string[]; gstNote?: string }
  emptyState?: { visible?: boolean; title?: string; body?: string }
  trust?: { visible?: boolean; items?: { icon: string; label: string; desc: string }[] }
}

/* ────────────────────────────────────────────────────────────
   Skeleton loader — mirrors the real ProductCard layout so the
   page doesn't jump when real data arrives.
   ──────────────────────────────────────────────────────────── */
function ProductCardSkeleton({ i }: { i: number }) {
  const block = (style?: React.CSSProperties): React.CSSProperties => ({
    background: 'rgba(10,22,40,0.08)',
    borderRadius: 8,
    ...style,
  })

  return (
    <div
      className="product-skeleton"
      data-testid="product-card-skeleton"
      aria-hidden="true"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 28,
        background: 'var(--cream)',
        border: '1px solid rgba(10,22,40,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${(i % 6) * 90}ms`,
      }}
    >
      {/* Top row — tag chip + stock dot */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 22 }}>
        <div style={block({ width: 78, height: 18, borderRadius: 999 })} />
        <div style={block({ width: 56, height: 12, borderRadius: 999 })} />
      </div>

      {/* Algo */}
      <div style={block({ width: 64, height: 11 })} />

      {/* Product name (h3) */}
      <div style={block({ width: '70%', height: 22, marginTop: -6 })} />

      {/* Hashrate (big number) */}
      <div style={block({ width: 168, height: 44 })} />

      {/* 4 spec blocks (2x2) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px', paddingTop: 14, borderTop: '1px dashed rgba(10,22,40,0.10)' }}>
        {Array.from({ length: 4 }).map((_, k) => (
          <div key={k}>
            <div style={block({ width: 44, height: 9, marginBottom: 6 })} />
            <div style={block({ width: 72, height: 13 })} />
          </div>
        ))}
      </div>

      {/* Price row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingTop: 14, borderTop: '1px solid rgba(10,22,40,0.08)' }}>
        <div style={block({ width: 110, height: 24 })} />
        <div style={block({ width: 36, height: 10, marginLeft: 'auto' })} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
        <div style={block({ flex: 1, height: 38, borderRadius: 999 })} />
        <div style={block({ width: 72, height: 38, borderRadius: 999 })} />
      </div>
    </div>
  )
}

function ProductCard({ p, i, contact, origin }: { p: Product; i: number; contact: SiteContact | null; origin: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const waHref = buildWaHref(p, contact, origin)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('is-visible'); io.disconnect() } },
      { threshold: 0, rootMargin: '0px 0px 400px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const _status = statusOf(p)
  const _isInStock = _status === 'In Stock'
  const _isSoldOut = _status === 'Sold Out'
  const isBestSeller = !!p.bestSeller && _isInStock

  // Tone palette — adjusts every text/border so contrast holds on the dark animated gradient
  const tones = isBestSeller
    ? {
        algo:         'rgba(184,230,138,0.85)',
        name:         'var(--cream)',
        hashrateNum:  'var(--mint-400)',
        hashrateUnit: 'rgba(251,251,243,0.65)',
        specLabel:    'rgba(184,230,138,0.70)',
        specValue:    'var(--cream)',
        dashedBorder: 'rgba(168,224,99,0.22)',
        solidBorder:  'rgba(168,224,99,0.18)',
        price:        'var(--cream)',
        gst:          'rgba(184,230,138,0.70)',
        stockText:    'var(--mint-300)',
        stockDot:     'var(--mint-400)',
      }
    : {
        algo:         'var(--navy-300)',
        name:         'var(--ink)',
        hashrateNum:  'var(--mint-500)',
        hashrateUnit: 'var(--navy-400)',
        specLabel:    'var(--navy-300)',
        specValue:    'var(--ink)',
        dashedBorder: 'rgba(10,22,40,0.12)',
        solidBorder:  'rgba(10,22,40,0.08)',
        price:        'var(--ink)',
        gst:          'var(--navy-300)',
        stockText:    _isInStock ? 'var(--mint-500)' : _isSoldOut ? '#e11d48' : 'var(--navy-300)',
        stockDot:     _isInStock ? 'var(--mint-500)' : _isSoldOut ? '#e11d48' : 'var(--navy-300)',
      }

  const cardStyle: React.CSSProperties = {
    transitionDelay: `${i * 80}ms`,
    borderRadius: 'var(--radius-lg)',
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    opacity: _isInStock ? 1 : 0.65,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
  }
  // Best-seller card colors come from the .is-bestseller CSS class so the
  // animated gradient + halo can drive them. For everyone else, set inline.
  if (!isBestSeller) {
    cardStyle.background = _isInStock ? 'var(--cream)' : 'rgba(251,251,243,0.5)'
    cardStyle.border = '1px solid rgba(10,22,40,0.1)'
  }

  return (
    <div
      ref={ref}
      className={`reveal mag-card ${isBestSeller ? 'is-bestseller' : ''}`}
      style={cardStyle}
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/shop/${p.slug}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          router.push(`/shop/${p.slug}`)
        }
      }}
    >
      {isBestSeller && (
        <span
          className="bestseller-badge mono"
          style={{
            position: 'absolute',
            top: 22,
            left: 22,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px 5px 7px',
            borderRadius: 999,
            background: 'rgba(10,22,40,0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid rgba(168,224,99,0.35)',
            color: 'var(--mint-300)',
            fontSize: 9,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 700,
            boxShadow: '0 6px 16px -6px rgba(0,0,0,0.45)',
            zIndex: 2,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Best Seller
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 22, position: 'relative', zIndex: 1 }}>
        {isBestSeller ? (
          <span aria-hidden style={{ visibility: 'hidden' }} className="mono">Best Seller</span>
        ) : (
          <span className="mono" style={{
            background: _isInStock ? 'var(--navy-900)' : 'rgba(10,22,40,0.15)',
            color: _isInStock ? 'var(--mint-400)' : 'var(--navy-500)',
            padding: '4px 10px', borderRadius: 999, fontSize: 9.5,
          }}>
            {p.tag}
          </span>
        )}
        <span className="mono" style={{ color: tones.stockText, fontSize: 9.5, display: 'flex', alignItems: 'center', gap: 5, position: 'relative', zIndex: 1 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: tones.stockDot, display: 'inline-block' }} />
          {_status}
        </span>
      </div>

      <div className="mono" style={{ color: tones.algo, fontSize: 10, position: 'relative', zIndex: 1 }}>{p.algo}</div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,2vw,24px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: -6, color: tones.name, position: 'relative', zIndex: 1 }}>
        {p.name}
      </h3>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, letterSpacing: '-0.04em', color: tones.hashrateNum, lineHeight: 1, position: 'relative', zIndex: 1 }}>
        {p.hashrateNum}
        <span style={{ fontSize: '40%', color: tones.hashrateUnit, marginLeft: 5, fontWeight: 600 }}>{p.hashrateUnit}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px', paddingTop: 14, borderTop: `1px dashed ${tones.dashedBorder}`, position: 'relative', zIndex: 1 }}>
        {[
          { label: 'Power', val: p.power },
          { label: 'Efficiency', val: p.efficiency },
          { label: 'Noise', val: p.noise },
          { label: 'Contract', val: p.contract },
        ].map(({ label, val }) => (
          <div key={label}>
            <div className="mono" style={{ fontSize: 9, color: tones.specLabel, marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, color: tones.specValue }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingTop: 14, borderTop: `1px solid ${tones.solidBorder}`, position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px,2.5vw,26px)', letterSpacing: '-0.03em', color: tones.price }}>
          {p.priceDisplay}
        </span>
        <span className="mono" style={{ color: tones.gst, fontSize: 10, marginLeft: 'auto' }}>+ GST</span>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 2, position: 'relative', zIndex: 1 }}>
        {_isInStock ? (
          <>
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buy ${p.name} — chat on WhatsApp`}
                onClick={(e) => e.stopPropagation()}
                className="btn-primary"
                style={{
                  flex: 1, justifyContent: 'center', padding: '11px 14px', fontSize: 10.5,
                  ...(isBestSeller && {
                    background: 'var(--mint-400)',
                    color: 'var(--navy-900)',
                    boxShadow: '0 6px 18px -6px rgba(168,224,99,0.55)',
                  }),
                }}
              >
                <span className="dot" style={isBestSeller ? { background: 'var(--navy-900)' } : undefined} /> Buy Miner →
              </a>
            ) : (
              <Link
                href={`/shop/${p.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="btn-primary"
                style={{
                  flex: 1, justifyContent: 'center', padding: '11px 14px', fontSize: 10.5,
                  ...(isBestSeller && {
                    background: 'var(--mint-400)',
                    color: 'var(--navy-900)',
                    boxShadow: '0 6px 18px -6px rgba(168,224,99,0.55)',
                  }),
                }}
              >
                <span className="dot" style={isBestSeller ? { background: 'var(--navy-900)' } : undefined} /> Buy Miner →
              </Link>
            )}
            <Link
              href={`/shop/${p.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="btn-ghost"
              style={{
                padding: '11px 14px', fontSize: 10.5,
                ...(isBestSeller && {
                  color: 'var(--mint-300)',
                  borderColor: 'rgba(168,224,99,0.40)',
                  background: 'rgba(168,224,99,0.06)',
                }),
              }}
            >
              Details
            </Link>
          </>
        ) : _isSoldOut ? (
          <Link href={`/shop/${p.slug}`} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '11px 14px', fontSize: 10.5, opacity: 0.7 }}>
            Sold Out — View →
          </Link>
        ) : (
          <Link href={`/shop/${p.slug}`} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', padding: '11px 14px', fontSize: 10.5 }}>
            Coming Soon →
          </Link>
        )}
      </div>
    </div>
  )
}

// Products + CMS page data are fetched server-side in page.tsx and passed in,
// so the hero H1, the full product grid and every /shop/[slug] link are in the
// initial SSR HTML. We keep a client refetch only as a fallback for the rare
// case the server fetch returned nothing (transient API blip).
export default function ShopClient({ initialProducts, initialPage }: { initialProducts: Product[]; initialPage: ShopPageData | null }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [productsLoading, setProductsLoading] = useState(false)
  const [contact, setContact] = useState<SiteContact | null>(null)
  const [origin, setOrigin] = useState('')
  const page = initialPage

  useEffect(() => {
    if (initialProducts.length > 0) return
    let cancelled = false
    setProductsLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-products`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setProducts(d.products ?? []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setProductsLoading(false) })
    return () => { cancelled = true }
  }, [initialProducts])

  useEffect(() => {
    fetchSiteSettings().then((s) => setContact(s.contact ?? null)).catch(() => {})
    if (typeof window !== 'undefined') setOrigin(window.location.origin)
  }, [])

  const hero        = page?.hero
  const filterBlock = page?.filters
  const empty       = page?.emptyState
  const trust       = page?.trust

  const FILTERS = filterBlock?.algos && filterBlock.algos.length > 0 ? filterBlock.algos : DEFAULT_FILTERS
  const TRUST   = trust?.items && trust.items.length > 0 ? trust.items : DEFAULT_TRUST

  const filtered = products.filter(p => activeFilter === 'All' || p.algo === activeFilter)

  return (
    <main>
      <style>{`
        /* Skeleton loader — gentle shimmer pulse */
        .product-skeleton {
          animation: skeletonPulse 1.4s ease-in-out infinite;
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          .product-skeleton { animation: none; opacity: 0.85; }
        }

        /* Best-seller card — animated mint-on-navy gradient with halo pulse */
        .mag-card.is-bestseller {
          background-color: #0A1628;
          background-image:
            radial-gradient(60% 55% at 18% 28%, rgba(168, 224, 99, 0.42), rgba(168, 224, 99, 0) 62%),
            radial-gradient(55% 50% at 82% 78%, rgba(143, 203, 72, 0.32), rgba(143, 203, 72, 0) 65%),
            radial-gradient(40% 45% at 55% 50%, rgba(184, 230, 138, 0.10), rgba(184, 230, 138, 0) 70%),
            linear-gradient(135deg, #0A1628 0%, #122546 45%, #0F1F38 100%);
          background-size: 220% 220%, 220% 220%, 240% 240%, 100% 100%;
          background-position: 0% 0%, 100% 100%, 50% 50%, 0% 0%;
          border: 1.5px solid var(--mint-400);
          color: var(--cream);
          box-shadow:
            0 0 0 3px rgba(168,224,99,0.10),
            0 14px 32px -16px rgba(168,224,99,0.40),
            0 4px 16px -6px rgba(10,22,40,0.20);
          animation:
            bestsellerGradient 14s ease-in-out infinite,
            bestsellerPulse 2.8s ease-in-out infinite;
        }
        @keyframes bestsellerGradient {
          0%   { background-position:   0%   0%, 100% 100%,  50%  50%, 0% 0%; }
          25%  { background-position:  60%  20%,  40%  80%,  35%  70%, 0% 0%; }
          50%  { background-position: 100% 100%,   0%   0%,  65%  30%, 0% 0%; }
          75%  { background-position:  40%  80%,  60%  20%,  30%  60%, 0% 0%; }
          100% { background-position:   0%   0%, 100% 100%,  50%  50%, 0% 0%; }
        }
        @keyframes bestsellerPulse {
          0%, 100% {
            box-shadow:
              0 0 0 3px rgba(168,224,99,0.10),
              0 14px 32px -16px rgba(168,224,99,0.40),
              0 4px 16px -6px rgba(10,22,40,0.20);
          }
          50% {
            box-shadow:
              0 0 0 5px rgba(168,224,99,0.18),
              0 24px 48px -14px rgba(168,224,99,0.55),
              0 4px 16px -6px rgba(10,22,40,0.25);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mag-card.is-bestseller { animation: none; }
        }
      `}</style>
      <Navbar />
      {hero?.visible !== false && (
        <InnerHero
          tagNum={hero?.tagNum ?? '01'}
          tagLabel={hero?.tagLabel ?? 'mining hardware'}
          headline={hero?.headline ?? 'Pick your'}
          italicWord={hero?.italicWord ?? 'rig.'}
          mono={hero?.mono ?? 'real machines · real hashrate · daily BTC payouts'}
          bgVariant="cream"
        />
      )}

      {filterBlock?.visible !== false && (
        <div style={{
          position: 'sticky', top: 76, zIndex: 50,
          background: 'rgba(251,251,243,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(10,22,40,0.08)',
          padding: '14px clamp(24px,5vw,80px)',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="mono"
                  style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 10.5, border: 'none',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: activeFilter === f ? 'var(--navy-900)' : 'rgba(10,22,40,0.06)',
                    color: activeFilter === f ? 'var(--mint-400)' : 'var(--navy-500)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="mono" style={{ padding: '5px 10px', borderRadius: 999, background: 'var(--mint-100)', color: 'var(--mint-500)', fontSize: 9.5, border: '1px solid var(--mint-200)' }}>
              {filterBlock?.gstNote ?? '+ 18% GST'}
            </span>
          </div>
        </div>
      )}

      <section style={{ padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,80px)', background: 'var(--cream-2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
            {productsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={`skeleton-${i}`} i={i} />
                ))
              : filtered.map((p, i) => (
                  <ProductCard key={p.slug} p={p} i={i} contact={contact} origin={origin} />
                ))}
          </div>
          {!productsLoading && filtered.length === 0 && empty?.visible !== false && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--navy-300)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                {empty?.title ?? 'No miners in this category yet.'}
              </div>
              <p className="mono" style={{ fontSize: 11 }}>// {empty?.body ?? 'check back soon — new hardware arrives monthly'}</p>
            </div>
          )}
        </div>
      </section>

      {trust?.visible !== false && (
        <section style={{ background: 'var(--navy-900)', padding: 'clamp(40px,5vw,60px) clamp(24px,5vw,80px)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {TRUST.map(({ icon, label, desc }) => (
              <div key={label} style={{ color: 'var(--cream)' }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{label}</div>
                <p className="mono" style={{ fontSize: 10, color: 'rgba(251,251,243,0.45)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <FooterCTA />
    </main>
  )
}
