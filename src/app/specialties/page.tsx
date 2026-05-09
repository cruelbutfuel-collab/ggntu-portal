'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { Arrow, Plus } from '@/components/icons'
import { FACULTIES } from '@/lib/data'

function normalizeSubject(raw: string) {
  return raw.replace(/\s*\(профильная\)/i, '').trim()
}

function SpecialtiesInner() {
  useReveal()
  const searchParams = useSearchParams()
  const initial = searchParams.get('f') || 'all'
  const [tab, setTab] = useState(initial)
  const [open, setOpen] = useState<string | null>(null)
  const [examFilters, setExamFilters] = useState<Set<string>>(new Set())

  const ALL_EXAM_SUBJECTS = useMemo(() => {
    const set = new Set<string>()
    FACULTIES.forEach(f =>
      f.specialties.forEach(s =>
        s.exams.forEach(e => {
          if (e.startsWith('Без ЕГЭ') || e.startsWith('Профессиональное')) return
          e.split(' / ').forEach(sub => set.add(normalizeSubject(sub)))
        })
      )
    )
    return [...set].sort()
  }, [])

  const toggleExam = (sub: string) => {
    setExamFilters(prev => {
      const next = new Set(prev)
      if (next.has(sub)) next.delete(sub)
      else next.add(sub)
      return next
    })
    setOpen(null)
  }

  const list = useMemo(() => {
    const base = tab === 'all' ? FACULTIES : FACULTIES.filter(f => f.id === tab)
    if (examFilters.size === 0) return base
    return base.map(f => ({
      ...f,
      specialties: f.specialties.filter(s =>
        s.exams.every(e => {
          const subs = e.split(' / ').map(normalizeSubject)
          return subs.some(sub => examFilters.has(sub))
        })
      ),
    })).filter(f => f.specialties.length > 0)
  }, [tab, examFilters])

  return (
    <main className="page">
      <section className="spec-hero">
        <div className="wrap spec-hero__grid">
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>№ 02 / Каталог направлений</div>
            <h1 className="h-1">
              Специальности<br />и <em>направления</em><br />подготовки.
            </h1>
          </div>
          <div className="spec-hero__meta">
            <div><span>Институтов</span><b>5<em>+1</em></b></div>
            <div><span>Программ ВО</span><b>43</b></div>
            <div><span>Программ СПО</span><b>33</b></div>
            <div><span>Бюджет</span><b><em>да</em></b></div>
          </div>
        </div>
      </section>

      <div className="spec-tabs">
        <div className="wrap spec-tabs__row">
          <button
            className={`spec-tab${tab === 'all' ? ' is-active' : ''}`}
            onClick={() => { setTab('all'); setOpen(null) }}
          >
            Все <span className="spec-tab__count">/ {FACULTIES.length}</span>
          </button>
          {FACULTIES.filter(f => !f.spo).map(f => (
            <button
              key={f.id}
              className={`spec-tab${tab === f.id ? ' is-active' : ''}`}
              onClick={() => { setTab(f.id); setOpen(null) }}
            >
              {f.short} <span className="spec-tab__count">/ {f.count}</span>
            </button>
          ))}
          <button
            className={`spec-tab spec-tab--spo${tab === 'fspo' ? ' is-active' : ''}`}
            onClick={() => { setTab('fspo'); setOpen(null) }}
          >
            Колледж · ФСПО <span className="spec-tab__count">/ 33</span>
          </button>
        </div>
      </div>

      <section style={{ padding: '0 0 80px' }}>
        <div className="wrap">
          <div className="exam-filter">
            <span className="exam-filter__label">ЕГЭ:</span>
            {ALL_EXAM_SUBJECTS.map(sub => (
              <button
                key={sub}
                className={`exam-chip${examFilters.has(sub) ? ' is-active' : ''}`}
                onClick={() => toggleExam(sub)}
              >
                {sub}
              </button>
            ))}
            {examFilters.size > 0 && (
              <button
                className="exam-chip exam-chip--reset"
                onClick={() => { setExamFilters(new Set()); setOpen(null) }}
              >
                Сбросить
              </button>
            )}
          </div>

          {list.length === 0 && (
            <div className="exam-noresult">Нет специальностей, подходящих под выбранный фильтр</div>
          )}

          {list.map(f => (
            <div key={f.id} className="fac-section">
              <div className="fac-section__head r">
                <div className="fac-section__num">{f.no} / {f.short}</div>
                <div>
                  <h2 className="fac-section__name">{f.name}</h2>
                  <p className="fac-section__desc">{f.desc}</p>
                </div>
              </div>

              <div className="r-stagger">
                {f.specialties.map((s, i) => {
                  const key = `${f.id}-${i}`
                  const isOpen = open === key
                  return (
                    <div key={key}>
                      <div
                        className={`spec-row${isOpen ? ' is-open' : ''}`}
                        onClick={() => setOpen(isOpen ? null : key)}
                      >
                        <div className="spec-row__code">{s.code}</div>
                        <div className="spec-row__name">
                          {s.name}
                          <small>{s.profiles[0]}{s.profiles.length > 1 ? ` · +${s.profiles.length - 1}` : ''}</small>
                        </div>
                        <div className="spec-row__meta">
                          <span>{s.level}</span>
                          {s.budget && <span><b>Бюджет</b></span>}
                          <span>от {s.fee.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <span className="spec-row__icon"><Plus /></span>
                      </div>
                      {isOpen && (
                        <div className="spec-detail">
                          <div className="spec-detail__col">
                            <h5>Описание</h5>
                            <p className="spec-detail__desc">{s.desc}</p>

                            <h5>Профили подготовки</h5>
                            <div className="tag-list">
                              {s.profiles.map((p, j) => <span key={j} className="tag">{p}</span>)}
                            </div>

                            <h5>Вступительные испытания</h5>
                            <div className="tag-list">
                              {s.exams.map((e, j) => <span key={j} className="tag tag--mono">{e}</span>)}
                            </div>
                          </div>
                          <div className="spec-detail__col">
                            <h5>Форма обучения</h5>
                            <p style={{ fontSize: 15, marginBottom: 24 }}>{s.form}</p>

                            <h5>Стоимость · в год</h5>
                            <div className="tuition-list">
                              <div className="tuition-row">
                                <span>Очная</span>
                                <b>{s.fee.toLocaleString('ru-RU')} ₽</b>
                              </div>
                              <div className="tuition-row">
                                <span>Заочная</span>
                                <b>{Math.round(s.fee * 0.28).toLocaleString('ru-RU')} ₽</b>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                              <Link href="/chat" className="btn">
                                Спросить про это <span className="btn__arr"><Arrow /></span>
                              </Link>
                              <Link href="/admission" className="btn btn--ghost">
                                Условия поступления
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default function Specialties() {
  return (
    <Suspense>
      <SpecialtiesInner />
    </Suspense>
  )
}
