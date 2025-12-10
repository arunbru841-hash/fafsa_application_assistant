import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-cal-sans',
  weight: ['600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FAFSA Assistant Pro - Complete Your FAFSA with Confidence',
  description: 'Professional FAFSA application assistance system. Get expert guidance, real-time validation, and maximize your financial aid opportunities.',
  keywords: 'FAFSA, financial aid, student aid, college funding, federal student aid, student loans, grants',
  authors: [{ name: 'FAFSA Assistant Team' }],
  creator: 'FAFSA Assistant Pro',
  publisher: 'FAFSA Assistant Pro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fafsa-assistant.com',
    title: 'FAFSA Assistant Pro',
    description: 'Complete your FAFSA with confidence. Expert guidance at every step.',
    siteName: 'FAFSA Assistant Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAFSA Assistant Pro',
    description: 'Complete your FAFSA with confidence',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
