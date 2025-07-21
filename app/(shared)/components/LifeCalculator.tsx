"use client"

import { Calendar, Clock, Heart, Users } from "lucide-react"
import { useMemo, useState } from "react"

interface LifeEvent {
  name: string
  frequency: number // 年間の回数
  icon: React.ReactNode
  remainingCount?: number
}

export function LifeCalculator() {
  const currentYear = new Date().getFullYear()
  const [birthYear, setBirthYear] = useState<string>("")
  const lifeExpectancy = 85

  const calculations = useMemo(() => {
    if (!birthYear || parseInt(birthYear) < 1900 || parseInt(birthYear) > currentYear) {
      return null
    }

    const birthYearNum = parseInt(birthYear)
    const currentAge = currentYear - birthYearNum
    const remainingYears = Math.max(0, lifeExpectancy - currentAge)
    const remainingDays = remainingYears * 365
    const remainingWeeks = remainingYears * 52
    const remainingMonths = remainingYears * 12

    // 代表的なライフイベントの残り回数
    const lifeEvents: LifeEvent[] = [
      {
        name: "桜を見る",
        frequency: 1,
        icon: <span className="text-pink-500">🌸</span>,
        remainingCount: remainingYears,
      },
      {
        name: "誕生日を祝う",
        frequency: 1,
        icon: <span className="text-yellow-500">🎂</span>,
        remainingCount: remainingYears,
      },
      {
        name: "正月を迎える",
        frequency: 1,
        icon: <span className="text-red-500">🎍</span>,
        remainingCount: remainingYears,
      },
      {
        name: "親と過ごす時間",
        frequency: 12, // 月1回と仮定
        icon: <Users className="w-4 h-4 text-blue-500" />,
        remainingCount: currentAge < 50 ? Math.round(remainingYears * 0.4 * 12) : 0, // 親の寿命を考慮
      },
    ]

    return {
      currentAge,
      remainingYears,
      remainingDays,
      remainingWeeks,
      remainingMonths,
      lifeEvents,
    }
  }, [birthYear, currentYear])

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">あなたの残り時間を知る</h2>

      <div className="mb-8">
        <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-2">
          生まれ年を入力してください
        </label>
        <input
          id="birthYear"
          type="number"
          min="1900"
          max={currentYear}
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          placeholder="例: 1990"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {calculations && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600">
              現在{" "}
              <span className="font-bold text-2xl text-gray-900">{calculations.currentAge}</span> 歳
            </p>
            <p className="text-sm text-gray-500 mt-1">（平均寿命を{lifeExpectancy}歳として計算）</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">
                {calculations.remainingYears.toLocaleString()}
              </p>
              <p className="text-sm text-blue-700">年</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">
                {calculations.remainingMonths.toLocaleString()}
              </p>
              <p className="text-sm text-green-700">ヶ月</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Heart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">
                {calculations.remainingWeeks.toLocaleString()}
              </p>
              <p className="text-sm text-purple-700">週</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <span className="text-2xl mb-2 block">☀️</span>
              <p className="text-2xl font-bold text-orange-900">
                {calculations.remainingDays.toLocaleString()}
              </p>
              <p className="text-sm text-orange-700">日</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">人生の残り回数</h3>
            <div className="space-y-3">
              {calculations.lifeEvents.map((event) => (
                <div key={event.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {event.icon}
                    <span className="text-gray-700">{event.name}</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">
                    あと約 {event.remainingCount?.toLocaleString() || "0"} 回
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-800">
              限られた時間だからこそ、一つ一つの経験が特別な意味を持ちます。
              <br />
              今この瞬間を大切に生きましょう。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
