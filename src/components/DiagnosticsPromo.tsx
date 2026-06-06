import Link from 'next/link'
import { Arrow } from '@/components/icons'

const STEPS = ['Тип личности', 'Интересы', 'Склонности', 'Ценности']

export default function DiagnosticsPromo() {
  return (
    <section className="section diag-promo">
      <div className="wrap">
        <div className="diag-promo__inner">

          <div className="diag-promo__text r">
            <div className="section__num"><b>02.5</b>Диагностика профиля</div>
            <h2 className="h-1">
              Не знаешь куда<br />поступать?{' '}
              <em>Пройди<br />диагностику.</em>
            </h2>
            <p className="lead muted" style={{ marginTop: 24 }}>
              Тест по методике Holland Codes помогает понять, какие направления
              подходят по интересам и склонностям. Занимает 3–5 минут — без
              регистрации.
            </p>
            <div style={{ marginTop: 36 }}>
              <Link href="/diagnostics" className="btn">
                Пройти тест <span className="btn__arr"><Arrow /></span>
              </Link>
            </div>
          </div>

          <div className="diag-promo__visual">
            <div className="dp-card r-stagger">
              <div className="dp-card__eyebrow">Holland Codes · профиль типа</div>
              <div className="dp-steps">
                {STEPS.map((label, i) => (
                  <div key={i} className="dp-step">
                    <span className="dp-step__n">0{i + 1}</span>
                    <div className="dp-step__track">
                      <div className={`dp-step__fill dp-fill-${i}`} />
                    </div>
                    <span className="dp-step__lbl">{label}</span>
                  </div>
                ))}
              </div>
              <div className="dp-card__result">
                <span className="dp-card__tag">Исследователь</span>
                <span className="dp-card__hint">подходит 7 направлений ГГНТУ</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
