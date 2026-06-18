import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Crypto Mining India — ASIC miner'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.cryptominingindia.com/api'

export default async function OG({ params }: { params: { slug: string } }) {
  const p: any = await fetch(`${API}/get-product/${params.slug}`)
    .then((r) => r.json())
    .then((d) => d?.product)
    .catch(() => null)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A1628',
          color: '#fff',
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#5eead4', letterSpacing: 2 }}>CRYPTO MINING INDIA</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 64, fontWeight: 700 }}>{p?.name ?? 'ASIC Miner'}</div>
          <div style={{ fontSize: 32, color: '#94a3b8', marginTop: 12 }}>
            {[p?.hashrate, p?.power, p?.efficiency].filter(Boolean).join('  ·  ')}
          </div>
        </div>
        <div style={{ fontSize: 44, fontWeight: 700 }}>
          {p?.price ? '₹' + Number(p.price).toLocaleString('en-IN') : 'Buy in India'}
        </div>
      </div>
    ),
    { ...size }
  )
}
