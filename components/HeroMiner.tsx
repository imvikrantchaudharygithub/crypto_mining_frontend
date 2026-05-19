'use client'

import Lottie from 'lottie-react'
import animationData from '../public/animations/miner-guy.json'

export default function HeroMiner() {
  return (
    <div
      className="hide-mobile"
      style={{
        position: 'absolute',
        bottom: '6%',
        right: '2%',
        width: 'clamp(260px, 26vw, 420px)',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      {/* mint glow behind the character */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 80%, rgba(0,217,192,0.18), transparent)',
        borderRadius: '50%',
      }} />
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: '100%', height: 'auto', position: 'relative' }}
      />
    </div>
  )
}
