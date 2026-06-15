'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

type ExamEntry = { date: string; subject: string; time: string }
type Specialty = { code: string; name: string; exams: ExamEntry[] }
type MasterFees = { ochno?: number; ochnoZaochno?: number; zaochno?: number }
type MasterProgram = { code: string; name: string; time: string; examType: string; fees: MasterFees }
type Institute = { id: string; abbr: string; name: string; color: string; specialties: Specialty[]; masters: MasterProgram[] }

const MILESTONES = [
  { date: '20 июня',    label: 'Начало приёма документов' },
  { date: '14–19 июля', label: 'Вступительные испытания (I этап, бюджет)' },
  { date: '20 июля',    label: 'Последний день приёма с испытаниями' },
  { date: '25 июля',    label: 'Последний день приёма без испытаний' },
  { date: '27 июля',    label: 'Публикация конкурсных списков' },
  { date: '1 авг',      label: 'Приоритетный этап: согласие (до 12:00)' },
  { date: '3 авг',      label: 'Приоритетный этап: приказы о зачислении' },
  { date: '5 авг',      label: 'Основной этап: согласие (до 12:00)' },
  { date: '7 авг',      label: 'Основной этап: приказы о зачислении' },
  { date: '21 авг',     label: 'Вступительные испытания магистратуры (бюджет)' },
  { date: '25 авг',     label: 'Зачисление в магистратуру: согласие (до 12:00)' },
]

