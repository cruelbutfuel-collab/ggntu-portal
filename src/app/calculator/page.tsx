'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { FACULTIES } from '@/lib/data'
import { Arrow } from '@/components/icons'

/* ── EGE minimum thresholds (Рособрнадзор 2026) ── */
const THRESHOLDS: Record<string, number> = {
  'Русский язык':    24,
  'Математика':      27,
  'Физика':          36,
  'Химия':           36,
  'Биология':        36,
  'История':         32,
  'Обществознание':  45,
  'Информатика':     40,
  'География':       37,
  'Литература':      32,
}

const SUBJECTS = [
  'Русский язык', 'Математика', 'Физика', 'Химия', 'Биология',
  'Обществознание', 'История', 'Информатика', 'География', 'Литература',
]

const DVI_KEYS = ['Рисунок', 'Профессиональное']
function isDVI(e: string) { return DVI_KEYS.some(k => e.startsWith(k)) }
function isSPO(e: string) { return e.startsWith('Без ЕГЭ') }

function parseGroup(entry: string): string[] {
  return entry.replace(/\s*\(профильная\)/gi, '').split(' / ').map(s => s.trim())
}

function hasForm(formField: string, form: string): boolean {
  const parts = formField.split(' / ').map(p => p.replace(/\s*\(.*?\)/g, '').trim())
  if (form === 'full')     return parts.includes('Очная')
  if (form === 'parttime') return parts.includes('Очно-заочная')
  if (form === 'distance') return parts.includes('Заочная')
  return false
}

type CheckResult = 'available' | 'dvi' | 'no'

function checkSpecialty(
  s: { exams: string[]; form: string },
  scores: Record<string, number>,
  form: string
): CheckResult {
  if (s.exams.some(isSPO)) return 'no'
  if (!hasForm(s.form, form)) return 'no'

  const hasDVI = s.exams.some(isDVI)
  const egeGroups = s.exams.filter(e => !isDVI(e) && !isSPO(e))

  let sumBest = 0
  for (const entry of egeGroups) {
    const subs = parseGroup(entry)
    const anyOk = subs.some(sub => (scores[sub] ?? 0) >= (THRESHOLDS[sub] ?? 0))
    if (!anyOk) return 'no'
    sumBest += Math.max(...subs.map(sub => scores[sub] ?? 0))
  }

  if (!hasDVI && form === 'full' && sumBest < 180) return 'no'
  return hasDVI ? 'dvi' : 'available'
}

