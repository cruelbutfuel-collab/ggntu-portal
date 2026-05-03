'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { Arrow } from '@/components/icons'
import { FACULTIES } from '@/lib/data'

/* ── Holland types ────────────────────────────── */
type HollandKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

const HOLLAND: Record<HollandKey, { label: string; desc: string; facIds: string[] }> = {
  R: { label: 'Реалист',         desc: 'Техника, инженерия, физический труд',  facIds: ['ie', 'inig']       },
  I: { label: 'Исследователь',   desc: 'Наука, анализ, исследования',           facIds: ['inig']             },
  A: { label: 'Художник',        desc: 'Творчество, дизайн, архитектура',       facIds: ['isaid']            },
  S: { label: 'Социальный',      desc: 'Люди, управление, коммуникации',        facIds: ['iceitp']           },
  E: { label: 'Предприниматель', desc: 'Бизнес, лидерство, менеджмент',         facIds: ['iceitp']           },
  C: { label: 'Системный',       desc: 'Данные, IT, точность, структура',       facIds: ['ipit', 'iceitp']   },
}

/* ── Quiz questions ───────────────────────────── */
const QUESTIONS: { q: string; opts: { t: string; types: HollandKey[] }[] }[] = [
  {
    q: 'Что тебя привлекает больше всего?',
    opts: [
      { t: 'Техника, код, расчёты',       types: ['R', 'C'] },
      { t: 'Творчество, дизайн, идеи',    types: ['A']      },
      { t: 'Люди, общение, команда',      types: ['S', 'E'] },
      { t: 'Наука, природа, открытия',    types: ['I']      },
    ],
  },
  {
    q: 'Как ты предпочитаешь работать?',
    opts: [
      { t: 'Практик — делаю руками',                 types: ['R'] },
      { t: 'Теоретик — исследую и анализирую',       types: ['I'] },
      { t: 'Организатор — планирую и управляю',      types: ['E'] },
      { t: 'Командный игрок — поддерживаю других',   types: ['S'] },
    ],
  },
  {
    q: 'Какие школьные предметы нравились больше?',
    opts: [
      { t: 'Точные науки (матем, физика, IT)',         types: ['C', 'I'] },
      { t: 'Гуманитарные (история, право, общество)', types: ['S', 'E'] },
      { t: 'Творческие (ИЗО, литература, музыка)',    types: ['A']      },
      { t: 'Естественные (биология, химия, экология)',types: ['I', 'R'] },
    ],
  },
  {
    q: 'Где ты видишь себя через 5 лет?',
    opts: [
      { t: 'На производстве или в лаборатории',      types: ['R', 'I'] },
      { t: 'В собственном деле или топ-менеджменте', types: ['E']      },
      { t: 'В творческой профессии',                 types: ['A']      },
      { t: 'В работе с людьми',                      types: ['S']      },
    ],
  },
  {
    q: 'Что важнее для тебя в работе?',
    opts: [
      { t: 'Создавать что-то реальное, видимое',     types: ['R']      },
      { t: 'Решать сложные задачи и анализировать',  types: ['I', 'C'] },
      { t: 'Самовыражение и творчество',             types: ['A']      },
      { t: 'Помогать людям и быть нужным',           types: ['S']      },
      { t: 'Карьерный рост и финансовый результат',  types: ['E']      },
    ],
  },
  {
    q: 'Что из этого ближе к твоим ценностям?',
    opts: [
      { t: 'Технический прогресс',              types: ['R', 'C'] },
      { t: 'Красота и культура',                types: ['A']      },
      { t: 'Благополучие людей',                types: ['S']      },
      { t: 'Развитие бизнеса и экономики',      types: ['E', 'I'] },
    ],
  },
  {
    q: 'Какой результат работы тебя радует больше всего?',
    opts: [
      { t: 'Построенный объект или рабочая система', types: ['R', 'C'] },
      { t: 'Новое открытие или изобретение',         types: ['I']      },
      { t: 'Красивый проект или произведение',       types: ['A']      },
      { t: 'Благодарность и доверие людей',          types: ['S', 'E'] },
    ],
  },
  {
    q: 'Какой образ тебе ближе всего?',
    opts: [
      { t: 'Инженер, строящий и изобретающий',   types: ['R', 'I'] },
      { t: 'Архитектор, создающий пространство', types: ['A']      },
      { t: 'Руководитель, ведущий команду',      types: ['E', 'S'] },
      { t: 'Программист, решающий задачи',       types: ['C', 'I'] },
    ],
  },
]

