'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { Arrow, Plus } from '@/components/icons'
import { FACULTIES } from '@/lib/data'

const VO_LEVELS = new Set(['Бакалавриат', 'Специалитет', 'Магистратура'])
const LEVEL_OPTIONS = ['Все', 'Бакалавриат', 'Специалитет', 'Магистратура', 'СПО'] as const

function normalizeSubject(raw: string) {
  return raw.replace(/\s*\(профильная\)/i, '').trim()
}

const TOTAL_ALL = FACULTIES.reduce((s, f) => s + f.specialties.length, 0)

function SpecialtiesInner() {
  useReveal()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tab, setTab]           = useState(() => searchParams.get('f')   || 'all')
  const [rawQuery, setRawQuery] = useState(() => searchParams.get('q')   || '')
  const [level, setLevel]       = useState(() => searchParams.get('lvl') || 'all')
  const [examFilters, setExamFilters] = useState<Set<string>>(() => {
    const raw = searchParams.get('exams')
    return raw ? new Set(raw.split(',').filter(Boolean)) : new Set()
  })
  const [open, setOpen]               = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [fading, setFading]           = useState(false)

  // Debounce search
  const [debouncedQuery, setDebouncedQuery] = useState(rawQuery)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(rawQuery), 300)
    return () => clearTimeout(id)
  }, [rawQuery])

  const ALL_EXAM_SUBJECTS = useMemo(() => {
    const set = new Set<string>()
    FACULTIES.forEach(f =>
      f.specialties.forEach(s =>
        s.exams.forEach(e => {
          if (e.startsWith('Без ЕГЭ') || e.startsWith('Профессиональное')) return
          e.split(' / ').forEach(sub => {
            const norm = normalizeSubject(sub)
            if (norm !== 'Русский язык') set.add(norm)
          })
        })
      )
    )
    return [...set].sort()
  }, [])

  const list = useMemo(() => {
    const base = tab === 'all' ? FACULTIES : FACULTIES.filter(f => f.id === tab)
    return base.map(f => ({
      ...f,
      specialties: f.specialties.filter(s => {
        if (level !== 'all') {
          if (level === 'СПО' && VO_LEVELS.has(s.level)) return false
          if (level !== 'СПО' && s.level !== level) return false
        }
        if (debouncedQuery) {
          const q = debouncedQuery.toLowerCase()
          if (
            !s.name.toLowerCase().includes(q) &&
            !s.code.toLowerCase().includes(q) &&
            !s.profiles.some(p => p.toLowerCase().includes(q))
          ) return false
        }
        if (examFilters.size > 0) {
          // AND: every selected subject must appear in at least one exam group
          const allCovered = [...examFilters].every(selected =>
            s.exams.some(e => {
              if (e.startsWith('Без ЕГЭ') || e.startsWith('Профессиональное') || e.includes('Русский язык')) return false
              return e.split(' / ').map(normalizeSubject).includes(selected)
            })
          )
          if (!allCovered) return false
        }
        return true
      }),
    })).filter(f => f.specialties.length > 0)
  }, [tab, level, debouncedQuery, examFilters])

  const totalShown = list.reduce((s, f) => s + f.specialties.length, 0)

  // Fade animation when filters change (skip first render)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    setFading(true)
    const id = setTimeout(() => setFading(false), 180)
    return () => clearTimeout(id)
  }, [debouncedQuery, tab, level, examFilters])

  // Sync URL (skip first render so we don't replace URL before any interaction)
  const isFirstURL = useRef(true)
  useEffect(() => {
    if (isFirstURL.current) { isFirstURL.current = false; return }
    const params = new URLSearchParams()
    if (tab !== 'all') params.set('f', tab)
    if (debouncedQuery) params.set('q', debouncedQuery)
    if (level !== 'all') params.set('lvl', level)
    if (examFilters.size > 0) params.set('exams', [...examFilters].join(','))
    const qs = params.toString()
    router.replace(qs ? `/specialties?${qs}` : '/specialties', { scroll: false })
  }, [tab, debouncedQuery, level, examFilters, router])

  const toggleExam = (sub: string) => {
    setExamFilters(prev => {
      const next = new Set(prev)
      if (next.has(sub)) next.delete(sub); else next.add(sub)
      return next
    })
    setOpen(null)
  }

  const resetAll = () => {
    setTab('all'); setRawQuery(''); setDebouncedQuery(''); setLevel('all')
    setExamFilters(new Set()); setOpen(null)
  }

  const activeCount =
    (tab !== 'all' ? 1 : 0) +
    (rawQuery ? 1 : 0) +
    (level !== 'all' ? 1 : 0) +
    examFilters.size

  return (
    <main className="page">
      <section className="spec-hero">
        <div className="wrap spec-hero__grid">
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>№ 02 / Каталог направлений</div>
            <h1 className="h-1">
              Специальности<br />и <em>направления</em><br />подготовки
            </h1>
          </div>
          <div className="spec-hero__meta">
            <div><span>Институтов</span><b>5<em>+1</em></b></div>
            <div><span>Программ ВО</span><b>60<em>+</em></b></div>
            <div><span>Программ СПО</span><b>33</b></div>
            <div><span>Истории</span><b>100<em>+</em></b></div>
          </div>
        </div>
      </section>

      {/* Faculty tabs — sticky */}
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
            Колледж · ФСПО <span className="spec-tab__count">/ {FACULTIES.find(f => f.spo)?.specialties.length ?? 0}</span>
          </button>
        </div>
      </div>

      {/* Secondary filters: search + level + exams */}
      <div className="sfilter">
        <div className="wrap">
          {/* Mobile toggle */}
          <button
            className="sfilter__toggle"
            onClick={() => setFiltersOpen(v => !v)}
            aria-expanded={filtersOpen}
          >
            <span>
              Фильтры
              {activeCount > 0 && <span className="sfilter__badge">{activeCount}</span>}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d={filtersOpen ? 'M2 11L8 5L14 11' : 'M2 5L8 11L14 5'}
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              />
            </svg>
          </button>

          <div className={`sfilter__body${filtersOpen ? ' is-open' : ''}`}>
            {/* Search */}
            <div className="sfilter__row">
              <div className="spec-search">
                <svg className="spec-search__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <input
                  type="search"
                  className="spec-search__input"
                  placeholder="Поиск по названию или коду..."
                  value={rawQuery}
                  onChange={e => { setRawQuery(e.target.value); setOpen(null) }}
                />
                {rawQuery && (
                  <button
                    className="spec-search__clear"
                    onClick={() => { setRawQuery(''); setOpen(null) }}
                    aria-label="Очистить поиск"
                  >×</button>
                )}
              </div>
            </div>

            {/* Level filter */}
            <div className="sfilter__row">
              <div className="level-filter">
                <span className="level-filter__label">Уровень:</span>
                {LEVEL_OPTIONS.map(l => {
                  const val = l === 'Все' ? 'all' : l
                  return (
                    <button
                      key={l}
                      className={`level-chip${level === val ? ' is-active' : ''}`}
                      onClick={() => { setLevel(val); setOpen(null) }}
                    >
                      {l}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Exam chips */}
            <div className="sfilter__row">
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
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="wrap">
          {/* Counter bar */}
          <div className="spec-results-bar">
            <span className="spec-results-count">
              Показано <b>{totalShown}</b> из {TOTAL_ALL} программ
            </span>
            {activeCount > 0 && (
              <button className="spec-reset" onClick={resetAll}>
                Сбросить все фильтры
              </button>
            )}
          </div>

          {/* List */}
          <div className={`spec-results${fading ? ' spec-results--fading' : ''}`}>
            {list.length === 0 ? (
              <div className="spec-empty">
                <p className="spec-empty__text">
                  Ничего не найдено — попробуй изменить запрос или сбросить фильтры.
                </p>
                <button className="btn" onClick={resetAll}>
                  Сбросить фильтры <span className="btn__arr"><Arrow /></span>
                </button>
              </div>
            ) : list.map(f => (
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
                              <p style={{ fontSize: 15, marginBottom: s.form.includes('*') ? 6 : 24 }}>{s.form}</p>
                              {s.form.includes('*') && (
                                <p style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '.04em', marginBottom: 24 }}>* Заочная — только как второе высшее образование</p>
                              )}

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
