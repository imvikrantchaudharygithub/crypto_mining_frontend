'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  duration?: number
  decimals?: number
}

export default function AnimatedNumber({ value, duration = 1800, decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let started = false

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true
          const t0 = performance.now()
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setN(parseFloat((value * eased).toFixed(decimals)))
            if (p < 1) raf = requestAnimationFrame(tick)
            else setN(value)
          }
          raf = requestAnimationFrame(tick)
        }
      })
    }, { threshold: 0.4 })

    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value, duration, decimals])

  return (
    <span ref={ref} className="tab-num">
      {decimals > 0 ? n.toFixed(decimals) : Math.floor(n).toLocaleString()}
    </span>
  )
}
