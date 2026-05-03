'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { Arrow } from '@/components/icons'

const FEATURES = [
  { t: 'Понимает суть вопроса',        p: 'Распознаёт ключевые темы и подбирает ответ из базы знаний университета.' },
  { t: 'Отвечает мгновенно',           p: 'Среднее время ответа — меньше секунды. Без очередей и ожиданий.' },
  { t: 'Знает все направления',        p: 'Институты, программы СПО, профили подготовки, формы и стоимость обучения.' },
  { t: 'Ведёт по поступлению',         p: 'Подсказывает документы, сроки, способы подачи и квоты.' },
  { t: 'Работает на любом устройстве', p: 'Адаптивный интерфейс — от телефона до большого экрана.' },
  { t: 'Быстрые ответы кнопками',      p: 'Не обязательно писать — нажимай чипы с темами и веди диалог нажатием.' },
]

export default function About() {
  useReveal()

  return (
    <main className="page">
      <section className="about-hero">
        <div className="wrap about-hero__grid">
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>О проекте · ВКР по специальности ИТ</div>
            <h1 className="h-1 about-hero__title">
              Виртуальный<br />ассистент <em>«Алия»</em><br />для абитуриентов.
            </h1>
          </div>
          <div className="about-hero__side r">
            <p>
              Чат-бот на основе ИИ для повышения эффективности
              профориентационной работы — дипломный проект,
              интегрированный с порталом абитуриента.
            </p>
            <p>
              Бот работает с базой знаний университета: направления,
              экзамены, документы, сроки. Снимает нагрузку с приёмной
              комиссии и отвечает в любое время.
            </p>
          </div>
        </div>
      </section>

      <section className="values r-stagger">
        <div className="value">
          <div className="value__num"><b>01</b> · аудитория</div>
          <div className="value__big">80<em>%</em></div>
          <div className="value__lbl">вопросов абитуриентов — типовые. Их можно автоматизировать без потери качества.</div>
        </div>
        <div className="value">
          <div className="value__num"><b>02</b> · доступность</div>
          <div className="value__big">24/<em>7</em></div>
          <div className="value__lbl">приёмная комиссия работает по графику — бот доступен без выходных и перерывов.</div>
        </div>
        <div className="value">
          <div className="value__num"><b>03</b> · скорость</div>
          <div className="value__big">&lt;1<em>с</em></div>
          <div className="value__lbl">время ответа на типовой запрос. Сравнимо с переключением вкладки в браузере.</div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head r">
            <div>
              <div className="section__num"><b>04</b>Возможности</div>
              <h2 className="h-1">Что умеет<br /><em>Алия</em>.</h2>
            </div>
            <p className="lead muted">
              Не заменяет живого специалиста, но решает задачи первого
              контакта — самые частые и предсказуемые.
            </p>
          </div>
          <div className="feat r-stagger">
            {FEATURES.map((f, i) => (
              <div key={i} className="feat__item">
                <div className="feat__num">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h4>{f.t}</h4>
                  <p>{f.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap">
          <div className="section__head section__head--dark r">
            <div>
              <div className="section__num"><b>05</b>Технологический стек</div>
              <h2 className="h-1" style={{ color: 'var(--paper)' }}>На чём<br />построено.</h2>
            </div>
            <p className="lead muted" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Современный фронтенд, обработка естественного языка,
              компонентная дизайн-система — портал готов к продуктовому росту.
            </p>
          </div>
          <div className="tech r-stagger">
            <div className="tech__item">
              <div className="tech__name">Next.js 16</div>
              <div className="tech__desc">App Router · SSR</div>
            </div>
            <div className="tech__item">
              <div className="tech__name">TypeScript</div>
              <div className="tech__desc">Типизированный UI</div>
            </div>
            <div className="tech__item">
              <div className="tech__name">NLP-движок</div>
              <div className="tech__desc">Обработка запросов</div>
            </div>
            <div className="tech__item">
              <div className="tech__name">Design tokens</div>
              <div className="tech__desc">CSS-переменные</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bigcta">
        <div className="wrap bigcta__inner">
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>Попробуй сейчас</div>
            <h2 className="bigcta__title">
              Алия отвечает<br />на любой вопрос.<br /><em>Попробуй.</em>
            </h2>
          </div>
          <div className="bigcta__side">
            <Link href="/chat" className="btn">
              Открыть чат-бот <span className="btn__arr"><Arrow /></span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
