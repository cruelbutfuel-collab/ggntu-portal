'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useReveal } from '@/hooks/useReveal'
import { Arrow } from '@/components/icons'
import { QUICK_REPLIES } from '@/lib/data'

interface Message {
  id: number
  role: 'bot' | 'user'
  text: string
  buttons?: string[]
  time: Date
}

const DIAG_ANSWERS = [
  ['В университет (бакалавриат / специалитет)', 'В колледж (СПО, после 9 или 11 класса)'],
  ['Техника, код, расчёты', 'Общение с людьми'],
  ['Теоретик — как всё устроено', 'Практик — делаю руками'],
  ['Точные науки (матем, физика, IT)', 'Гуманитарные (история, лит, обществ)'],
  ['Создавать новое', 'Совершенствовать существующее'],
  ['На объектах / в поле', 'В офисе / лаборатории', 'За компьютером'],
  ['Да, интересует', 'Нет, не моё'],
  ['Да, творчество близко', 'Нет, предпочитаю другое'],
  ['Стабильная карьера', 'Интересные задачи, пусть с риском'],
]

function fmt(d: Date) {
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

/* ── Main component ───────────────────────────── */
function ChatInner() {
  useReveal()
  const searchParams = useSearchParams()
  const diagMode = searchParams.get('diag') === '1'
  const hollandKey = searchParams.get('holland') ?? ''
  const hollandLabel = searchParams.get('label') ?? ''
  const hollandZone = searchParams.get('zone') ?? ''
  const hollandMode = !!hollandKey

  const INITIAL_MESSAGE: Message = {
    id: 0,
    role: 'bot',
    text: hollandMode
      ? `Привет! Я <b>Алия</b>. Вижу, ты прошёл тест профориентации — твой тип по Holland Codes: <b>${hollandKey} · ${hollandLabel}</b>. Сейчас подберу специальности ГГНТУ, которые подходят именно тебе, и объясню почему.`
      : diagMode
        ? 'Привет! Я <b>Алия</b>. Сейчас помогу подобрать специальность — проведу тест на 8 вопросов по методике Икигай и Holland Codes. Твои ответы помогут найти направление, которое совпадает с твоими интересами. Поехали?'
        : 'Привет, я <b>Алия</b> — виртуальный ассистент приёмной комиссии. Помогу выбрать направление, разобраться с документами, экзаменами и сроками. Спрашивай или выбирай тему.',
    buttons: hollandMode || diagMode ? [] : ['specialties', 'fspo', 'exams', 'budget', 'docs', 'dates'],
    time: new Date(),
  }

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [diagStep, setDiagStep] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(1)
  const historyRef = useRef<{ role: string; content: string }[]>([])
  const diagTriggered = useRef(false)
  const hollandTriggered = useRef(false)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, typing])

  const reply = useCallback(async (userText: string) => {
    historyRef.current = [...historyRef.current, { role: 'user', content: userText }]
    if (historyRef.current.length > 20) historyRef.current = historyRef.current.slice(-20)
    setTyping(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyRef.current }),
      })
      const data = await res.json() as { reply?: string }
      const botText = data.reply || 'Извини, не смогла ответить. Попробуй ещё раз.'
      historyRef.current = [...historyRef.current, { role: 'assistant', content: botText }]
      setTyping(false)
      setMessages(prev => [...prev, {
        id: idRef.current++,
        role: 'bot',
        text: botText,
        buttons: [],
        time: new Date(),
      }])
    } catch {
      setTyping(false)
      setMessages(prev => [...prev, {
        id: idRef.current++,
        role: 'bot',
        text: 'Извини, ошибка соединения. Попробуй снова или позвони: <b>+7 929 003 66 66</b>',
        buttons: [],
        time: new Date(),
      }])
    }
  }, [])

  /* Auto-send Holland result for personalised recommendations */
  useEffect(() => {
    if (hollandMode && !hollandTriggered.current) {
      hollandTriggered.current = true
      const zoneStr = hollandZone ? `, Икигай-зона — ${hollandZone}` : ''
      const apiText = `Я прошёл тест профориентации. Мой тип личности по Holland Codes — ${hollandKey} (${hollandLabel})${zoneStr}. Подбери мне 3-4 самых подходящих специальности ГГНТУ с обоснованием, почему именно они подходят для этого типа личности и Икигай-зоны.`
      const t = setTimeout(() => {
        reply(apiText)
      }, 600)
      return () => clearTimeout(t)
    }
  }, [hollandMode, hollandKey, hollandLabel, hollandZone, reply])

  /* Auto-start diagnostic */
  useEffect(() => {
    if (diagMode && !diagTriggered.current) {
      diagTriggered.current = true
      const t = setTimeout(() => {
        setMessages(prev => [...prev, {
          id: idRef.current++,
          role: 'user',
          text: 'Начать тест на профориентацию',
          time: new Date(),
        }])
        reply('начать тест профориентации')
      }, 900)
      return () => clearTimeout(t)
    }
  }, [diagMode, reply])

  const send = useCallback((text: string) => {
    if (!text.trim() || typing) return
    setMessages(prev => [...prev, { id: idRef.current++, role: 'user', text: text.trim(), time: new Date() }])
    setInput('')
    reply(text.trim())
  }, [reply, typing])

  const handleQuick = useCallback((_id: string, text: string) => {
    setMessages(prev => [...prev, { id: idRef.current++, role: 'user', text, time: new Date() }])
    reply(text)
  }, [reply])

  const handleDiagAnswer = useCallback((ans: string) => {
    setDiagStep(s => s + 1)
    setMessages(prev => [...prev, { id: idRef.current++, role: 'user', text: ans, time: new Date() }])
    reply(ans)
  }, [reply])

  return (
    <main className="page chat">
      <div className="wrap">
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>№ 04 / Алия — ассистент приёмной комиссии</div>
          <h1 className="h-1">Спрашивай <em>что угодно</em><br />о поступлении.</h1>
        </div>

        <div className="chat__layout">
          <aside className="chat__side">
            <div className="chat__bot">
              <div className="chat__avatar">А</div>
              <div className="chat__bot-name">Алия</div>
              <div className="chat__bot-status"><b>●</b> Онлайн · отвечает мгновенно</div>
              <p className="chat__bot-desc">
                Виртуальный помощник приёмной комиссии. Отвечаю на вопросы о направлениях, экзаменах, документах и сроках.
              </p>
            </div>

            <div>
              <div className="chat__topics-h">Популярные темы</div>
              {QUICK_REPLIES.map(q => (
                <button
                  key={q.id}
                  className="chat__topic"
                  onClick={() => handleQuick(q.id, q.text)}
                >
                  {q.text}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
              <div className="chat__topics-h">Живая поддержка</div>
              <a href="tel:+79290036666" style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: 18, marginBottom: 6 }}>
                +7 929 003 66 66
              </a>
              <a href="mailto:priem@gstou.ru" style={{ display: 'block', fontSize: 13, color: 'var(--muted)' }}>
                priem@gstou.ru
              </a>
              <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)' }}>
                Пн–Пт · 9:00–17:00
              </div>
            </div>
          </aside>

          <div className="chat__main">
            <div className="chat__head">
              <div className="chat__head-info">
                <div className="chat__head-avatar">А</div>
                <div>
                  <div className="chat__head-name">Алия — ассистент</div>
                  <div className="chat__head-meta">Онлайн · отвечает мгновенно</div>
                </div>
              </div>
              <button
                className="chat__head-clear"
                onClick={() => {
                  setMessages([{ ...INITIAL_MESSAGE, time: new Date() }])
                  idRef.current = 1
                  historyRef.current = []
                  setDiagStep(0)
                }}
              >
                Очистить
              </button>
            </div>

            <div className="chat__body" ref={bodyRef}>
              {messages.map((m, mi) => {
                const isLastBot = m.role === 'bot' && mi === messages.length - 1
                const showDiagBtns = isLastBot && diagMode && !typing && diagStep < DIAG_ANSWERS.length
                return (
                  <div key={m.id} className={`msg msg--${m.role}`}>
                    {m.role === 'bot' && <div className="msg__avatar">А</div>}
                    <div>
                      <div className="msg__bubble" dangerouslySetInnerHTML={{ __html: m.text }} />
                      {m.buttons && m.buttons.length > 0 && (
                        <div className="msg__buttons">
                          {m.buttons.map(b => {
                            const q = QUICK_REPLIES.find(x => x.id === b)
                            if (!q) return null
                            return (
                              <button key={b} className="msg__btn" onClick={() => handleQuick(q.id, q.text)}>
                                {q.text}
                              </button>
                            )
                          })}
                        </div>
                      )}
                      {showDiagBtns && (
                        <div className="msg__buttons msg__buttons--diag">
                          {DIAG_ANSWERS[diagStep].map(ans => (
                            <button key={ans} className="msg__btn msg__btn--diag" onClick={() => handleDiagAnswer(ans)}>
                              {ans}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="msg__time">{fmt(m.time)}</div>
                    </div>
                  </div>
                )
              })}
              {typing && (
                <div className="msg msg--bot">
                  <div className="msg__avatar">А</div>
                  <div className="msg__bubble">
                    <span style={{ display: 'inline-flex', gap: 4 }}>
                      <i style={{ width: 6, height: 6, background: 'var(--ink)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.2s var(--e-io) infinite' }} />
                      <i style={{ width: 6, height: 6, background: 'var(--ink)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.2s var(--e-io) infinite', animationDelay: '.15s' }} />
                      <i style={{ width: 6, height: 6, background: 'var(--ink)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.2s var(--e-io) infinite', animationDelay: '.3s' }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="chat__input-wrap">
              <div className="chat__chips">
                {QUICK_REPLIES.slice(0, 4).map(q => (
                  <button key={q.id} className="chat__chip" onClick={() => handleQuick(q.id, q.text)}>
                    {q.text}
                  </button>
                ))}
              </div>
              <div className="chat__input-row">
                <textarea
                  className="chat__input"
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send(input)
                    }
                  }}
                  placeholder="Напиши вопрос и нажми Enter…"
                />
                <button
                  className="chat__send"
                  onClick={() => send(input)}
                  disabled={!input.trim() || typing}
                >
                  <Arrow s={14} />
                </button>
              </div>
              <div className="chat__hint">Enter — отправить · Shift+Enter — новая строка</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Chat() {
  return (
    <Suspense fallback={<main className="page" />}>
      <ChatInner />
    </Suspense>
  )
}
