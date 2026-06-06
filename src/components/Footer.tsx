import Link from 'next/link'

const NAV = [
  { to: '/',            label: 'Главная' },
  { to: '/about',       label: 'О чат-боте' },
  { to: '/specialties', label: 'Специальности' },
  { to: '/admission',   label: 'Поступление' },
  { to: '/chat',        label: 'Чат-бот' },
  { to: '/contacts',    label: 'Контакты' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__col">
            <div className="footer__intro">
              Портал абитуриента — место, где <em>вопросы</em> встречаются с ответами.
            </div>
          </div>
          <div className="footer__col">
            <h5>Навигация</h5>
            {NAV.map(n => (
              <Link key={n.to} href={n.to}>{n.label}</Link>
            ))}
          </div>
          <div className="footer__col">
            <h5>Абитуриентам</h5>
            <Link href="/admission">Сроки приёма</Link>
            <Link href="/admission">Документы</Link>
            <Link href="/admission">Экзамены ЕГЭ</Link>
            <Link href="/specialties">Все направления</Link>
          </div>
          <div className="footer__col">
            <h5>Контакты</h5>
            <span>пр-т Х.А. Исаева, 100</span>
            <a href="tel:+79290036666">+7 929 003 66 66</a>
            <a href="mailto:priem@gstou.ru">priem@gstou.ru</a>
            <span>Пн–Пт · 9:00–17:00</span>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 · Дипломный проект — система профориентации</span>
          <span>Версия портала · 02 — апрель 2026</span>
        </div>
        <div className="footer__big">Алия</div>
      </div>
    </footer>
  )
}
