type MarqueeData = {
  visible?: boolean
  items?: { label: string; value: string }[]
} | null

const DEFAULT_ITEMS = [
  { label: 'Total Hashrate', value: '2,840 PH/s' },
  { label: 'Active Miners',  value: '52,847' },
  { label: 'Paid Out',       value: '$12.4M' },
  { label: 'Uptime',         value: '99.94%' },
  { label: 'Days Mining',    value: '3,287' },
]

export default function StatsMarquee({ data, items }: { data?: MarqueeData; items?: { label: string; value: string }[] }) {
  if (data?.visible === false) return null
  const ITEMS_SRC = data?.items ?? items
  const ITEMS = ITEMS_SRC && ITEMS_SRC.length > 0 ? ITEMS_SRC : DEFAULT_ITEMS
  return (
    <section
      className="cs-mint"
      style={{
        padding: '56px 0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(10,22,40,0.08)',
        borderBottom: '1px solid rgba(10,22,40,0.08)',
      }}
    >
      <div className="marquee-track">
        {[0, 1].map((rep) => (
          <div
            key={rep}
            style={{ display: 'flex', gap: 60, paddingRight: 60, flexShrink: 0 }}
          >
            {ITEMS.map((it, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexShrink: 0 }}
              >
                <span className="mono" style={{ color: 'var(--navy-500)', fontSize: 11 }}>
                  // {it.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 'clamp(36px, 4vw, 56px)',
                    letterSpacing: '-0.03em',
                    color: 'var(--navy-900)',
                    lineHeight: 1,
                  }}
                >
                  {it.value}
                </span>
                <span style={{ color: 'var(--mint-500)', fontSize: 28 }}>✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
