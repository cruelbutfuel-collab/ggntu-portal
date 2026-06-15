'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_ok')) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_ok', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Уведомление о куки">
      <p className="cookie-banner__text">
        Мы используем файлы cookie для улучшения работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с&nbsp;
        <span style={{ color: 'var(--red)' }}>политикой обработки персональных данных</span>.
      </p>
      <button className="cookie-banner__btn" onClick={accept}>
        Принять
      </button>
    </div>
  )
}