/* ── Ikigai SVG ───────────────────────────────── */
function IkigaiDiagram() {
  return (
    <div style={{ position: 'relative', width: 320, height: 320, flexShrink: 0 }}>
      <svg viewBox="0 0 320 320" width="320" height="320" aria-hidden="true" style={{ overflow: 'visible' }}>
        <circle cx="160" cy="112" r="95" fill="rgba(200,16,46,0.13)" />
        <circle cx="222" cy="186" r="95" fill="rgba(34,140,60,0.10)" />
        <circle cx="160" cy="260" r="95" fill="rgba(30,80,200,0.10)" />
        <circle cx="98"  cy="186" r="95" fill="rgba(190,150,20,0.12)" />
        <circle cx="160" cy="186" r="30" fill="var(--ink)" />
        <text x="160" y="191" textAnchor="middle" fill="white" fontFamily="Georgia,serif" fontStyle="italic" fontSize="12">ikigai</text>
      </svg>
      <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--red)', whiteSpace:'nowrap' }}>ЧТО ЛЮБИШЬ</div>
      <div style={{ position:'absolute', top:'50%', right:-52, transform:'translateY(-50%)', fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', color:'#2a7a3a', writingMode:'vertical-rl' }}>В ЧЁМ СИЛЁН</div>
      <div style={{ position:'absolute', bottom:-14, left:'50%', transform:'translateX(-50%)', fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', color:'#2050a0', whiteSpace:'nowrap' }}>ЧТО НУЖНО МИРУ</div>
      <div style={{ position:'absolute', top:'50%', left:-56, transform:'translateY(-50%) rotate(180deg)', fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', color:'#a07820', writingMode:'vertical-rl' }}>ЗА ЧТО ПЛАТЯТ</div>
    </div>
  )
}

/* ── Main page ────────────────────────────────── */
export default function Diagnostics() {
  useReveal()
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<Record<HollandKey, number>>({ R:0, I:0, A:0, S:0, E:0, C:0 })

  function pick(types: HollandKey[]) {
    const next = { ...scores }
    types.forEach(t => { next[t] = (next[t] ?? 0) + 1 })
    setScores(next)
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1)
    } else {
      setPhase('result')
    }
  }

  function restart() {
    setPhase('intro')
    setStep(0)
    setScores({ R:0, I:0, A:0, S:0, E:0, C:0 })
  }

  /* ── dominant Holland type ── */
  const dominant = (Object.keys(scores) as HollandKey[]).reduce((a, b) => scores[a] >= scores[b] ? a : b)
  const info = HOLLAND[dominant]
  const faculties = FACULTIES.filter(f => info.facIds.includes(f.id))

  /* ──────────────── INTRO ──────────────────── */
  if (phase === 'intro') return (
    <main className="page">

      {/* Hero */}
      <section style={{ padding: 'clamp(80px,10vw,140px) 0 clamp(60px,8vw,100px)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 420px', maxWidth: 560 }}>
              <div className="eyebrow r" style={{ marginBottom: 24 }}>№ 06 / Профориентация · Икигай</div>
              <h1 className="h-display r" style={{ marginBottom: 28 }}>
                Найди своё<br /><em>направление.</em>
              </h1>
              <p className="lead r" style={{ marginBottom: 36, color: 'var(--muted)' }}>
                8 вопросов. Алия проанализирует твои ответы по методологии Икигай
                и Holland Codes — и подберёт специальности ГГНТУ, которые совпадают
                с твоим профилем.
              </p>
              <div className="r" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                {['8 вопросов', '3 минуты', 'Персональный результат'].map(tag => (
                  <span key={tag} style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', padding: '6px 14px', border: '1px solid var(--line-2)', borderRadius: 999 }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button className="btn r" onClick={() => setPhase('quiz')}>
                Начать тест <span className="btn__arr"><Arrow /></span>
              </button>
            </div>
            <div className="r" style={{ display: 'flex', justifyContent: 'center', padding: '0 40px' }}>
              <IkigaiDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* Methodology (dark) */}
      <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'clamp(80px,10vw,120px) 0' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64, alignItems: 'start' }} className="r">
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)', marginBottom: 20 }}>
                <b style={{ color: 'var(--red)' }}>02</b> Методология
              </div>
              <h2 className="h-1" style={{ color: 'var(--paper)' }}>
                Holland Codes<br />+ <em>Икигай</em>
              </h2>
            </div>
            <p style={{ fontSize: 'clamp(15px,1.1vw,18px)', lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', alignSelf: 'center' }}>
              Holland Codes — научная классификация профтипов личности, используется
              в профориентации по всему миру. Икигай — японская концепция смысла
              через пересечение призвания и профессии.
            </p>
          </div>

          <div className="r-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 1 }}>
            {(Object.entries(HOLLAND) as [HollandKey, typeof HOLLAND[HollandKey]][]).map(([key, h]) => (
              <div key={key} style={{ background: 'var(--ink-2)', padding: '28px 20px 24px', borderRadius: 2 }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 48, color: 'var(--red)', lineHeight: 1, marginBottom: 14 }}>{key}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, color: 'var(--paper)' }}>{h.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, marginBottom: 18 }}>{h.desc}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {FACULTIES.filter(f => h.facIds.includes(f.id)).map(f => (
                    <span key={f.id} style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--red)' }}>{f.short}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )

  /* ──────────────── QUIZ ───────────────────── */
  if (phase === 'quiz') {
    const q = QUESTIONS[step]
    const progress = ((step) / QUESTIONS.length) * 100
    return (
      <main className="page">
        <section style={{ minHeight: 'calc(100vh - 76px)', display: 'flex', alignItems: 'center', padding: 'clamp(60px,8vw,100px) 0' }}>
          <div className="wrap" style={{ width: '100%' }}>
            {/* Progress */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  Вопрос {step + 1} из {QUESTIONS.length}
                </span>
                <button onClick={restart} style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.6 }}>
                  Начать заново
                </button>
              </div>
              <div style={{ height: 2, background: 'var(--line-2)', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--red)', borderRadius: 99, transition: 'width .4s var(--e-out)' }} />
              </div>
            </div>

            {/* Question */}
            <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
              <h2 className="h-2" style={{ marginBottom: 48 }}>{q.q}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {q.opts.map(opt => (
                  <button
                    key={opt.t}
                    onClick={() => pick(opt.types)}
                    style={{
                      padding: '18px 28px',
                      border: '1px solid var(--line-2)',
                      borderRadius: 12,
                      fontSize: 16,
                      textAlign: 'left',
                      background: 'var(--paper)',
                      color: 'var(--ink)',
                      transition: 'border-color .2s, background .2s, transform .2s var(--e-out)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.borderColor = 'var(--ink)'
                      el.style.background = 'var(--paper-2)'
                      el.style.transform = 'translateX(6px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.borderColor = 'var(--line-2)'
                      el.style.background = 'var(--paper)'
                      el.style.transform = 'translateX(0)'
                    }}
                  >
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  /* ──────────────── RESULT ─────────────────── */
  return (
    <main className="page">
      {/* Result header (dark) */}
      <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'clamp(80px,10vw,120px) 0' }}>
        <div className="wrap">
          <div className="eyebrow r" style={{ marginBottom: 24, color: 'rgba(255,255,255,0.45)' }}>
            Твой профиль · Holland Codes
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(80px,14vw,180px)', color: 'var(--red)', lineHeight: 0.85, letterSpacing: '-0.04em' }} className="r">
              {dominant}
            </div>
            <div className="r">
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
                Тип личности
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,3.5vw,48px)', color: 'var(--paper)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {info.label}
              </div>
              <div style={{ marginTop: 10, fontSize: 16, color: 'rgba(255,255,255,0.55)' }}>
                {info.desc}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended specialties */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="wrap">
          <div style={{ marginBottom: 48 }}>
            <div className="eyebrow r" style={{ marginBottom: 16 }}>Подходящие направления ГГНТУ</div>
            <h2 className="h-2 r">
              {faculties.length === 1 ? faculties[0].name : `${faculties.map(f => f.short).join(' и ')} — твои институты`}
            </h2>
          </div>

          {faculties.map(fac => (
            <div key={fac.id} style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>
                {fac.short} · {fac.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }} className="r-stagger">
                {fac.specialties.slice(0, 6).map(sp => (
                  <div key={sp.code} style={{ padding: '20px 22px', border: '1px solid var(--line)', borderRadius: 8 }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', color: 'var(--muted)', marginBottom: 8 }}>{sp.code}</div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 18, letterSpacing: '-0.01em', marginBottom: 8 }}>{sp.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{sp.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            <Link href="/specialties" className="btn">
              Все специальности <span className="btn__arr"><Arrow /></span>
            </Link>
            <Link href="/chat" className="btn btn--ghost">
              Спросить Алию
            </Link>
            <button className="btn btn--ghost" onClick={restart}>
              Пройти заново
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
