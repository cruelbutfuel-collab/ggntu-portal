'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { Arrow } from '@/components/icons'
import { FACULTIES } from '@/lib/data'
import DiagnosticsPromo from '@/components/DiagnosticsPromo'

const DEADLINE = new Date('2026-06-20T09:00:00')

function useCountdown() {
  const [left, setLeft] = useState(() => Math.max(0, DEADLINE.getTime() - Date.now()))
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, DEADLINE.getTime() - Date.now())), 1000)
    return () => clearInterval(id)
  }, [])
  return {
    d: Math.floor(left / 86400000),
    h: Math.floor((left % 86400000) / 3600000),
    m: Math.floor((left % 3600000) / 60000),
    s: Math.floor((left % 60000) / 1000),
    done: left === 0,
  }
}

function HeroChat() {
  const [step, setStep] = useState(0)
  const flow = [
    { t: 'bot',  text: 'Привет. Я помогу разобраться с поступлением. О чём расскажу?' },
    { t: 'user', text: 'Какие IT-направления есть?' },
    { t: 'bot',  text: 'Прикладная информатика, Бизнес-информатика, Программная инженерия, Информационные системы, Кибербезопасность и другие.' },
  ]

  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % (flow.length + 2)), 2200)
    return () => clearInterval(id)
  }, [])

  const visible = flow.slice(0, Math.min(step, flow.length))
  const typing = step > 0 && step <= flow.length && step !== flow.length

  return (
    <div className="hero__visual">
      <div className="hv__head">
        <div className="hv__avatar">А</div>
        <div>
          <div className="hv__name">Алия</div>
          <div className="hv__sub">Ассистент · отвечает мгновенно</div>
        </div>
      </div>
      <div className="hv__msgs">
        {visible.map((m, i) => (
          <div key={i} className={`hv__msg${m.t === 'user' ? ' hv__msg--u' : ''}`}>{m.text}</div>
        ))}
        {typing && step < flow.length && (
          <div className="hv__msg hv__msg--typing"><i /><i /><i /></div>
        )}
      </div>
      <div className="hv__chips">
        <span className="hv__chip">Документы</span>
        <span className="hv__chip">Бюджет</span>
        <span className="hv__chip">Сроки</span>
        <span className="hv__chip">Колледж</span>
      </div>
    </div>
  )
}

