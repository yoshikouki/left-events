import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { BarChart3, BookOpen, Home } from "lucide-react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Left Events - 人生の経験を記録し、振り返る",
  description:
    "経験の価値と有限性に気づき、これからの限られた経験機会を主体的に選択・共有できるアプリケーション",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="text-xl font-bold text-gray-900">
                    Left Events
                  </a>
                </div>
                <div className="ml-6 flex space-x-8">
                  <a
                    href="/"
                    className="inline-flex items-center gap-1 px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                    <Home className="w-4 h-4" />
                    ホーム
                  </a>
                  <a
                    href="/experiences"
                    className="inline-flex items-center gap-1 px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                    <BookOpen className="w-4 h-4" />
                    経験の記録
                  </a>
                  <a
                    href="/visualization"
                    className="inline-flex items-center gap-1 px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                    <BarChart3 className="w-4 h-4" />
                    可視化
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
