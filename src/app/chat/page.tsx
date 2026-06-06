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
  ['Техника, инженерия, производство', 'Код, IT, программирование', 'Общение с людьми, помощь'],
  ['Теоретик — как всё устроено', 'Практик — делаю руками'],
  ['Точные науки (матем, физика, IT)', 'Гуманитарные (история, лит, обществ)'],
  ['Создавать новое', 'Совершенствовать существующее'],
  ['На объектах / в поле', 'В офисе / лаборатории', 'За компьютером'],
  ['Да, интересует', 'Нет, не моё'],
  ['Да, творчество близко', 'Нет, предпочитаю другое'],
  ['Стабильная карьера', 'Интересные задачи, пусть с риском'],
]

const CHAT_LS_KEY = 'chat_history_v1'

function fmt(d: Date) {
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function cleanText(raw: string): string {
  return raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .trim()
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function formatReply(raw: string): string {
  return raw
    .split('\n')
    .map(line =>
      line.startsWith('- ')
        ? `<span style="display:block;padding-left:1.2em;text-indent:-1.2em">&#8226; ${escHtml(line.slice(2))}</span>`
        : escHtml(line)
    )
    .join('\n')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}

/* ── Main component ───────────────────────────── */
function ChatInner() {
  useReveal()
  const searchParams = useSearchParams()
  const diagMode = searchParams.get('diag') === '1'
  const hollandKey = searchParams.get('holland') ?? ''
  const hollandLabel = searchParams.get('label') ?? ''
  const hollandZone = searchParams.get('zone') ?? ''
  const hollandLevel = searchParams.get('level') ?? 'uni'
  const hollandSpec = searchParams.get('spec') ?? ''
  const hollandMode = !!hollandKey

  const levelLabel = hollandLevel === 'spo' ? 'колледж (СПО)' : 'университет (бакалавриат)'

  const INITIAL_MESSAGE: Message = {
    id: 0,
    role: 'bot',
    text: hollandMode
      ? hollandSpec
        ? `Привет! Я <b>Алия</b>. Вижу, тебя интересует <b>${hollandSpec}</b> — расскажу подробнее: какие ЕГЭ нужны, где работают выпускники и каковы шансы на бюджет.`
        : `Привет! Я <b>Алия</b>. Вижу, ты прошёл тест — твой тип по Holland Codes: <b>${hollandKey} · ${hollandLabel}</b>, уровень: <b>${levelLabel}</b>. Подбираю подходящие специальности.`
      : diagMode
        ? 'Привет! Я <b>Алия</b>. Сейчас помогу подобрать специальность — проведу тест на 8 вопросов по методике Икигай и Holland Codes. Твои ответы помогут найти направление, которое совпадает с твоими интересами. Поехали?'
        : 'Привет, я <b>Алия</b> — виртуальный ассистент приёмной комиссии. Помогу выбрать направление, разобраться с документами, экзаменами и сроками. Спрашивай или выбирай тему.',
    buttons: hollandMode || diagMode ? [] : ['specialties', 'fspo', 'exams', 'budget', 'docs', 'dates'],
    time: new Date(),
  }

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [streaming, setStreaming] = useState(false)
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

  /* Restore chat history from localStorage (only in plain chat mode) */
  useEffect(() => {
    if (hollandMode || diagMode) return
    try {
      const saved = localStorage.getItem(CHAT_LS_KEY)
      if (!saved) return
      const { messages: savedMsgs, history: savedHistory, nextId } = JSON.parse(saved) as {
        messages: (Omit<Message, 'time'> & { time: string })[]
        history: { role: string; content: string }[]
        nextId: number
      }
      const restored = savedMsgs.map(m => ({ ...m, time: new Date(m.time) }))
      setMessages(restored)
      historyRef.current = savedHistory ?? []
      idRef.current = nextId ?? restored.length
    } catch { /* ignore corrupt data */ }
  }, [hollandMode, diagMode])

  /* Persist chat history whenever messages change */
  useEffect(() => {
    if (hollandMode || diagMode) return
    if (messages.length <= 1) return
    try {
      const toSave = messages.map(m => ({ ...m, time: m.time instanceof Date ? m.time.toISOString() : m.time }))
      localStorage.setItem(CHAT_LS_KEY, JSON.stringify({ messages: toSave, history: historyRef.current, nextId: idRef.current }))
    } catch { /* ignore */ }
  }, [messages, hollandMode, diagMode])

  const reply = useCallback(async (userText: string) => {
    historyRef.current = [...historyRef.current, { role: 'user', content: userText }]
    if (historyRef.current.length > 10) historyRef.current = historyRef.current.slice(-10)
    setTyping(true)

    const msgId = idRef.current++
    let accumulated = ''
    let firstChunk = true

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyRef.current }),
      })
      if (!res.body) throw new Error('No body')

      const reader = res.body.getReader()
      const dec = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += dec.decode(value, { stream: true })
        const html = formatReply(cleanText(accumulated))
        if (firstChunk) {
          firstChunk = false
          setTyping(false)
          setStreaming(true)
          setMessages(prev => [...prev, { id: msgId, role: 'bot', text: html, buttons: [], time: new Date() }])
        } else {
          setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: html } : m))
        }
      }

      const finalRaw = cleanText(accumulated) || 'Извини, не смогла ответить. Попробуй ещё раз.'
      historyRef.current = [...historyRef.current, { role: 'assistant', content: finalRaw }]
      if (firstChunk) {
        setTyping(false)
        setMessages(prev => [...prev, { id: msgId, role: 'bot', text: formatReply(finalRaw), buttons: [], time: new Date() }])
      } else {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: formatReply(finalRaw) } : m))
      }
    } catch {
      setTyping(false)
      const errText = 'Извини, ошибка соединения. Попробуй снова или позвони: <b>+7 929 003 66 66</b>'
      setMessages(prev => {
        if (prev.some(m => m.id === msgId)) return prev.map(m => m.id === msgId ? { ...m, text: errText } : m)
        return [...prev, { id: msgId, role: 'bot' as const, text: errText, buttons: [], time: new Date() }]
      })
    } finally {
      setStreaming(false)
    }
  }, [])

  /* Auto-send Holland result for personalised recommendations */
  useEffect(() => {
    if (hollandMode && !hollandTriggered.current) {
      hollandTriggered.current = true
      const zoneStr = hollandZone ? `, Икигай-зона — ${hollandZone}` : ''
      const levelStr = hollandLevel === 'spo' ? 'колледж ГГНТУ (СПО, без ЕГЭ)' : 'университет (бакалавриат/специалитет)'
      const apiText = hollandSpec
        ? `Меня заинтересовала специальность "${hollandSpec}". Мой тип по Holland Codes — ${hollandKey}, label: ${hollandLabel || hollandKey}${zoneStr}. Расскажи подробнее.`
        : `Я прошёл тест профориентации. Мой тип личности по Holland Codes — ${hollandKey} (${hollandLabel})${zoneStr}. Я хочу поступать в ${levelStr}. Подбери мне 3-4 самых подходящих специальности с обоснованием, почему именно они подходят для этого типа личности и Икигай-зоны.`
      const t = setTimeout(() => {
        reply(apiText)
      }, 600)
      return () => clearTimeout(t)
    }
  }, [hollandMode, hollandKey, hollandLabel, hollandZone, hollandLevel, hollandSpec, reply])

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
    if (!text.trim() || typing || streaming) return
    setMessages(prev => [...prev, { id: idRef.current++, role: 'user', text: text.trim(), time: new Date() }])
    setInput('')
    reply(text.trim())
  }, [reply, typing, streaming])

  const handleQuick = useCallback((_id: string, text: string) => {
    if (typing || streaming) return
    setMessages(prev => [...prev, { id: idRef.current++, role: 'user', text, time: new Date() }])
    reply(text)
  }, [reply, typing, streaming])

  const handleDiagAnswer = useCallback((ans: string) => {
    if (typing || streaming) return
    setDiagStep(s => s + 1)
    setMessages(prev => [...prev, { id: idRef.current++, role: 'user', text: ans, time: new Date() }])
    reply(ans)
  }, [reply, typing, streaming])

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
                  localStorage.removeItem(CHAT_LS_KEY)
                }}
              >
                Очистить
              </button>
            </div>

            <div className="chat__body" ref={bodyRef}>
              {messages.map((m, mi) => {
                const isLastBot = m.role === 'bot' && mi === messages.length - 1
                const showDiagBtns = isLastBot && diagMode && !typing && !streaming && diagStep < DIAG_ANSWERS.length
                const isStreamingMsg = isLastBot && streaming
                return (
                  <div key={m.id} className={`msg msg--${m.role}`}>
                    {m.role === 'bot' && <div className="msg__avatar">А</div>}
                    <div>
                      <div className={`msg__bubble${isStreamingMsg ? ' msg__bubble--streaming' : ''}`} dangerouslySetInnerHTML={{ __html: m.text }} />
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
                  disabled={!input.trim() || typing || streaming}
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
