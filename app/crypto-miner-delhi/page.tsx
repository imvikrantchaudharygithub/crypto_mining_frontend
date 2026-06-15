import Navbar from '@/components/Navbar'
import InnerHero from '@/components/InnerHero'
import FooterCTA from '@/components/FooterCTA'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

// Real, locally-relevant Q&As — emitted as FAQPage schema for rich results + AI Overviews.
const FAQS = [
  {
    q: 'Where can I buy an ASIC Bitcoin miner in Delhi?',
    a: 'Crypto Mining India is a Delhi-based supplier of genuine ASIC miners — Antminer S19/S21, Whatsminer and more. We serve all of Delhi NCR (New Delhi, Noida, Gurugram, Faridabad, Ghaziabad) with fast same-region delivery, plus pan-India shipping.',
  },
  {
    q: 'Do you offer on-site setup for miners in Delhi NCR?',
    a: 'Yes. Our Delhi-based engineers handle on-site installation, pool configuration, electrical and cooling guidance, and firmware tuning so your miner is hashing the same day it is set up.',
  },
  {
    q: 'Is the miner warranty serviced locally in Delhi?',
    a: 'Every miner ships with a 12-month India-local RMA. Replacements and repairs are handled within India — no factory ship-back to China and no overseas wait. Delhi NCR customers get the fastest turnaround.',
  },
  {
    q: 'Are the miners genuine and what payment options are available?',
    a: 'We sell only genuine, sealed hardware sourced from authorised channels. We support bank transfer and standard business payment methods, with GST invoicing for registered buyers.',
  },
  {
    q: 'Can you advise on electricity cost for mining in Delhi?',
    a: 'Yes. We help you estimate ₹/kWh running cost and break-even, and recommend the most efficient miner for your power tariff using our profitability calculator.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': `${SITE_URL}/crypto-miner-delhi#store`,
  name: 'Crypto Mining India — Crypto Miner Delhi',
  image: `${SITE_URL}/og-image.png`,
  url: `${SITE_URL}/crypto-miner-delhi`,
  telephone: '+91-99119-44472',
  priceRange: '₹₹₹',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'New Delhi',
    addressRegion: 'Delhi',
    addressCountry: 'IN',
  },
  areaServed: [
    { '@type': 'City', name: 'New Delhi' },
    { '@type': 'City', name: 'Noida' },
    { '@type': 'City', name: 'Gurugram' },
    { '@type': 'City', name: 'Faridabad' },
    { '@type': 'City', name: 'Ghaziabad' },
  ],
  sameAs: ['https://wa.me/919911944472'],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Crypto Miner Delhi', item: `${SITE_URL}/crypto-miner-delhi` },
  ],
}

const HIGHLIGHTS = [
  { k: 'Delhi NCR delivery', v: 'Fast same-region dispatch across New Delhi, Noida, Gurugram, Faridabad & Ghaziabad — plus pan-India shipping.' },
  { k: 'On-site setup', v: 'Local engineers install, configure pools, and tune firmware so your rig is hashing day one.' },
  { k: '12-month India RMA', v: 'Local warranty replacement — no factory ship-back to China, no overseas wait.' },
  { k: 'Genuine hardware', v: 'Sealed, authorised-channel Antminer, Whatsminer & more. GST invoicing available.' },
]

const sectionPad = { padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }
const wrap = { maxWidth: 1080, margin: '0 auto' as const }

export default function CryptoMinerDelhiPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Navbar />

      <InnerHero
        tagNum="01"
        tagLabel="crypto miner · delhi ncr"
        headline="Crypto Miner"
        italicWord="Delhi."
        mono="antminer · whatsminer · on-site setup · 12-month india rma"
        bgVariant="navy"
      />

      {/* Direct answer paragraph — what AI Overviews quote */}
      <section style={{ background: 'var(--cream)', ...sectionPad }}>
        <div style={wrap}>
          <div className="section-tag" style={{ marginBottom: 20 }}>buy in delhi</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
            Buy genuine ASIC Bitcoin miners in Delhi
          </h2>
          <p style={{ fontSize: 'clamp(16px,2vw,19px)', lineHeight: 1.7, color: 'var(--navy-700)', maxWidth: 760 }}>
            Crypto Mining India is a Delhi-based supplier of genuine crypto mining hardware —
            Antminer S19 / S21, Whatsminer and more. We serve all of Delhi NCR with fast
            same-region delivery, on-site installation, and a 12-month India-local warranty,
            backed by 24/7 support. Trusted by Indian miners since 2017.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 20, marginTop: 44 }}>
            {HIGHLIGHTS.map(({ k, v }) => (
              <div key={k} style={{ background: 'var(--cream-2)', border: '1px solid rgba(10,22,40,0.08)', borderRadius: 'var(--radius-lg)', padding: 'clamp(20px,2.5vw,28px)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{k}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--navy-500)' }}>{v}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 40 }}>
            <a href="/shop" className="btn-primary" style={{ fontSize: 12 }}><span className="dot" /> Browse miners</a>
            <a href="/profitability" className="btn-ghost" style={{ fontSize: 12 }}>Profitability calculator</a>
            <a href="/contact" className="btn-ghost" style={{ fontSize: 12 }}>Talk to Delhi team</a>
          </div>
        </div>
      </section>

      {/* Local FAQ — visible + FAQPage schema */}
      <section style={{ background: 'var(--cream-2)', ...sectionPad }}>
        <div style={wrap}>
          <div className="section-tag" style={{ marginBottom: 20 }}>delhi faqs</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 36 }}>
            Buying a crypto miner in Delhi — <em style={{ fontStyle: 'italic', color: 'var(--mint-500)' }}>answered.</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQS.map(({ q, a }) => (
              <div key={q} style={{ background: 'var(--cream)', border: '1px solid rgba(10,22,40,0.08)', borderRadius: 'var(--radius-lg)', padding: 'clamp(20px,2.5vw,28px)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(16px,2vw,19px)', marginBottom: 10 }}>{q}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--navy-600)' }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  )
}
