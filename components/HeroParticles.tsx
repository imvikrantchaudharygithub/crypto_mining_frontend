'use client'

import { useEffect, useRef } from 'react'

interface Dot {
  x: number; y: number
  ox: number; oy: number
  phase: number
}
interface FloatCoin {
  x: number; y: number
  vx: number; vy: number
  r: number; phase: number
}
interface TickerCoin {
  x: number; y: number          // normalized 0..1
  vx: number; vy: number
  r: number; phase: number
  label: string
}

// Spread starting positions so the 5 bubbles don't collide and stay clear of
// the headline column in the middle.
const TICKER_SEEDS: { label: string; x: number; y: number }[] = [
  { label: 'BTC', x: 0.14, y: 0.24 },
  { label: 'ETH', x: 0.86, y: 0.30 },
  { label: 'KAS', x: 0.18, y: 0.74 },
  { label: 'LTC', x: 0.82, y: 0.68 },
  { label: 'ZEC', x: 0.50, y: 0.88 },
]

export default function HeroParticles({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width  = rect.width  * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.getBoundingClientRect().width
    const H = () => canvas.getBoundingClientRect().height

    // Dot grid
    const cols = 38, rows = 20
    const dots: Dot[] = []
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const ox = (i / (cols - 1)) * W()
        const oy = (j / (rows - 1)) * H()
        dots.push({ x: ox, y: oy, ox, oy, phase: Math.random() * Math.PI * 2 })
      }
    }

    // Ambient mint glows (unlabeled — atmospheric only)
    const coins: FloatCoin[] = Array.from({ length: 6 }, () => ({
      x:  0.15 + Math.random() * 0.7,
      y:  0.15 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.0005,
      vy: (Math.random() - 0.5) * 0.0005,
      r:  28 + Math.random() * 28,
      phase: Math.random() * Math.PI * 2,
    }))

    // Labeled crypto ticker bubbles — BTC, ETH, KAS, LTC, ZEC
    const tickers: TickerCoin[] = TICKER_SEEDS.map((seed) => ({
      x: seed.x,
      y: seed.y,
      vx: (Math.random() - 0.5) * 0.00055,
      vy: (Math.random() - 0.5) * 0.00055,
      r: 46 + Math.random() * 8,
      phase: Math.random() * Math.PI * 2,
      label: seed.label,
    }))

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    }
    window.addEventListener('mousemove', onMove)

    const t0 = performance.now()

    const tick = () => {
      const t = (performance.now() - t0) / 1000
      const w = W(), h = H()
      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x * w
      const my = mouseRef.current.y * h

      // Dots
      dots.forEach((d) => {
        const dx = mx - d.ox
        const dy = my - d.oy
        const dist = Math.hypot(dx, dy)
        const force = Math.max(0, 1 - dist / 240) * 22 * intensity
        const ang = Math.atan2(dy, dx)
        d.x = d.ox + Math.cos(ang) * force + Math.sin(t * 0.6 + d.phase) * 1.4
        d.y = d.oy + Math.sin(ang) * force + Math.cos(t * 0.6 + d.phase) * 1.4
        const a = 0.16 + Math.min(0.45, force / 28)
        ctx.fillStyle = `rgba(10,22,40,${a})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Ambient glow blobs
      coins.forEach((c) => {
        c.x += c.vx; c.y += c.vy
        if (c.x < 0.08 || c.x > 0.92) c.vx *= -1
        if (c.y < 0.08 || c.y > 0.92) c.vy *= -1
        const cx = c.x * w
        const cy = c.y * h + Math.sin(t + c.phase) * 8
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.r)
        grd.addColorStop(0, 'rgba(168,224,99,0.55)')
        grd.addColorStop(1, 'rgba(168,224,99,0)')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(cx, cy, c.r, 0, Math.PI * 2)
        ctx.fill()
        // Coin disc (unlabeled)
        ctx.fillStyle = 'rgba(168,224,99,0.88)'
        ctx.strokeStyle = '#0A1628'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(cx, cy, c.r * 0.44, 0, Math.PI * 2)
        ctx.fill(); ctx.stroke()
      })

      // Labeled ticker bubbles — paint last so labels read above everything
      const mobileScale = w < 600 ? 0.72 : w < 900 ? 0.86 : 1
      tickers.forEach((c) => {
        c.x += c.vx; c.y += c.vy
        if (c.x < 0.08 || c.x > 0.92) c.vx *= -1
        if (c.y < 0.10 || c.y > 0.92) c.vy *= -1
        const cx = c.x * w
        const cy = c.y * h + Math.sin(t * 0.85 + c.phase) * 6
        const r = c.r * mobileScale
        const discR = r * 0.58

        // Outer mint halo
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        halo.addColorStop(0, 'rgba(168,224,99,0.55)')
        halo.addColorStop(0.6, 'rgba(168,224,99,0.18)')
        halo.addColorStop(1, 'rgba(168,224,99,0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()

        // Disc
        const disc = ctx.createRadialGradient(cx - discR * 0.3, cy - discR * 0.35, 0, cx, cy, discR)
        disc.addColorStop(0, 'rgba(232,247,212,0.98)')
        disc.addColorStop(1, 'rgba(168,224,99,0.96)')
        ctx.fillStyle = disc
        ctx.beginPath()
        ctx.arc(cx, cy, discR, 0, Math.PI * 2)
        ctx.fill()

        // Disc ring
        ctx.strokeStyle = '#0A1628'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(cx, cy, discR, 0, Math.PI * 2)
        ctx.stroke()

        // Ticker label
        const fontSize = Math.round(discR * 0.62)
        ctx.fillStyle = '#0A1628'
        ctx.font = `700 ${fontSize}px "JetBrains Mono", ui-monospace, Menlo, monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // +1 nudges optical center for monospace caps
        ctx.fillText(c.label, cx, cy + 1)
      })

      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
