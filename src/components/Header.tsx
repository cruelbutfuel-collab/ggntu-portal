'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Arrow } from './icons'

const NAV = [
  { to: '/',              label: 'Главная' },
  { to: '/about',         label: 'О чат-боте' },
  { to: '/diagnostics',   label: 'Диагностика' },
  { to: '/specialties',   label: 'Специальности' },
  { to: '/calculator',   label: 'Калькулятор ЕГЭ' },
  { to: '/admission',     label: 'Поступление' },
  { to: '/chat',          label: 'Чат-бот' },
  { to: '/contacts',      label: 'Контакты' },
]

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap header__row">
        <Link href="/" className="brand">
          <Image
            src="/logo.png"
            alt="ГГНТУ"
            width={52}
            height={52}
            className="brand__logo"
            priority
          />
          <span className="brand__text">
            <span className="brand__name">
              ГГНТУ
              <em>·</em>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)', alignSelf: 'center' }}>
                портал
              </span>
            </span>
            <span className="brand__sub">Приёмная кампания · 2026/27</span>
          </span>
        </Link>

        <nav className={`nav${open ? ' is-open' : ''}`}>
          {NAV.map(n => (
            <Link
              key={n.to}
              href={n.to}
              className={`nav__link${pathname === n.to ? ' is-active' : ''}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link href="/chat" className="cta">
          Спросить Алию
          <span className="cta__arrow"><Arrow /></span>
        </Link>

        <button
          className={`burger${open ? ' is-open' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label="Меню"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
