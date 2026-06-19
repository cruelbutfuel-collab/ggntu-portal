'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { Arrow } from '@/components/icons'

const TIMELINE = [
  { d: '20 июня',    e: 'Начало приёма документов',              tag: 'Старт', now: true },
  { d: '25 июля',    e: 'Окончание приёма на бюджет (очная)',    tag: '' },
  { d: '3 августа',  e: 'Приказ о зачислении — 1-я волна',      tag: '' },
  { d: '9 августа',  e: 'Приказ о зачислении — 2-я волна',      tag: '' },
  { d: '20 августа', e: 'Окончание приёма на платное (очная)',   tag: '' },
  { d: '31 августа', e: 'Окончание приёма на заочную форму',     tag: 'Финал' },
]

const DOCS = [
  { n: 'Паспорт',  note: 'или иной документ, удостоверяющий личность' },
  { n: 'Аттестат', note: 'оригинал или заверенная копия' },
  { n: 'СНИЛС',    note: 'страховой номер индивидуального лицевого счёта' },
]

const WAYS = [
  { n: '01', t: 'Лично',            p: 'пр-т Х.А. Исаева, 100\nПн–Пт · 9:00–17:00' },
  { n: '02', t: 'Через Госуслуги',  p: 'Электронная подача через портал государственных услуг' },
  { n: '03', t: 'По email',         p: 'priem@example.edu — сканы документов и заявление' },
  { n: '04', t: 'По почте',         p: 'Заказным письмом с описью вложений' },
]

const EXAMS = [
  { p: 'Технические',   o: 'Русский язык', sp: 'Математика + Физика',        s: 'Нефтегазовое дело, Строительство, Энергетика' },
  { p: 'IT',            o: 'Русский язык', sp: 'Математика + Информатика',    s: 'Программная инженерия, ИБ, ИВТ' },
  { p: 'Химические',    o: 'Русский язык', sp: 'Математика + Химия',          s: 'Химическая технология' },
  { p: 'Экономические', o: 'Русский язык', sp: 'Математика + Обществознание', s: 'Экономика, Менеджмент' },
  { p: 'Архитектура',   o: 'Русский язык', sp: 'Математика + Рисунок (ДВИ)', s: 'Архитектурное проектирование' },
]

const QUOTAS = [
  { tag: 'Особая квота · 10%', t: 'Льготные категории',         p: 'Дети-сироты, дети-инвалиды I–II групп, ветераны боевых действий — выделенные места.' },
  { tag: 'Целевое обучение',   t: 'По направлению предприятия', p: 'Поступление с гарантированным трудоустройством после выпуска. Обсуждается заранее.' },
  { tag: 'БВИ · без экзаменов', t: 'Победители олимпиад',       p: 'Победители и призёры заключительного этапа ВсОШ — поступление без вступительных испытаний.' },
]

