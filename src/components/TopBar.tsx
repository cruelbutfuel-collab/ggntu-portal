const ITEMS = [
  { l: 'Приёмная кампания', v: '2026/27' },
  { l: 'Старт приёма', v: '20 июня' },
  { l: 'ИИ-ассистент', v: 'Алия онлайн' },
  { l: 'Институтов', v: '5 + колледж' },
  { l: 'Программ ВО', v: '60+' },
  { l: 'Программ СПО', v: '33' },
  { l: 'Бюджет', v: 'на большинстве направлений' },
  { l: 'Контакт', v: '+7 929 003 66 66' },
]

export default function TopBar() {
  const set = [...ITEMS, ...ITEMS]
  return (
    <div className="topbar">
      <div className="ticker">
        {set.map((it, i) => (
          <span key={i} className="ticker__item">
            <i className="ticker__dot" />
            {it.l} — <b>{it.v}</b>
          </span>
        ))}
      </div>
    </div>
  )
}
