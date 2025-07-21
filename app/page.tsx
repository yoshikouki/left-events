import { ArrowRight, BarChart3, BookOpen, Clock } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            人生の経験を、
            <br />
            かけがえのない物語に
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            経験の価値と有限性に気づき、これからの限られた機会を主体的に選択・共有できるアプリケーション
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/experiences"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              経験を記録する
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button
              type="button"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              使い方を見る
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Left Eventsでできること
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">経験を記録</h3>
            <p className="text-gray-600">写真・感情・一緒にいた人など、大切な瞬間の詳細を記録</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">経験を可視化</h3>
            <p className="text-gray-600">カテゴリ別の分析で、人生のバランスを確認</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">残り回数を知る</h3>
            <p className="text-gray-600">「あと何回」という視点で、経験の価値を再認識</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 rounded-2xl mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">今を大切に、未来を豊かに</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            人生は有限です。でも、それは恐れるものではありません。
            限られた時間だからこそ、一つ一つの経験が輝きを持ちます。
          </p>
          <Link
            href="/experiences"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            今すぐ始める
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
