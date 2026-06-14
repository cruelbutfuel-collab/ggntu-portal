'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { Arrow } from '@/components/icons'

const SUBJECTS = ['Математика', 'Физика', 'Информатика', 'Русский язык', 'Обществознание', 'Химия']
const GRADES   = ['9', '10', '11']

type FormState = {
  name:        string
  grade:       string
  age:         string
  subject:     string
  phone:       string
  parentPhone: string
}

export default function Prep() {
  useReveal()

  const [form, setForm] = useState<FormState>({ name: '', grade: '', age: '', subject: '', phone: '', parentPhone: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const valid = form.name.trim().length > 1 && form.grade && form.age && form.subject && form.phone.trim().length > 6

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    try {
      await fetch('/api/prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, grade: form.grade, age: form.age, subject: form.subject, phone: form.phone, parentPhone: form.parentPhone }),
      })
    } finally {
      setLoading(false)
      setSent(true)
    }
  }

  return (
    <main className="page">
      <section className="prep-hero">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 18 }}>№ 06 / Довузовская подготовка</div>
          <h1 className="h-1">
            Готовься к ЕГЭ<br />вместе с<br /><em>преподавателями ГГНТУ.</em>
          </h1>
          <p className="lead muted" style={{ marginTop: 24, maxWidth: 560 }}>
            Подготовительные курсы для учащихся 9–11 классов. Дисциплины — в профиль
            направлений университета. Занятия ведут действующие преподаватели кафедр.
          </p>
        </div>
      </section>

      <div className="wrap prep-layout">

        {/* ── Left: info + form ── */}
        <div className="prep-left">

          <div className="prep-info r">
            <div className="prep-info__block">
              <div className="prep-info__label">О программе</div>
              <p>
                Университет проводит занятия для учащихся 9–11 классов, направленные на успешную
                сдачу ОГЭ и ЕГЭ, а также адаптацию к вузовской системе обучения.
                Программы охватывают математику, физику, информатику, русский язык и обществознание —
                согласно профилю направлений ГГНТУ.
              </p>
            </div>
            <div className="prep-info__block">
              <div className="prep-info__label">Форматы занятий</div>
              <ul className="prep-list">
                <li>Очные групповые занятия (по расписанию)</li>
                <li>Индивидуальные консультации</li>
                <li>Профориентационные встречи и дни открытых дверей</li>
              </ul>
            </div>
            <div className="prep-info__block">
              <div className="prep-info__label">Дисциплины</div>
              <div className="prep-subjects">
                {SUBJECTS.map(s => (
                  <span key={s} className="prep-tag">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Registration form */}
          <div className="prep-form-wrap r">
            <div className="prep-form-head">
              <div className="eyebrow" style={{ marginBottom: 8 }}>Запись на курсы</div>
              <p className="muted" style={{ fontSize: 14 }}>Оставь заявку — свяжемся в течение рабочего дня.</p>
            </div>

            {sent ? (
              <div className="prep-success">
                <div className="prep-success__icon">✓</div>
                <div className="prep-success__title">Заявка принята!</div>
                <p>Мы свяжемся с тобой в ближайшее время. Проверь почту или ожидай звонка.</p>
              </div>
            ) : (
              <form className="prep-form" onSubmit={handleSubmit} noValidate>
                <label className="prep-field">
                  <span className="prep-field__label">ФИО</span>
                  <input
                    className="prep-field__input"
                    type="text"
                    placeholder="Иванов Иван Иванович"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </label>

                <div className="prep-row">
                  <label className="prep-field">
                    <span className="prep-field__label">Класс</span>
                    <select className="prep-field__input" value={form.grade} onChange={set('grade')} required>
                      <option value="">—</option>
                      {GRADES.map(g => <option key={g} value={g}>{g} класс</option>)}
                    </select>
                  </label>

                  <label className="prep-field">
                    <span className="prep-field__label">Возраст</span>
                    <input
                      className="prep-field__input"
                      type="number"
                      placeholder="14"
                      min={12} max={20}
                      value={form.age}
                      onChange={set('age')}
                      required
                    />
                  </label>
                </div>

                <label className="prep-field">
                  <span className="prep-field__label">Предмет</span>
                  <select className="prep-field__input" value={form.subject} onChange={set('subject')} required>
                    <option value="">Выбери предмет</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>

                <label className="prep-field">
                  <span className="prep-field__label">Номер телефона</span>
                  <input
                    className="prep-field__input"
                    type="tel"
                    placeholder="+7 (900) 000-00-00"
                    value={form.phone}
                    onChange={set('phone')}
                    required
                  />
                </label>

                <label className="prep-field">
                  <span className="prep-field__label">Номер телефона родителя</span>
                  <input
                    className="prep-field__input"
                    type="tel"
                    placeholder="+7 (900) 000-00-00"
                    value={form.parentPhone}
                    onChange={set('parentPhone')}
                  />
                </label>

                <button
                  type="submit"
                  className="btn prep-submit"
                  disabled={!valid || loading}
                >
                  {loading ? <span>Отправляем…</span> : <><span>Записаться</span><span className="btn__arr"><Arrow /></span></>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Right: photo ── */}
        <div className="prep-photo-wrap r">
          <div className="prep-photo">
            <div className="prep-photo__img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/classroom.jpg"
                alt="Аудитория ГГНТУ"
                className="prep-photo__img"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <div className="prep-photo__overlay">
                <span className="prep-photo__caption">Аудитория ГГНТУ · Код успеха</span>
              </div>
            </div>
            <div className="prep-stats">
              {[
                { n: '9–11', l: 'классы' },
                { n: '5',    l: 'предметов' },
                { n: '24/7', l: 'чат-бот Алия' },
              ].map(s => (
                <div key={s.l} className="prep-stat">
                  <div className="prep-stat__n">{s.n}</div>
                  <div className="prep-stat__l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