export default function Admission() {
  useReveal()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setProgress(28), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="page">
      <section className="adm-hero">
        <div className="wrap adm-hero__grid">
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>№ 03 / Поступление 2026/27</div>
            <h1 className="h-1">
              Всё, что нужно<br />знать о <em>поступлении</em>.
            </h1>
          </div>
          <div className="progress-card r">
            <h5>Приёмная кампания</h5>
            <div className="progress-bar">
              <i style={{ width: progress + '%' }} />
            </div>
            <div className="progress-row">
              <span>20 июня · <b>старт</b></span>
              <span>31 авг · <b>финал</b></span>
            </div>
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="mono uc xs muted">До старта</span>
              <span className="h-2" style={{ fontSize: 36 }}>
                56<em style={{ fontStyle: 'italic', color: 'var(--red)', fontSize: 16, marginLeft: 6 }}>дней</em>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section__head r">
            <div>
              <div className="section__num"><b>01</b>Календарь приёмной кампании</div>
              <h2 className="h-1">Сроки</h2>
            </div>
            <p className="lead muted">
              Ключевые даты приёма документов и зачисления.
              Подавай заранее — это снимает риск пропустить волну.
            </p>
          </div>
          <div className="timeline r-stagger">
            {TIMELINE.map((t, i) => (
              <div key={i} className={`tl-item${t.now ? ' is-now' : ''}`}>
                <div className="tl-item__date">{t.d}</div>
                <div className="tl-item__event">{t.e}</div>
                <div className="tl-item__tag">{t.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper-2">
        <div className="wrap">
          <div className="section__head r">
            <div>
              <div className="section__num"><b>02</b>Документы</div>
              <h2 className="h-1">Что взять<br /><em>с собой</em></h2>
            </div>
            <p className="lead muted">
              Подготовь пакет заранее — это сэкономит время в очереди
              и уменьшит шанс возврата заявления.
            </p>
          </div>
          <div className="docs-grid r-stagger">
            {DOCS.map((d, i) => (
              <div key={i} className="doc-card">
                <div className="doc-card__num"><b>{String(i + 1).padStart(2, '0')}</b> · документ</div>
                <div className="doc-card__name">{d.n}</div>
                <div className="doc-card__note">{d.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head r">
            <div>
              <div className="section__num"><b>03</b>Способы подачи</div>
              <h2 className="h-1">Четыре пути<br />Выбирай <em>удобный</em></h2>
            </div>
            <p className="lead muted">
              Большинство абитуриентов подают через Госуслуги — быстрее
              и без ручного заполнения форм.
            </p>
          </div>
          <div className="ways r-stagger">
            {WAYS.map((w, i) => (
              <div key={i} className="way">
                <div className="way__num">{w.n[0]}<em>{w.n[1]}</em></div>
                <h4>{w.t}</h4>
                <p>{w.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper-2">
        <div className="wrap">
          <div className="section__head r">
            <div>
              <div className="section__num"><b>04</b>Вступительные экзамены</div>
              <h2 className="h-1">ЕГЭ по<br /><em>профилю</em></h2>
            </div>
            <p className="lead muted">
              Минимальный порог по большинству предметов — 40–45 баллов.
              Без ЕГЭ — через внутренние испытания университета.
            </p>
          </div>
          <div className="r" style={{ overflowX: 'auto' }}>
            <table className="exam-table">
              <thead>
                <tr>
                  <th>Профиль</th>
                  <th>Обязательный</th>
                  <th>Профильный</th>
                  <th>Примеры специальностей</th>
                </tr>
              </thead>
              <tbody>
                {EXAMS.map((e, i) => (
                  <tr key={i}>
                    <td>{e.p}</td>
                    <td><span className="pill">{e.o}</span></td>
                    <td><span className="pill">{e.sp}</span></td>
                    <td>{e.s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head r">
            <div>
              <div className="section__num"><b>05</b>Льготы и квоты</div>
              <h2 className="h-1">Особые<br /><em>категории</em></h2>
            </div>
            <p className="lead muted">
              Если попадаешь в одну из категорий — конкурс проходит отдельно
              и существенно мягче. Уточняй детали у приёмной комиссии.
            </p>
          </div>
          <div className="quotas r-stagger">
            {QUOTAS.map((q, i) => (
              <div key={i} className="quota">
                <div className="quota__tag">{q.tag}</div>
                <h4>{q.t}</h4>
                <p>{q.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bigcta">
        <div className="wrap bigcta__inner">
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>Не уверен — спроси</div>
            <h2 className="bigcta__title">Остались<br /><em>вопросы</em>?</h2>
          </div>
          <div className="bigcta__side">
            <Link href="/chat" className="btn">
              Открыть чат <span className="btn__arr"><Arrow /></span>
            </Link>
            <a href="tel:+79290036666" className="btn btn--ghost">+7 929 003 66 66</a>
          </div>
        </div>
      </section>
    </main>
  )
}
