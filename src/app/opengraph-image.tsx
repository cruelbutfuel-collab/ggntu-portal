import { ImageResponse } from 'next/og'

export const alt = 'ГГНТУ Портал абитуриента'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#141416',
          padding: '80px 96px',
          justifyContent: 'space-between',
        }}
      >
        {/* top: eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 32, height: 2, background: '#C8102E' }} />
          <span style={{ color: '#6B6A66', fontFamily: 'sans-serif', fontSize: 18, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Портал абитуриента · 2026/27
          </span>
        </div>

        {/* center: main text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: '#F4F2EE', fontFamily: 'serif', fontSize: 80, fontWeight: 500, lineHeight: 1.0, letterSpacing: '-0.03em' }}>
            ГГНТУ
          </div>
          <div style={{ color: '#C8102E', fontFamily: 'serif', fontSize: 56, fontStyle: 'italic', lineHeight: 1.1 }}>
            Алия отвечает
          </div>
          <div style={{ color: 'rgba(244,242,238,0.55)', fontFamily: 'sans-serif', fontSize: 24, lineHeight: 1.5, maxWidth: 700 }}>
            ИИ-ассистент приёмной комиссии — 60+ программ ВО, 33 СПО, ответы на вопросы 24/7
          </div>
        </div>

        {/* bottom: url + stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ color: '#6B6A66', fontFamily: 'sans-serif', fontSize: 18, letterSpacing: '0.06em' }}>
            ggntu-portal-production.up.railway.app
          </span>
          <div style={{ display: 'flex', gap: 48 }}>
            {[['60+', 'программ ВО'], ['33', 'программы СПО'], ['1920', 'год основания']].map(([n, l]) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: '#C8102E', fontFamily: 'serif', fontSize: 36, lineHeight: 1 }}>{n}</span>
                <span style={{ color: '#6B6A66', fontFamily: 'sans-serif', fontSize: 13, marginTop: 4 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
