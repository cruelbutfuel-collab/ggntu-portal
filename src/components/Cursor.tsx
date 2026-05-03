'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let x = 0, y = 0, tx = 0, ty = 0
    let rafId: number

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    const onOver = (e: MouseEvent) => {
      const t = (e.target as Element).closest('a, button, .spec-row, .faq-item, .fac-row')
      el.classList.toggle('is-link', !!t)
    }
    const tick = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    rafId = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <div className="cursor" ref={ref} />
}
