'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { Arrow } from '@/components/icons'
import { FACULTIES } from '@/lib/data'

/* ── Types ─────────────────────────────────────── */
type HollandKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
type IkigaiAxis = 'love' | 'good' | 'world' | 'paid'

/* ── Holland ───────────────────────────────────── */
const HOLLAND: Record<HollandKey, { label: string; desc: string; facIds: string[] }> = {
  R: { label: 'Реалист',         desc: 'Техника, инженерия, физический труд',  facIds: ['ie', 'inig']     },
  I: { label: 'Исследователь',   desc: 'Наука, анализ, исследования',           facIds: ['inig']           },
  A: { label: 'Художник',        desc: 'Творчество, дизайн, архитектура',       facIds: ['isaid']          },
  S: { label: 'Социальный',      desc: 'Люди, управление, коммуникации',        facIds: ['iceitp']         },
  E: { label: 'Предприниматель', desc: 'Бизнес, лидерство, менеджмент',         facIds: ['iceitp']         },
  C: { label: 'Системный',       desc: 'Данные, IT, точность, структура',       facIds: ['ipit', 'iceitp'] },
}

/* ── Ikigai axes ───────────────────────────────── */
const IKIGAI_AXES: Record<IkigaiAxis, { label: string; color: string }> = {
  love:  { label: 'Что любишь',     color: 'rgba(200,16,46,1)'  },
  good:  { label: 'В чём силён',    color: 'rgba(34,140,60,1)'  },
  world: { label: 'Что нужно миру', color: 'rgba(80,120,220,1)' },
  paid:  { label: 'За что платят',  color: 'rgba(190,150,20,1)' },
}

/* ── Ikigai zones (top-2 axes sorted alphabetically) */
const IKIGAI_ZONE: Record<string, { name: string; desc: string }> = {
  'good-love':  { name: 'Страсть',    desc: 'Ты любишь то, в чём по-настоящему силён. Ищи профессию, где работа ощущается как увлечение.' },
  'love-world': { name: 'Миссия',     desc: 'Ты хочешь менять мир через то, что любишь. Твоя мотивация — смысл, а не только результат.'   },
  'love-paid':  { name: 'Баланс',     desc: 'Тебе важно, чтобы работа нравилась и достойно оплачивалась. Страсть и стабильность вместе.'   },
  'good-world': { name: 'Призвание',  desc: 'Ты используешь свои таланты на благо общества. Карьера строится вокруг вклада в мир.'        },
  'good-paid':  { name: 'Профессия',  desc: 'Карьера строится на твоих сильных сторонах. Рост, экспертиза и хорошее вознаграждение.'       },
  'paid-world': { name: 'Вокация',    desc: 'Твоя работа нужна миру и хорошо оплачивается. Прагматика сочетается с ответственностью.'     },
}

/* ── Holland → Ikigai weight matrix ───────────── */
const H2I: Record<HollandKey, Record<IkigaiAxis, number>> = {
  R: { love: 0.30, good: 0.90, world: 0.20, paid: 0.60 },
  I: { love: 0.50, good: 0.90, world: 0.60, paid: 0.40 },
  A: { love: 0.90, good: 0.50, world: 0.50, paid: 0.30 },
  S: { love: 0.70, good: 0.40, world: 0.90, paid: 0.40 },
  E: { love: 0.40, good: 0.60, world: 0.50, paid: 0.90 },
  C: { love: 0.30, good: 0.80, world: 0.30, paid: 0.80 },
}