const INSTITUTES: Institute[] = [
  {
    id: 'isaid', abbr: 'ИСАиД', color: '#e67e22',
    name: 'Институт строительства, архитектуры и дизайна',
    specialties: [
      { code: '07.03.01', name: 'Архитектура', exams: [
        { date: '14.07', subject: 'Тв. испытание — рисунок архитектурный', time: '09:00' },
        { date: '15.07', subject: 'Тв. испытание — рисунок', time: '09:00' },
        { date: '17.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
      { code: '05.03.03', name: 'Картография и геоинформатика', exams: [
        { date: '17.07', subject: 'Математика', time: '09:00' },
        { date: '18.07', subject: 'Биология / География / Информатика / Физика', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
      { code: '08.03.01', name: 'Строительство', exams: [
        { date: '17.07', subject: 'Математика', time: '09:00' },
        { date: '18.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
      { code: '08.05.01', name: 'Строительство уникальных зданий и сооружений', exams: [
        { date: '17.07', subject: 'Математика', time: '09:00' },
        { date: '18.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
      { code: '21.03.02', name: 'Землеустройство и кадастры', exams: [
        { date: '17.07', subject: 'Математика', time: '09:00' },
        { date: '18.07', subject: 'География / Информатика / Физика / Химия', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
      { code: '21.05.01', name: 'Прикладная геодезия', exams: [
        { date: '17.07', subject: 'Математика', time: '09:00' },
        { date: '18.07', subject: 'География / Информатика / Физика / Химия', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
    ],
    masters: [
      { code: '07.04.01', name: 'Архитектура',                   time: '09:00', examType: 'профессиональное испытание', fees: { ochno: 148607, ochnoZaochno: 44517 } },
      { code: '08.04.01', name: 'Строительство',                  time: '14:00', examType: 'письменный экзамен',         fees: { ochno: 148607, ochnoZaochno: 61211, zaochno: 38952 } },
      { code: '21.04.02', name: 'Землеустройство и кадастры',     time: '14:00', examType: 'письменный экзамен',         fees: { ochno: 175476, ochnoZaochno: 44517, zaochno: 33388 } },
    ],
  },
  {
    id: 'ipit', abbr: 'ИПИТ', color: '#2980b9',
    name: 'Институт прикладных информационных технологий',
    specialties: [
      { code: '09.03.01', name: 'Информатика и вычислительная техника', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'Информатика / Физика', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
      { code: '09.03.02', name: 'Информационные системы и технологии', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'Информатика / Физика', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
      { code: '09.03.04', name: 'Программная инженерия', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'Информатика / Физика', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
      { code: '10.03.01', name: 'Информационная безопасность', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'Информатика / Физика', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
      { code: '11.03.02', name: 'Инфокоммуникационные технологии и системы связи', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'Информатика / Физика', time: '14:00' },
        { date: '19.07', subject: 'Русский язык', time: '09:00' },
      ]},
    ],
    masters: [
      { code: '09.04.02', name: 'Информационные системы и технологии', time: '14:00', examType: 'письменный экзамен', fees: { ochno: 148607, zaochno: 38952 } },
      { code: '44.04.01', name: 'Педагогическое образование',          time: '14:00', examType: 'письменный экзамен', fees: { ochno: 132244, ochnoZaochno: 44517, zaochno: 44517 } },
    ],
  },
  {
    id: 'icetp', abbr: 'ИЦЭиТП', color: '#8e44ad',
    name: 'Институт цифровой экономики и технологического предпринимательства',
    specialties: [
      { code: '09.03.03', name: 'Прикладная информатика', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'Информатика / Физика', time: '09:00' },
        { date: '18.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '38.03.01', name: 'Экономика', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'География / Информатика / История / Обществознание', time: '09:00' },
        { date: '18.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '38.03.02', name: 'Менеджмент', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'Информатика / История / Обществознание', time: '09:00' },
        { date: '18.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '38.03.04', name: 'Государственное и муниципальное управление', exams: [
        { date: '16.07', subject: 'Обществознание', time: '14:00' },
        { date: '17.07', subject: 'История / Математика', time: '09:00' },
        { date: '18.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '38.03.05', name: 'Бизнес-информатика', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'Информатика / История / Обществознание', time: '09:00' },
        { date: '18.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '38.05.01', name: 'Экономическая безопасность', exams: [
        { date: '16.07', subject: 'Математика', time: '09:00' },
        { date: '17.07', subject: 'Информатика / История / Обществознание', time: '09:00' },
        { date: '18.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '38.05.02', name: 'Таможенное дело', exams: [
        { date: '15.07', subject: 'Профессиональное испытание', time: '14:00' },
        { date: '17.07', subject: 'Обществознание', time: '09:00' },
        { date: '18.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '40.03.01', name: 'Юриспруденция', exams: [
        { date: '16.07', subject: 'Обществознание', time: '14:00' },
        { date: '17.07', subject: 'История / Информатика / Математика', time: '09:00' },
        { date: '18.07', subject: 'Русский язык', time: '14:00' },
      ]},
    ],
    masters: [
      { code: '38.04.01', name: 'Экономика',                                     time: '09:00', examType: 'письменный экзамен', fees: { ochno: 132244, zaochno: 50082 } },
      { code: '38.04.02', name: 'Менеджмент',                                    time: '09:00', examType: 'письменный экзамен', fees: { ochno: 132244, zaochno: 44517 } },
      { code: '38.04.04', name: 'Государственное и муниципальное управление',    time: '09:00', examType: 'письменный экзамен', fees: { ochno: 132244, ochnoZaochno: 66776, zaochno: 50082 } },
      { code: '38.04.05', name: 'Бизнес-информатика',                            time: '09:00', examType: 'письменный экзамен', fees: { ochno: 132244, ochnoZaochno: 66776, zaochno: 44517 } },
      { code: '40.04.01', name: 'Юриспруденция',                                 time: '09:00', examType: 'письменный экзамен', fees: { ochno: 132244, ochnoZaochno: 66776, zaochno: 66776 } },
    ],
  },
  {
    id: 'ing', abbr: 'ИНиГ', color: '#27ae60',
    name: 'Институт нефти и газа',
    specialties: [
      { code: '21.03.01', name: 'Нефтегазовое дело', exams: [
        { date: '16.07', subject: 'География / Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '21.05.06', name: 'Нефтегазовые техника и технологии', exams: [
        { date: '16.07', subject: 'География / Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '21.05.02', name: 'Прикладная геология', exams: [
        { date: '16.07', subject: 'География / Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '21.05.03', name: 'Технологии геологической разведки', exams: [
        { date: '16.07', subject: 'География / Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '15.03.02', name: 'Технологические машины и оборудование', exams: [
        { date: '16.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '20.03.01', name: 'Техносферная безопасность', exams: [
        { date: '16.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '05.03.06', name: 'Экология и природопользование', exams: [
        { date: '16.07', subject: 'География / Информатика / Математика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Биология', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '19.03.02', name: 'Продукты питания из растительного сырья', exams: [
        { date: '16.07', subject: 'Математика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Биология', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '35.03.10', name: 'Ландшафтная архитектура', exams: [
        { date: '16.07', subject: 'Биология / География / Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
    ],
    masters: [
      { code: '05.04.06', name: 'Экология и природопользование', time: '14:00', examType: 'письменный экзамен', fees: { ochno: 148607, ochnoZaochno: 44517, zaochno: 38952 } },
      { code: '18.04.01', name: 'Химическая технология',         time: '14:00', examType: 'письменный экзамен', fees: { ochno: 148607, ochnoZaochno: 44517 } },
      { code: '21.04.01', name: 'Нефтегазовое дело',             time: '14:00', examType: 'письменный экзамен', fees: { ochno: 175476, ochnoZaochno: 55646 } },
    ],
  },
  {
    id: 'ie', abbr: 'ИЭ', color: '#c0392b',
    name: 'Институт энергетики',
    specialties: [
      { code: '13.03.01', name: 'Теплоэнергетика и теплотехника', exams: [
        { date: '16.07', subject: 'Математика / Информатика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Физика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '13.03.02', name: 'Электроэнергетика и электротехника', exams: [
        { date: '16.07', subject: 'Математика / Информатика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Физика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '15.03.04', name: 'Автоматизация технологических процессов и производств', exams: [
        { date: '16.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '15.03.05', name: 'Конструкторско-технологическое обеспечение машиностроительных производств', exams: [
        { date: '16.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '23.03.01', name: 'Технология транспортных процессов', exams: [
        { date: '16.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '23.03.03', name: 'Эксплуатация транспортно-технологических машин и комплексов', exams: [
        { date: '16.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '23.05.01', name: 'Наземные транспортно-технологические средства', exams: [
        { date: '16.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
      { code: '27.03.04', name: 'Управление в технических системах', exams: [
        { date: '16.07', subject: 'Информатика / Физика / Химия', time: '14:00' },
        { date: '18.07', subject: 'Математика', time: '09:00' },
        { date: '19.07', subject: 'Русский язык', time: '14:00' },
      ]},
    ],
    masters: [
      { code: '13.04.01', name: 'Теплоэнергетика и теплотехника',                          time: '14:00', examType: 'письменный экзамен', fees: { ochno: 148607, ochnoZaochno: 44517, zaochno: 33388 } },
      { code: '13.04.02', name: 'Электроэнергетика и электротехника',                       time: '14:00', examType: 'письменный экзамен', fees: { ochno: 148607, ochnoZaochno: 44517, zaochno: 33388 } },
      { code: '15.04.04', name: 'Автоматизация технологических процессов и производств',    time: '14:00', examType: 'письменный экзамен', fees: { ochno: 148607, ochnoZaochno: 44517, zaochno: 33388 } },
      { code: '27.04.05', name: 'Инноватика',                                               time: '14:00', examType: 'письменный экзамен', fees: { ochno: 148607, ochnoZaochno: 44517, zaochno: 33388 } },
    ],
  },
]

const DAYS = [
  { d: '14.07', label: '14 июля', note: 'пн' },
  { d: '15.07', label: '15 июля', note: 'вт' },
  { d: '16.07', label: '16 июля', note: 'ср · резерв (тв.)' },
  { d: '17.07', label: '17 июля', note: 'чт' },
  { d: '18.07', label: '18 июля', note: 'пт' },
  { d: '19.07', label: '19 июля', note: 'сб' },
]

function subjectColor(subject: string) {
  if (subject.includes('Математика')) return '#2c7be5'
  if (subject.includes('Русский')) return '#e55a2b'
  if (subject.includes('Физика')) return '#00b4d8'
  if (subject.includes('Химия')) return '#52b788'
  if (subject.includes('Информатика')) return '#7b61ff'
  if (subject.includes('Биология')) return '#2dc653'
  if (subject.includes('География')) return '#f4a261'
  if (subject.includes('История') || subject.includes('Обществознание')) return '#e9c46a'
  if (subject.includes('Тв.') || subject.includes('Профессиональное')) return '#e76f51'
  return '#999'
}

export default function Exams() {
  useReveal()
  const [activeInst, setActiveInst] = useState<string | null>(null)

  return (
    <main className="page">
      {/* ── Hero ── */}
      <section className="exams-hero">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 18 }}>№ 07 / Вступительные испытания</div>
          <h1 className="h-1">
            Расписание<br />вступительных<br /><em>испытаний 2026.</em>
          </h1>
          <p className="lead muted" style={{ marginTop: 24, maxWidth: 560 }}>
            Бакалавриат и специалитет — очная, очно-заочная, заочная формы.
            Бюджетные места, I этап. На базе среднего общего образования.
          </p>
          <div className="exams-meta r">
            <div className="exams-meta__item">
              <span className="exams-meta__icon">📍</span>
              <span>г. Грозный, проспект им. Х.А. Исаева, 100</span>
            </div>
            <div className="exams-meta__item">
              <span className="exams-meta__icon">🕐</span>
              <span>Начало испытаний в 9:00 и 14:00</span>
            </div>
            <div className="exams-meta__item">
              <span className="exams-meta__icon">🪪</span>
              <span>При себе: паспорт + расписка о приёме документов</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="wrap exams-timeline-section r">
        <div className="eyebrow" style={{ marginBottom: 20 }}>Ключевые даты</div>
        <div className="exams-timeline">
          {MILESTONES.map((m, i) => (
            <div key={i} className="exams-tl-item">
              <div className="exams-tl-item__date">{m.date}</div>
              <div className="exams-tl-item__dot" />
              <div className="exams-tl-item__label">{m.label}</div>
            </div>
          ))}
        </div>
        <p className="exams-note">
          * 16 июля — резервный день для творческих и профессиональных испытаний (09:00).<br />
          * 20 июля — резервный день для общеобразовательных испытаний (09:00).
        </p>
      </section>

      {/* ── Calendar grid ── */}
      <section className="wrap exams-cal-section r">
        <div className="eyebrow" style={{ marginBottom: 20 }}>Календарь испытаний</div>
        <div className="exams-cal">
          {DAYS.map(day => {
            const events: { inst: Institute; spec: Specialty; exam: ExamEntry }[] = []
            INSTITUTES.forEach(inst => {
              inst.specialties.forEach(spec => {
                spec.exams.forEach(exam => {
                  if (exam.date === day.d) events.push({ inst, spec, exam })
                })
              })
            })
            const byTime: Record<string, typeof events> = {}
            events.forEach(e => {
              if (!byTime[e.exam.time]) byTime[e.exam.time] = []
              byTime[e.exam.time].push(e)
            })
            return (
              <div key={day.d} className={`exams-day${events.length === 0 ? ' exams-day--empty' : ''}`}>
                <div className="exams-day__head">
                  <div className="exams-day__date">{day.label}</div>
                  <div className="exams-day__note">{day.note}</div>
                </div>
                {events.length === 0
                  ? <p className="exams-day__empty">Нет испытаний</p>
                  : Object.entries(byTime).sort().map(([time, evts]) => {
                    const bySubject: Record<string, { inst: Institute; specs: string[] }[]> = {}
                    evts.forEach(e => {
                      if (!bySubject[e.exam.subject]) bySubject[e.exam.subject] = []
                      let entry = bySubject[e.exam.subject].find(x => x.inst.id === e.inst.id)
                      if (!entry) {
                        entry = { inst: e.inst, specs: [] }
                        bySubject[e.exam.subject].push(entry)
                      }
                      entry.specs.push(e.spec.code)
                    })
                    return (
                      <div key={time} className="exams-day__slot">
                        <div className="exams-day__time">{time}</div>
                        {Object.entries(bySubject).map(([subject, entries]) => (
                          <div key={subject} className="exams-day__event">
                            <div
                              className="exams-day__subj"
                              style={{ borderLeftColor: subjectColor(subject) }}
                            >
                              {subject}
                            </div>
                            <div className="exams-day__badges">
                              {entries.map(e => (
                                <span
                                  key={e.inst.id}
                                  className="exams-badge"
                                  style={{ background: e.inst.color + '1a', color: e.inst.color, borderColor: e.inst.color + '33' }}
                                >
                                  {e.inst.abbr}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })
                }
              </div>
            )
          })}
        </div>
      </section>

      {/* ── By institute ── */}
      <section className="wrap exams-inst-section r">
        <div className="eyebrow" style={{ marginBottom: 20 }}>По направлениям и институтам</div>
        <div className="exams-inst-tabs">
          {INSTITUTES.map(inst => (
            <button
              key={inst.id}
              className={`exams-inst-tab${activeInst === inst.id ? ' is-active' : ''}`}
              style={activeInst === inst.id ? { background: inst.color, borderColor: inst.color, color: '#fff' } : { borderColor: inst.color + '55', color: inst.color }}
              onClick={() => setActiveInst(activeInst === inst.id ? null : inst.id)}
            >
              {inst.abbr}
            </button>
          ))}
        </div>

        {INSTITUTES.filter(inst => activeInst === null || inst.id === activeInst).map(inst => (
          <div key={inst.id} className="exams-inst-block r">
            <div className="exams-inst-block__head" style={{ borderLeftColor: inst.color }}>
              <div className="exams-inst-block__abbr" style={{ color: inst.color }}>{inst.abbr}</div>
              <div className="exams-inst-block__name">{inst.name}</div>
            </div>
            <div className="exams-inst-table-wrap">
              <table className="exams-inst-table">
                <thead>
                  <tr>
                    <th>Код</th>
                    <th>Направление подготовки</th>
                    <th>14.07</th>
                    <th>15.07</th>
                    <th>16.07</th>
                    <th>17.07</th>
                    <th>18.07</th>
                    <th>19.07</th>
                  </tr>
                </thead>
                <tbody>
                  {inst.specialties.map(spec => (
                    <tr key={spec.code}>
                      <td className="exams-inst-table__code">{spec.code}</td>
                      <td className="exams-inst-table__name">{spec.name}</td>
                      {['14.07','15.07','16.07','17.07','18.07','19.07'].map(d => {
                        const exam = spec.exams.find(e => e.date === d)
                        return (
                          <td key={d} className="exams-inst-table__cell">
                            {exam ? (
                              <div className="exams-cell">
                                <div
                                  className="exams-cell__subj"
                                  style={{ color: subjectColor(exam.subject) }}
                                >
                                  {exam.subject}
                                </div>
                                <div className="exams-cell__time">{exam.time}</div>
                              </div>
                            ) : null}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Masters section */}
            {inst.masters.length > 0 && (
              <div className="exams-masters-wrap">
                <div className="exams-masters-head">
                  <span className="exams-masters-label">Магистратура</span>
                  <span className="exams-masters-date">21 августа 2026 · резерв 22 августа</span>
                </div>
                <div className="exams-inst-table-wrap">
                  <table className="exams-inst-table">
                    <thead>
                      <tr>
                        <th>Код</th>
                        <th>Направление подготовки</th>
                        <th>Время</th>
                        <th>Форма испытания</th>
                        <th>Очно, ₽/год</th>
                        <th>Очно-заочно, ₽/год</th>
                        <th>Заочно, ₽/год</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inst.masters.map(m => (
                        <tr key={m.code}>
                          <td className="exams-inst-table__code">{m.code}</td>
                          <td className="exams-inst-table__name">{m.name}</td>
                          <td style={{ fontFamily: 'var(--mono)', fontSize: 12, whiteSpace: 'nowrap' }}>{m.time}</td>
                          <td style={{ fontSize: 13, color: 'var(--muted)' }}>{m.examType}</td>
                          <td className="exams-fee-cell">{m.fees.ochno?.toLocaleString('ru-RU') ?? '—'}</td>
                          <td className="exams-fee-cell">{m.fees.ochnoZaochno?.toLocaleString('ru-RU') ?? '—'}</td>
                          <td className="exams-fee-cell">{m.fees.zaochno?.toLocaleString('ru-RU') ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <div style={{ height: 80 }} />
    </main>
  )
}