export default function Home() {
  useReveal()
  const { d, h, m, s, done } = useCountdown()

  return (
    <main className="page">
      <section className="hero">
        <div className="hero__ornament hero__ornament--tl">
          № 01 / Главная · приёмная кампания 2026/27
        </div>
        <div className="hero__ornament hero__ornament--br">↗ Грозный · 364051</div>

        <div className="wrap">
          <div className="hero__head">
            <div className="eyebrow">Поступай осознанно — спрашивай</div>
            <div className="hero__meta">
              <span>43 направления ВО · 33 СПО</span>
              <span><b>5 институтов + колледж</b></span>
            </div>
          </div>

          <h1 className="hero__title h-display">
            <span className="word w1"><span>Твой&nbsp;</span></span>
            <span className="word w2"><span><em>путь</em>&nbsp;</span></span>
            <span className="word w3"><span>в&nbsp;</span></span>
            <span className="word w4"><span>профессию</span></span>
            <br />
            <span className="word w5"><span>начинается&nbsp;</span></span>
            <span className="word w6"><span>с&nbsp;<em>вопроса</em>.</span></span>
          </h1>

          <div className="hero__below">
            <div>
              <p className="hero__lead lead">
                Портал абитуриента и виртуальный ассистент <b>Алия</b> помогают
                выбрать направление, разобраться с документами и не упустить
                сроки приёма. Один интерфейс — все ответы.
              </p>
              <div className="hero__cta-row">
                <Link href="/chat" className="btn">
                  Открыть чат-бот <span className="btn__arr"><Arrow /></span>
                </Link>
                <Link href="/specialties" className="btn btn--ghost">
                  Смотреть направления
                </Link>
              </div>
            </div>
            <HeroChat />
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="wrap">
          <div className="stats__row r-stagger">
            {[
              { n: '53', e: '+', l: 'программ бакалавриата' },
              { n: '12', e: '',  l: 'программ специалитета' },
              { n: '23', e: '',  l: 'программ магистратуры' },
              { n: '100', e: '+', l: 'лет истории' },
            ].map((s, i) => (
              <div key={i} className="stats__cell">
                <div className="stats__num">{s.n}<em>{s.e}</em></div>
                <div className="stats__lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head r">
            <div>
              <div className="section__num"><b>02</b>Институты и факультеты</div>
              <h2 className="h-1">Шесть направлений<br />подготовки.<br />Выбери <em>своё</em>.</h2>
            </div>
            <p className="lead muted">
              От нефтегазового дела до IT, архитектуры и колледжа.
              Каждый институт — это своя школа, программы и карьерные траектории.
            </p>
          </div>

          <div className="fac-list r-stagger">
            {FACULTIES.map(f => (
              <Link key={f.id} href={`/specialties?f=${f.id}`} className="fac-row">
                <div className="fac-row__num">{f.no}</div>
                <div>
                  <span className="fac-row__short">{f.short}</span>
                  <div className="fac-row__name">{f.name}</div>
                </div>
                <div className="fac-row__desc">{f.desc}</div>
                <span className="fac-row__cta"><b>{f.count}</b> направлений <Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DiagnosticsPromo />

      <section className="section section--dark">
        <div className="wrap">
          <div className="section__head section__head--dark r">
            <div>
              <div className="section__num"><b>03</b>Как это работает</div>
              <h2 className="h-1" style={{ color: 'var(--paper)' }}>Три шага<br />до решения.</h2>
            </div>
            <p className="lead muted" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Чат-бот не заменяет приёмную комиссию — он экономит твоё время
              и отвечает на типовые вопросы 24/7.
            </p>
          </div>

          <div className="how">
            {[
              { n: '1', t: 'Спроси',       p: 'Напиши боту что интересует — направление, экзамены, документы или сроки.' },
              { n: '2', t: 'Получи ответ', p: 'Алия моментально подбирает информацию из базы знаний университета.' },
              { n: '3', t: 'Реши',         p: 'Сравни направления и подай заявление — лично, через Госуслуги или почту.' },
            ].map((s, i) => (
              <div key={i} className="how__step">
                <div className="how__num">{s.n}<em>/03</em></div>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bigcta">
        <div className="wrap bigcta__inner">
          <div className="r">
            <div className="eyebrow" style={{ marginBottom: 24 }}>Готов поступать?</div>
            <h2 className="bigcta__title">
              Документы принимаются<br />с <em>20 июня</em>.<br />Не упусти место.
            </h2>
          </div>
          <div className="bigcta__side r">
            <div>
              <div className="bigcta__date">{done ? 'Приём документов открыт!' : 'До начала приёма документов'}</div>
              {!done && (
                <div className="countdown">
                  <div className="cdown"><span className="cdown__n">{String(d).padStart(2, '0')}</span><span className="cdown__l">дней</span></div>
                  <div className="cdown"><span className="cdown__n">{String(h).padStart(2, '0')}</span><span className="cdown__l">часов</span></div>
                  <div className="cdown"><span className="cdown__n">{String(m).padStart(2, '0')}</span><span className="cdown__l">минут</span></div>
                  <div className="cdown"><span className="cdown__n">{String(s).padStart(2, '0')}</span><span className="cdown__l">секунд</span></div>
                </div>
              )}
            </div>
            <Link href="/admission" className="btn">
              Условия поступления <span className="btn__arr"><Arrow /></span>
            </Link>
            <Link href="/chat" className="btn btn--ghost">Задать вопрос боту</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
