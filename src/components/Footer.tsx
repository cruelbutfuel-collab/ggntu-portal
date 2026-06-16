import Link from 'next/link'

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
            <Link href="/">Главная</Link>
            <Link href="/chat">Чат-бот Алия</Link>
            <Link href="/diagnostics">Диагностика</Link>
            <Link href="/specialties">Специальности</Link>
            <Link href="/calculator">Калькулятор</Link>
            <Link href="/prep">Подготовка</Link>
            <Link href="/exams">Расписание</Link>
            <Link href="/admission">Поступление</Link>
            <Link href="/contacts">Контакты</Link>
          </div>
          <div className="footer__col">
            <h5>Абитуриентам</h5>
            <Link href="/admission">Сроки приёма</Link>
            <Link href="/admission">Документы</Link>
            <Link href="/exams">Экзамены ЕГЭ</Link>
            <Link href="/specialties">Все направления</Link>
            <Link href="/about">О чат-боте</Link>
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
          <span>© 2026 · Портал абитуриента ГГНТУ</span>
          <span>Версия портала · 02 — апрель 2026</span>
        </div>
        <div className="footer__big">Алия</div>
      </div>
    </footer>
  )
}
