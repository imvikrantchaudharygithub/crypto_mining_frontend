import { ImageResponse } from 'next/og'
import { getGuide } from '@/lib/guides'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Crypto Mining India — Learn'

export default function OG({ params }: { params: { slug: string } }) {
  const g = getGuide(params.slug)
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
        <div style={{ fontSize: 28, color: '#5eead4', letterSpacing: 2 }}>CRYPTO MINING INDIA · LEARN</div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, display: 'flex' }}>
          {g?.title ?? 'Crypto Mining Guide'}
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8' }}>cryptominingindia.com/learn</div>
      </div>
    ),
    { ...size }
  )
}
