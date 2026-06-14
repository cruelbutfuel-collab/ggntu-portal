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

  /* Would the user pass on the most lenient form (distance)? */
  const passesDistanceAny = useMemo(() =>
    hasAnyScore && FACULTIES.filter(f => !f.spo).some(f =>
      f.specialties.some(s => checkSpecialty(s, scores, 'distance') === 'available')
    ), [scores, hasAnyScore])

  const results = useMemo(() =>
    FACULTIES.filter(f => !f.spo).map(f => ({
      ...f,
      specialties: f.specialties.filter(s => checkSpecialty(s, scores, form) === 'available'),
    })).filter(f => f.specialties.length > 0)
  , [scores, form])

  const totalAvailable = results.reduce((s, f) => s + f.specialties.length, 0)

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
                  ['full',     'Очная'],
                  ['parttime', 'Очно-заочная'],
                  ['distance', 'Заочная'],
                ] as const).map(([val, label]) => (
                  <button
                    key={val}
                    className={`form-btn${form === val ? ' is-active' : ''}`}
                    onClick={() => setForm(val)}
                  >
                    <span className="form-btn__label">{label}</span>
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
                </div>

                {totalAvailable === 0 && (
                  passesDistanceAny && form === 'full' ? (
                    <div className="calc-noresult calc-noresult--tip">
                      <div className="calc-noresult__title">Не хватает суммы баллов для очной формы</div>
                      <p>На заочной или очно-заочной форме эти баллы проходят — попробуй переключить форму обучения выше.</p>
                    </div>
                  ) : passesDistanceAny ? (
                    <div className="calc-noresult calc-noresult--tip">
                      <div className="calc-noresult__title">Нет специальностей на этой форме</div>
                      <p>Попробуй переключить форму обучения — на другой форме эти баллы могут подойти.</p>
                    </div>
                  ) : (
                    <div className="calc-noresult calc-noresult--college">
                      <div className="calc-noresult__title">Баллы пока не дотягивают до пороговых значений</div>
                      <p>Если ЕГЭ ещё впереди — есть время подготовиться. Если хочешь поступить уже сейчас, рассмотри колледж ГГНТУ: поступление без ЕГЭ, только по среднему баллу аттестата.</p>
                      <Link href="/specialties?f=fspo" className="btn" style={{ marginTop: 16, display: 'inline-flex' }}>
                        Направления колледжа <span className="btn__arr"><Arrow /></span>
                      </Link>
                    </div>
                  )
                )}

                {results.map(f => (
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
                        <Link href={`/chat?spec=${encodeURIComponent(s.name)}`} className="result-item__ask">
                          Подробнее <Arrow s={11} />
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}

                {totalAvailable > 0 && (
                  <div style={{ marginTop: 32 }}>
                    <Link href="/chat" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                      Спросить Алию о поступлении <span className="btn__arr"><Arrow /></span>
                    </Link>
                  </div>
                )}

                <p className="calc-footnote">
                  Специальности с творческим конкурсом (Архитектура, Дизайн, Медиакоммуникации) не включены — результат ДВИ заранее неизвестен.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
