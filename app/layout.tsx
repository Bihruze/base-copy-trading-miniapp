import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Copy Trading Pro',
  description: 'Follow the best traders and earn profits automatically',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="fc:miniapp" content='{
          "version":"next",
          "imageUrl":"https://copy-trading-miniapp.vercel.app/embed-image.png",
          "button":{
              "title":"Start Copy Trading",
              "action":{
              "type":"launch_miniapp",
              "name":"Copy Trading Pro",
              "url":"https://copy-trading-miniapp.vercel.app"
              }
          }
        }' />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