/* ── Quiz questions ────────────────────────────── */
const QUESTIONS: { q: string; opts: { t: string; types: HollandKey[] }[] }[] = [
  {
    q: 'Что тебя по-настоящему увлекает?',
    opts: [
      { t: 'Техника, код и точные расчёты',     types: ['R', 'C'] },
      { t: 'Исследования и открытия',            types: ['I']      },
      { t: 'Творчество, дизайн, создание',       types: ['A']      },
      { t: 'Общение, помощь людям',              types: ['S', 'E'] },
    ],
  },
  {
    q: 'В свободное время ты чаще...',
    opts: [
      { t: 'Изучаешь технику или программируешь', types: ['R', 'C'] },
      { t: 'Читаешь, анализируешь, исследуешь',   types: ['I']      },
      { t: 'Рисуешь, создаёшь, придумываешь',     types: ['A']      },
      { t: 'Общаешься и организуешь встречи',      types: ['S', 'E'] },
    ],
  },
  {
    q: 'Что получается у тебя лучше всего?',
    opts: [
      { t: 'Работать с техникой и инструментами',      types: ['R']      },
      { t: 'Анализировать данные и находить паттерны', types: ['I', 'C'] },
      { t: 'Создавать оригинальные идеи',              types: ['A']      },
      { t: 'Вести за собой и убеждать',                types: ['E', 'S'] },
    ],
  },
  {
    q: 'Тебя чаще всего просят помочь с...',
    opts: [
      { t: 'Чем-то техническим или цифровым',    types: ['R', 'C'] },
      { t: 'Объяснить сложную тему',             types: ['I']      },
      { t: 'Сделать красиво — дизайн, текст',    types: ['A']      },
      { t: 'Организовать или урегулировать',      types: ['S', 'E'] },
    ],
  },
  {
    q: 'Какой вклад важен для тебя?',
    opts: [
      { t: 'Создавать технологии будущего', types: ['R', 'I', 'C'] },
      { t: 'Делать мир красивее и культурнее', types: ['A']        },
      { t: 'Помогать людям и обществу',        types: ['S']        },
      { t: 'Развивать экономику и бизнес',     types: ['E']        },
    ],
  },
  {
    q: 'Что тебя волнует больше всего?',
    opts: [
      { t: 'Технологическое отставание / энергетика', types: ['R', 'C'] },
      { t: 'Экология и устойчивое развитие',          types: ['I']      },
      { t: 'Культурное и творческое обеднение',       types: ['A']      },
      { t: 'Социальное неравенство',                   types: ['S', 'E'] },
    ],
  },
  {
    q: 'Где видишь себя через 5 лет?',
    opts: [
      { t: 'Инженер, IT-специалист, учёный',           types: ['R', 'I', 'C'] },
      { t: 'Предприниматель или топ-менеджер',          types: ['E']           },
      { t: 'Архитектор, дизайнер, творческий спец.',   types: ['A']           },
      { t: 'Специалист по работе с людьми',            types: ['S']           },
    ],
  },
  {
    q: 'Что важнее в карьере?',
    opts: [
      { t: 'Техническая экспертиза и глубина знаний', types: ['R', 'I', 'C'] },
      { t: 'Власть, влияние и финансовый результат',  types: ['E']           },
      { t: 'Признание и творческая свобода',           types: ['A']           },
      { t: 'Смысл и возможность помогать',             types: ['S']           },
    ],
  },
]

/* ── Static Ikigai diagram (intro) ─────────────── */
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

