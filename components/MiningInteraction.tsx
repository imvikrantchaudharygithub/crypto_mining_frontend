'use client'

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface Stone {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  vRot: number
  size: number
  color: string
  shape: number
  life: number
}

interface Flash {
  id: number
  x: number
  y: number
}

const STONE_COLORS = ['#A8E063', '#D4F0B0', '#FBFBF3', '#8FCB48', '#6B7A8F', '#A8E063']
const STONE_RADII = [
  '38% 62% 63% 37% / 41% 44% 56% 59%',
  '50% 50% 33% 67% / 55% 45% 55% 45%',
  '63% 37% 54% 46% / 49% 60% 40% 51%',
  '40% 60% 70% 30% / 60% 30% 70% 40%',
]

export function MiningInteraction({ children }: { children: ReactNode }) {
  const [stones, setStones] = useState<Stone[]>([])
  const [flashes, setFlashes] = useState<Flash[]>([])
  const [cursor, setCursor] = useState({ x: -100, y: -100, visible: false, swingId: 0 })
  const [mounted, setMounted] = useState(false)
  const rafRef = useRef<number | null>(null)
  const idCounter = useRef(0)

  useEffect(() => { setMounted(true) }, [])

  const spawn = useCallback((clientX: number, clientY: number) => {
    const fid = idCounter.current++
    setFlashes(prev => [...prev, { id: fid, x: clientX, y: clientY }])
    setTimeout(() => setFlashes(prev => prev.filter(f => f.id !== fid)), 600)

    const count = 10 + Math.floor(Math.random() * 5)
    const newStones: Stone[] = []
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4
      const speed = 5 + Math.random() * 7
      newStones.push({
        id: idCounter.current++,
        x: clientX,
        y: clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 24,
        size: 6 + Math.random() * 9,
        color: STONE_COLORS[Math.floor(Math.random() * STONE_COLORS.length)],
        shape: Math.floor(Math.random() * STONE_RADII.length),
        life: 1,
      })
    }
    setStones(prev => {
      const next = [...prev, ...newStones]
      return next.length > 80 ? next.slice(next.length - 80) : next
    })
  }, [])

  useEffect(() => {
    const tick = () => {
      setStones(prev => {
        if (prev.length === 0) return prev
        const vh = window.innerHeight
        const next: Stone[] = []
        for (let i = 0; i < prev.length; i++) {
          const s = prev[i]
          const nx = s.x + s.vx
          const ny = s.y + s.vy
          const nvy = s.vy + 0.42
          const nvx = s.vx * 0.99
          const nrot = s.rotation + s.vRot
          const nlife = s.life - 0.011
          if (nlife > 0 && ny <= vh + 80) {
            next.push({ ...s, x: nx, y: ny, vx: nvx, vy: nvy, rotation: nrot, life: nlife })
          }
        }
        return next
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        className="mining-zone"
        onMouseMove={e => setCursor(c => ({ ...c, x: e.clientX, y: e.clientY, visible: true }))}
        onMouseEnter={e => setCursor(c => ({ ...c, x: e.clientX, y: e.clientY, visible: true }))}
        onMouseLeave={() => setCursor(c => ({ ...c, visible: false }))}
        onMouseDown={e => {
          spawn(e.clientX, e.clientY)
          setCursor(c => ({ ...c, swingId: c.swingId + 1 }))
        }}
      >
        {children}
      </div>

      {mounted && createPortal(
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 99999,
          }}
        >
          {/* Custom pickaxe cursor */}
          {cursor.visible && (
            <div
              key={cursor.swingId}
              style={{
                position: 'absolute',
                left: cursor.x,
                top: cursor.y,
                width: 40,
                height: 40,
                transform: 'translate(-6px, -6px)',
                animation: cursor.swingId > 0 ? 'pickaxeSwing 280ms cubic-bezier(.4,.8,.3,1)' : 'none',
                transformOrigin: '12px 12px',
                filter: 'drop-shadow(0 2px 4px rgba(10,22,40,0.5))',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <g stroke="#FBFBF3" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 3 11 Q 11 3 21 9" stroke="#A8E063" strokeWidth={4.2} />
                  <path d="M 3 11 Q 11 3 21 9" />
                  <path d="M 11 5 L 11 13" />
                  <path d="M 16 7 L 16 15" />
                  <path d="M 13 11 L 22 28" />
                </g>
              </svg>
            </div>
          )}

          {/* Hit flashes */}
          {flashes.map(f => (
            <span
              key={f.id}
              style={{
                position: 'absolute',
                left: f.x,
                top: f.y,
                width: 6,
                height: 6,
                borderRadius: '50%',
                border: '2px solid var(--mint-400)',
                transform: 'translate(-50%, -50%)',
                animation: 'hitRing 0.55s ease-out forwards',
              }}
            />
          ))}

          {/* Stones */}
          {stones.map(s => (
            <span
              key={s.id}
              style={{
                position: 'absolute',
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                background: s.color,
                borderRadius: STONE_RADII[s.shape],
                transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
                opacity: Math.max(0, Math.min(1, s.life * 1.3)),
                boxShadow: '0 0 8px rgba(168,224,99,0.5), 0 1px 2px rgba(10,22,40,0.5), inset -1px -1px 2px rgba(0,0,0,0.25)',
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>,
        document.body
      )}

      <style>{`
        .mining-zone, .mining-zone * { cursor: none !important; }
        @keyframes hitRing {
          0%   { width: 6px;   height: 6px;   opacity: 1;   border-width: 3px; }
          100% { width: 90px;  height: 90px;  opacity: 0;   border-width: 1px; }
        }
        @keyframes pickaxeSwing {
          0%   { transform: translate(-6px, -6px) rotate(0deg)   scale(1); }
          30%  { transform: translate(-10px, -2px) rotate(-42deg) scale(1.08); }
          60%  { transform: translate(-2px, -10px) rotate(18deg)  scale(1.04); }
          100% { transform: translate(-6px, -6px) rotate(0deg)   scale(1); }
        }
      `}</style>
    </>
  )
}