/* ── Page ─────────────────────────────────────── */
export default function Calculator() {
  useReveal()

  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(SUBJECTS.map(s => [s, 0]))
  )
  const [form, setForm] = useState<'full' | 'parttime' | 'distance'>('full')

  const hasAnyScore = SUBJECTS.some(sub => (scores[sub] ?? 0) > 0)

  const setScore = (sub: string, raw: string) => {
    const val = Math.max(0, Math.min(100, parseInt(raw) || 0))
    setScores(prev => ({ ...prev, [sub]: val }))
  }

  const results = useMemo(() => {
    const available: (typeof FACULTIES[number] & { specialties: typeof FACULTIES[number]['specialties'] })[] = []
    const withDVI:   (typeof FACULTIES[number] & { specialties: typeof FACULTIES[number]['specialties'] })[] = []

    FACULTIES.filter(f => !f.spo).forEach(f => {
      const avail: typeof f.specialties = []
      const dvi:   typeof f.specialties = []
      f.specialties.forEach(s => {
        const r = checkSpecialty(s, scores, form)
        if (r === 'available') avail.push(s)
        else if (r === 'dvi') dvi.push(s)
      })
      if (avail.length) available.push({ ...f, specialties: avail })
      if (dvi.length)   withDVI.push({ ...f, specialties: dvi })
    })

    return { available, withDVI }
  }, [scores, form])

  const totalAvailable = results.available.reduce((s, f) => s + f.specialties.length, 0)
  const totalDVI       = results.withDVI.reduce((s, f) => s + f.specialties.length, 0)

  function pluralSpec(n: number) {
    if (n % 10 === 1 && n % 100 !== 11) return 'специальность'
    if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'специальности'
    return 'специальностей'
  }

  return (
    <main className="page">
      <section className="calc-hero">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 18 }}>№ 05 / Калькулятор ЕГЭ</div>
          <h1 className="h-1">
            Узнай, на какие<br />специальности<br /><em>ты проходишь.</em>
          </h1>
          <p className="lead muted" style={{ marginTop: 24, maxWidth: 520 }}>
            Введи баллы ЕГЭ — система покажет доступные направления ГГНТУ.
            Для очной формы нужно минимум 180 баллов суммарно по трём предметам.
          </p>
        </div>
      </section>

      <div className="wrap">
        <div className="calc-layout">

          {/* ── Left: inputs ── */}
          <div className="calc-inputs">

            {/* Form selector */}
            <div className="calc-block">
              <div className="calc-block__title">Форма обучения</div>
              <div className="form-select">
                {([
                  ['full',     'Очная',          '∑ трёх предметов ≥ 180'],
                  ['parttime', 'Очно-заочная',   'только минимальные пороги'],
                  ['distance', 'Заочная',         'только минимальные пороги'],
                ] as const).map(([val, label, hint]) => (
                  <button
                    key={val}
                    className={`form-btn${form === val ? ' is-active' : ''}`}
                    onClick={() => setForm(val)}
                  >
                    <span className="form-btn__label">{label}</span>
                    <span className="form-btn__hint">{hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Score inputs */}
            <div className="calc-block">
              <div className="calc-block__title">Баллы ЕГЭ <span style={{ fontWeight: 400 }}>(0 — не сдавал)</span></div>
              <div className="subj-grid">
                {SUBJECTS.map(sub => {
                  const sc  = scores[sub] ?? 0
                  const thr = THRESHOLDS[sub]
                  const status = sc === 0 ? 'zero' : sc >= thr ? 'above' : 'below'
                  return (
                    <div key={sub} className={`subj-card subj-card--${status}`}>
                      <div className="subj-card__top">
                        <span className="subj-card__name">{sub}</span>
                        <span className="subj-card__thr">мин.&nbsp;{thr}</span>
                      </div>
                      <div className="subj-card__row">
                        <input
                          type="number"
                          className="subj-card__input"
                          min={0} max={100}
                          value={sc || ''}
                          placeholder="—"
                          onChange={e => setScore(sub, e.target.value)}
                        />
                        <span className={`subj-card__dot subj-card__dot--${status}`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* ── Right: results ── */}
          <div className="calc-results">
            {!hasAnyScore ? (
              <div className="calc-empty">
                <div className="calc-empty__icon">←</div>
                <p>Введи баллы слева — здесь появятся подходящие специальности.</p>
              </div>
            ) : (
              <>
                <div className="calc-results-head">
                  <span className="calc-count">{totalAvailable}</span>
                  {' '}{pluralSpec(totalAvailable)} доступно
                  {totalDVI > 0 && (
                    <span className="calc-dvi-badge">+ {totalDVI} с ДВИ</span>
                  )}
                </div>

                {totalAvailable === 0 && totalDVI === 0 && (
                  <div className="calc-noresult">
                    <p>Ни одна специальность не подходит под введённые баллы и форму обучения.</p>
                    <p style={{ marginTop: 8 }}>Попробуй изменить форму или проверить минимальные пороги — они выделены красным.</p>
                  </div>
                )}

                {results.available.map(f => (
                  <div key={f.id} className="result-group r">
                    <div className="result-group__inst">{f.short} — {f.name}</div>
                    {f.specialties.map((s, i) => (
                      <div key={i} className="result-item">
                        <div className="result-item__code">{s.code}</div>
                        <div className="result-item__info">
                          <div className="result-item__name">{s.name}</div>
                          <div className="result-item__meta">
                            <span>{s.level}</span>
                            {s.budget && <span className="badge badge--budget">Бюджет</span>}
                            <span>от {s.fee.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        </div>
                        <Link href={`/chat`} className="result-item__ask">
                          Подробнее <Arrow s={11} />
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}

                {totalDVI > 0 && (
                  <div className="result-dvi-section">
                    <div className="result-dvi-section__title">Также подходят — нужен творческий конкурс (ДВИ)</div>
                    {results.withDVI.map(f => (
                      <div key={f.id} className="result-group">
                        <div className="result-group__inst">{f.short} — {f.name}</div>
                        {f.specialties.map((s, i) => (
                          <div key={i} className="result-item result-item--dim">
                            <div className="result-item__code">{s.code}</div>
                            <div className="result-item__info">
                              <div className="result-item__name">{s.name}</div>
                              <div className="result-item__meta">
                                <span>{s.level}</span>
                                {s.budget && <span className="badge badge--budget">Бюджет</span>}
                                <span className="badge badge--dvi">+ ДВИ</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {totalAvailable > 0 && (
                  <div style={{ marginTop: 32 }}>
                    <Link href="/chat" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                      Спросить Алию о поступлении <span className="btn__arr"><Arrow /></span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
