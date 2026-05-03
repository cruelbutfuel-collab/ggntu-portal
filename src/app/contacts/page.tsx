'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { Arrow } from '@/components/icons'

const FAQ = [
  { q: 'Когда начинается приём документов?',    a: 'Приём документов открывается 20 июня. До 25 июля — на бюджет очной формы, до 31 августа — на заочную.' },
  { q: 'Можно ли подать документы онлайн?',     a: 'Да — через Госуслуги, на email priem@example.edu или заказным письмом с описью вложений.' },
  { q: 'Есть ли бюджетные места?',              a: 'Да, на большинстве направлений. Распределение — по конкурсу ЕГЭ внутри института.' },
  { q: 'Какие экзамены нужно сдать?',           a: 'Русский язык + профильный предмет (математика, физика, информатика или обществознание — зависит от направления).' },
  { q: 'Что делать, если нет результатов ЕГЭ?', a: 'Можно поступить через внутренние вступительные испытания университета. Уточни перечень в приёмной комиссии.' },
  { q: 'Есть ли общежитие?',                    a: 'Да, иногородние студенты подают заявление на место в общежитии при подаче документов.' },
]

export default function Contacts() {
  useReveal()
  const [open, setOpen] = useState(0)

  return (
    <main className="page">
      <section className="contacts">
        <div className="wrap">
          <div className="contacts__hero r">
            <div className="eyebrow" style={{ marginBottom: 24 }}>№ 05 / Связь с приёмной комиссией</div>
            <h1 className="h-1">Свяжись<br />удобным <em>способом</em>.</h1>
          </div>

          <div className="contacts__grid r-stagger">
            <div className="contact-cell">
              <div className="contact-cell__lbl"><b>01</b> · адрес</div>
              <div className="contact-cell__val">пр-т Х.А. Исаева, 100</div>
              <div className="contact-cell__sub">364051, Чеченская Республика, г. Грозный</div>
            </div>
            <div className="contact-cell">
              <div className="contact-cell__lbl"><b>02</b> · приёмная комиссия</div>
              <div className="contact-cell__val"><a href="tel:+79290036666">+7 929 003 66 66</a></div>
              <div className="contact-cell__sub">+7 929 008 66 66 · 8 800 222 79 74 (бесплатно)</div>
            </div>
            <div className="contact-cell">
              <div className="contact-cell__lbl"><b>03</b> · email</div>
              <div className="contact-cell__val"><a href="mailto:priem@example.edu">priem@example.edu</a></div>
              <div className="contact-cell__sub">info@example.edu</div>
            </div>
            <div className="contact-cell">
              <div className="contact-cell__lbl"><b>04</b> · режим работы</div>
              <div className="contact-cell__val">Пн–Пт<br />9:00 — 17:00</div>
              <div className="contact-cell__sub">Перерыв · 13:00 — 14:00</div>
            </div>
          </div>

          <div className="faq">
            <div className="section__head r">
              <div>
                <div className="section__num"><b>06</b>Частые вопросы</div>
                <h2 className="h-1">Уже отвечали<br /><em>не раз</em>.</h2>
              </div>
              <p className="lead muted">
                Не нашёл свой вопрос — задай его Алие.
                Если не справится, переключим на живого специалиста.
              </p>
            </div>

            <div className="faq__list">
              {FAQ.map((f, i) => (
                <div
                  key={i}
                  className={`faq-item${open === i ? ' is-open' : ''}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  <div className="faq-item__q">{f.q}</div>
                  <div className="faq-item__a">{f.a}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/chat" className="btn">
                Спросить Алию <span className="btn__arr"><Arrow /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
