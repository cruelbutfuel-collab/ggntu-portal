import type { Metadata } from 'next'
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import CookieBanner from '@/components/CookieBanner'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
})

const SITE_URL = 'https://ggntu-portal-production.up.railway.app'

export const metadata: Metadata = {
  title: 'ГГНТУ — Портал абитуриента · Алия',
  description: 'Виртуальный ассистент Алия помогает выбрать направление, разобраться с документами и поступить в ГГНТУ. 43 программы ВО + 33 СПО.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'ГГНТУ — Портал абитуриента',
    description: 'Спроси Алию — ИИ-ассистент ответит на любой вопрос о поступлении 24/7',
    url: SITE_URL,
    siteName: 'Портал абитуриента ГГНТУ',
    images: [{ url: 'https://ggntu-portal-production.up.railway.app/opengraph-image', width: 1200, height: 630, alt: 'ГГНТУ Портал абитуриента' }],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ГГНТУ — Портал абитуриента · Алия',
    description: 'ИИ-ассистент Алия отвечает на вопросы абитуриентов 24/7',
    images: ['https://ggntu-portal-production.up.railway.app/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${fraunces.variable} ${geist.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div className="shell">
          <TopBar />
          <Header />
          {children}
          <Footer />
        </div>
        <Cursor />
        <CookieBanner />
      </body>
    </html>
  )
}