/* ── Dynamic Ikigai result diagram ─────────────── */
function IkigaiResultDiagram({ love, good, world, paid }: { love: number; good: number; world: number; paid: number }) {
  const b = 0.07
  const s = 0.38
  return (
    <div style={{ position: 'relative', width: 260, height: 260, flexShrink: 0 }}>
      <svg viewBox="0 0 260 260" width="260" height="260" aria-hidden="true" style={{ overflow: 'visible' }}>
        <circle cx="130" cy="88"  r="78" fill={`rgba(200,16,46,${b + love * s})`}  />
        <circle cx="182" cy="160" r="78" fill={`rgba(34,140,60,${b + good * s})`}  />
        <circle cx="130" cy="230" r="78" fill={`rgba(80,120,220,${b + world * s})`} />
        <circle cx="78"  cy="160" r="78" fill={`rgba(190,150,20,${b + paid * s})`}  />
        <circle cx="130" cy="160" r="22" fill="rgba(255,255,255,0.10)" />
        <text x="130" y="165" textAnchor="middle" fill="white" fontFamily="Georgia,serif" fontStyle="italic" fontSize="10" opacity="0.75">ikigai</text>
      </svg>
      <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(220,80,80,0.85)', whiteSpace:'nowrap' }}>ЧТО ЛЮБИШЬ</div>
      <div style={{ position:'absolute', top:'50%', right:-60, transform:'translateY(-50%)', fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(60,160,80,0.85)', writingMode:'vertical-rl' }}>В ЧЁМ СИЛЁН</div>
      <div style={{ position:'absolute', bottom:-16, left:'50%', transform:'translateX(-50%)', fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(100,140,220,0.85)', whiteSpace:'nowrap' }}>ЧТО НУЖНО МИРУ</div>
      <div style={{ position:'absolute', top:'50%', left:-68, transform:'translateY(-50%) rotate(180deg)', fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(190,150,20,0.85)', writingMode:'vertical-rl' }}>ЗА ЧТО ПЛАТЯТ</div>
    </div>
  )
}

/* ── Main page ──────────────────────────────────── */
export default function Diagnostics() {
  useReveal()
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [level, setLevel] = useState<'uni' | 'spo' | null>(null)
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState<Record<HollandKey, number>>({ R:0, I:0, A:0, S:0, E:0, C:0 })

  function pick(types: HollandKey[]) {
    const next = { ...scores }
    types.forEach(t => { next[t]++ })
    setScores(next)
    if (step < QUESTIONS.length - 1) setStep(s => s + 1)
    else setPhase('result')
  }

  function restart() {
    setPhase('intro')
    setLevel(null)
    setStep(0)
    setScores({ R:0, I:0, A:0, S:0, E:0, C:0 })
  }

  /* ── Compute results ────────────────────────── */
  const dominant = (Object.keys(scores) as HollandKey[]).reduce((a, b) => scores[a] >= scores[b] ? a : b)
  const info = HOLLAND[dominant]
  const faculties = level === 'spo'
    ? FACULTIES.filter(f => f.id === 'fspo')
    : FACULTIES.filter(f => info.facIds.includes(f.id))

  /* Ikigai: weighted sum of Holland scores, normalised to 0-1 */
  const total = Object.values(scores).reduce((s, v) => s + v, 0) || 1
  const raw = { love: 0, good: 0, world: 0, paid: 0 }
  ;(Object.keys(scores) as HollandKey[]).forEach(k => {
    const w = scores[k] / total
    ;(Object.keys(raw) as IkigaiAxis[]).forEach(ax => { raw[ax] += w * H2I[k][ax] })
  })
  const maxRaw = Math.max(...Object.values(raw)) || 1
  const ik: Record<IkigaiAxis, number> = {
    love:  raw.love  / maxRaw,
    good:  raw.good  / maxRaw,
    world: raw.world / maxRaw,
    paid:  raw.paid  / maxRaw,
  }

  /* Top-2 axes → zone key */
  const sorted = (Object.keys(ik) as IkigaiAxis[]).sort((a, b) => ik[b] - ik[a])
  const zoneKey = [sorted[0], sorted[1]].sort().join('-')
  const zone = IKIGAI_ZONE[zoneKey] ?? { name: 'Икигай', desc: 'Ты гармонично развит по всем направлениям.' }

  /* ──────────────── INTRO ──────────────────── */
  if (phase === 'intro') return (
    <main className="page">
      <section style={{ padding: 'clamp(80px,10vw,140px) 0 clamp(60px,8vw,100px)' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 420px', maxWidth: 560 }}>
              <div className="eyebrow r" style={{ marginBottom: 24 }}>№ 06 / Профориентация · Икигай + Holland</div>
              <h1 className="h-display r" style={{ marginBottom: 28 }}>
                Найди своё<br /><em>направление.</em>
              </h1>
              <p className="lead r" style={{ marginBottom: 36, color: 'var(--muted)' }}>
                8 вопросов. Алия проанализирует твои ответы сразу по двум методологиям —
                Holland Codes и Икигай — и покажет специальности ГГНТУ, которые совпадают
                с твоим профилем.
              </p>
              <div className="r" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                {['8 вопросов', '3 минуты', 'Два метода', 'Персональный результат'].map(tag => (
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
              через пересечение того, что любишь, в чём силён, что нужно миру и за что платят.
              Вместе они дают объёмный портрет.
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

      {/* ── Ikigai section (light) ── */}
      <section style={{ padding: 'clamp(80px,10vw,120px) 0' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
            <div>
              <div className="eyebrow r" style={{ marginBottom: 16 }}>
                <b style={{ color: 'var(--red)' }}>03</b> · Четыре оси Икигай
              </div>
              <h2 className="h-2 r">Тест измеряет<br /><em>каждую из них.</em></h2>
            </div>
            <p className="r" style={{ fontSize: 'clamp(15px,1.1vw,17px)', lineHeight: 1.7, color: 'var(--muted)', maxWidth: 400, margin: 0 }}>
              Результат покажет, какие оси у тебя развиты сильнее — и в какой зоне находится твоё призвание.
            </p>
          </div>

          {/* 4 axis cards */}
          <div className="r-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
            {([
              { color: 'rgba(200,16,46,1)',  bg: 'rgba(200,16,46,0.06)',  label: 'Что любишь',     desc: 'Твои страсти и интересы — то, что зажигает и вдохновляет.' },
              { color: 'rgba(34,140,60,1)',  bg: 'rgba(34,140,60,0.06)',  label: 'В чём силён',    desc: 'Твои таланты и навыки — то, что получается лучше всего.'   },
              { color: 'rgba(80,120,220,1)', bg: 'rgba(80,120,220,0.06)', label: 'Что нужно миру', desc: 'Потребности общества — проблемы, которые важно решать.'     },
              { color: 'rgba(190,150,20,1)', bg: 'rgba(190,150,20,0.06)', label: 'За что платят',  desc: 'Рыночный спрос — профессии и навыки, которые ценятся.'     },
            ] as const).map(item => (
              <div key={item.label} style={{ background: item.bg, borderTop: `3px solid ${item.color}`, padding: '28px 22px 26px', borderRadius: 8 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: item.color, marginBottom: 14, fontWeight: 700 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Zone intersections */}
          <div className="r-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
            {([
              { name: 'Страсть',   eq: 'Любишь + Силён',   note: 'Увлечение, которое развито'    },
              { name: 'Миссия',    eq: 'Любишь + Мир',      note: 'Смысл и предназначение'        },
              { name: 'Профессия', eq: 'Силён + Платят',    note: 'Карьера на сильных сторонах'   },
              { name: 'Призвание', eq: 'Мир + Платят',      note: 'Нужность и вознаграждение'     },
            ]).map(z => (
              <div key={z.name} style={{ border: '1px solid var(--line)', padding: '18px 22px', borderRadius: 8 }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink)', marginBottom: 6 }}>{z.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>{z.eq}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{z.note}</div>
              </div>
            ))}
          </div>

          {/* Ikigai center */}
          <div className="r" style={{ border: '1px solid var(--red)', borderRadius: 8, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 24, color: 'var(--red)', flexShrink: 0 }}>Икигай</div>
            <div style={{ width: 1, height: 32, background: 'var(--line-2)', flexShrink: 0 }} />
            <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
              Когда все четыре оси пересекаются — ты нашёл дело жизни. Тест покажет, насколько ты близко.
            </div>
          </div>

          {/* CTA */}
          <div className="r" style={{ marginTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <h2 className="h-2">Пройди тест<br />за <em>3 минуты</em>.</h2>
            <button className="btn" onClick={() => setPhase('quiz')} style={{ background: 'var(--red)', flexShrink: 0 }}>
              Начать тест <span className="btn__arr"><Arrow /></span>
            </button>
          </div>
        </div>
      </section>
    </main>
  )

  /* ──────────────── LEVEL SELECT ──────────── */
  if (phase === 'quiz' && level === null) return (
    <main className="page">
      <section style={{ minHeight: 'calc(100vh - 76px)', display: 'flex', alignItems: 'center', padding: 'clamp(60px,8vw,100px) 0' }}>
        <div className="wrap" style={{ width: '100%' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 40 }}>
              Шаг 0 · перед началом
            </div>
            <h2 className="h-2" style={{ marginBottom: 48 }}>Куда планируешь<br /><em>поступать?</em></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([
                { val: 'uni' as const, label: 'В университет — бакалавриат / специалитет', sub: 'После 11 класса или колледжа, с ЕГЭ' },
                { val: 'spo' as const, label: 'В колледж ГГНТУ (СПО)', sub: 'После 9 или 11 класса, без ЕГЭ — по среднему баллу аттестата' },
              ]).map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setLevel(opt.val)}
                  style={{ padding: '20px 28px', border: '1px solid var(--line-2)', borderRadius: 12, textAlign: 'left', background: 'var(--paper)', color: 'var(--ink)', cursor: 'pointer', transition: 'border-color .2s, background .2s, transform .2s var(--e-out)' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'var(--ink)'; el.style.background = 'var(--paper-2)'; el.style.transform = 'translateX(6px)' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--line-2)'; el.style.background = 'var(--paper)'; el.style.transform = 'translateX(0)' }}
                >
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{opt.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )

  /* ──────────────── QUIZ ───────────────────── */
  if (phase === 'quiz') {
    const q = QUESTIONS[step]
    const progress = (step / QUESTIONS.length) * 100
    return (
      <main className="page">
        <section style={{ minHeight: 'calc(100vh - 76px)', display: 'flex', alignItems: 'center', padding: 'clamp(60px,8vw,100px) 0' }}>
          <div className="wrap" style={{ width: '100%' }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  Вопрос {step + 1} из {QUESTIONS.length}
                </span>
                <button onClick={restart} style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer' }}>
                  Начать заново
                </button>
              </div>
              <div style={{ height: 2, background: 'var(--line-2)', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--red)', borderRadius: 99, transition: 'width .4s var(--e-out)' }} />
              </div>
            </div>

            <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
              <h2 className="h-2" style={{ marginBottom: 48 }}>{q.q}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {q.opts.map(opt => (
                  <button
                    key={opt.t}
                    onClick={() => pick(opt.types)}
                    style={{ padding: '18px 28px', border: '1px solid var(--line-2)', borderRadius: 12, fontSize: 16, textAlign: 'left', background: 'var(--paper)', color: 'var(--ink)', cursor: 'pointer', transition: 'border-color .2s, background .2s, transform .2s var(--e-out)' }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'var(--ink)'; el.style.background = 'var(--paper-2)'; el.style.transform = 'translateX(6px)' }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--line-2)'; el.style.background = 'var(--paper)'; el.style.transform = 'translateX(0)' }}
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
      {/* Dark: Holland type + Ikigai diagram + zone */}
      <section style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 'clamp(80px,10vw,120px) 0' }}>
        <div className="wrap">
          <div className="eyebrow r" style={{ marginBottom: 32, color: 'rgba(255,255,255,0.40)' }}>
            Твой профиль · Holland Codes + Икигай
          </div>

          {/* Main result row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap', marginBottom: 56 }}>
            {/* Holland */}
            <div className="r">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(80px,12vw,160px)', color: 'var(--red)', lineHeight: 0.85, letterSpacing: '-0.04em' }}>
                  {dominant}
                </div>
                <div style={{ paddingBottom: 12 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)', marginBottom: 6 }}>
                    Тип по Holland
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px,3vw,40px)', color: 'var(--paper)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    {info.label}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 15, color: 'rgba(255,255,255,0.50)' }}>
                    {info.desc}
                  </div>
                </div>
              </div>

              {/* Ikigai zone badge */}
              <div style={{ display: 'inline-block', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', padding: '16px 24px', maxWidth: 420 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)', marginBottom: 6 }}>
                  Икигай-зона
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--red)', marginBottom: 6 }}>
                  {zone.name}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>
                  {zone.desc}
                </div>
              </div>
            </div>

            {/* Ikigai dynamic diagram */}
            <div className="r" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
              <IkigaiResultDiagram love={ik.love} good={ik.good} world={ik.world} paid={ik.paid} />
            </div>
          </div>

          {/* Ikigai axis bars */}
          <div className="r" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 48px', marginBottom: 56 }}>
            {(Object.keys(IKIGAI_AXES) as IkigaiAxis[]).map(ax => (
              <div key={ax}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)' }}>
                    {IKIGAI_AXES[ax].label}
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                    {Math.round(ik[ax] * 100)}%
                  </span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${ik[ax] * 100}%`, background: IKIGAI_AXES[ax].color, borderRadius: 99, opacity: 0.75 }} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA to chat */}
          <div style={{ paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 'clamp(15px,1.1vw,18px)', color: 'rgba(255,255,255,0.60)', maxWidth: 520, lineHeight: 1.6, margin: 0 }}>
              Это общий профиль. Алия проведёт персональный разбор и подберёт специальности именно под твои предметы и цели.
            </p>
            <Link
              href={`/chat?holland=${dominant}&label=${encodeURIComponent(info.label)}&zone=${encodeURIComponent(zone.name)}&level=${level ?? 'uni'}`}
              className="btn"
              style={{ background: 'var(--red)', flexShrink: 0 }}
            >
              Подобрать со мной <span className="btn__arr"><Arrow /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Light: Recommended specialties */}
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

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            <Link href="/specialties" className="btn">
              Все специальности <span className="btn__arr"><Arrow /></span>
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
