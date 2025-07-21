"use client"

import { Calendar, Clock, Heart, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { useEvents, usePersonEvents, usePersons } from "@/app/(shared)/hooks/useStorage"

export function LifeCalculator() {
  const { persons } = usePersons()
  const { events } = useEvents()
  const { personEvents } = usePersonEvents()

  const currentYear = new Date().getFullYear()
  const lifeExpectancy = 85
  const healthyLifeExpectancy = 72

  // 自分のデータを取得
  const self = persons.find((p) => p.relation === "self")

  // 自分に関連する予定を取得
  const myEvents = useMemo(() => {
    if (!self) return []

    return personEvents
      .filter((pe) => pe.personId === self.id)
      .map((pe) => {
        const event = events.find((e) => e.id === pe.eventId)
        if (!event) return null

        const age = currentYear - self.birthYear
        const untilAge = pe.untilAge || lifeExpectancy
        const yearsRemaining = Math.max(0, untilAge - age)
        const effectiveYears = Math.min(yearsRemaining, Math.max(0, healthyLifeExpectancy - age))
        const remainingCount = Math.round(event.frequency * effectiveYears)

        return {
          event,
          personEvent: pe,
          remainingCount,
          yearsRemaining: effectiveYears,
        }
      })
      .filter(Boolean)
      .sort((a, b) => (a?.remainingCount ?? 0) - (b?.remainingCount ?? 0))
  }, [self, personEvents, events, currentYear])

  const calculations = useMemo(() => {
    if (!self) return null

    const currentAge = currentYear - self.birthYear
    const remainingYears = Math.max(0, lifeExpectancy - currentAge)
    const healthyRemainingYears = Math.max(0, healthyLifeExpectancy - currentAge)
    const remainingDays = remainingYears * 365
    const remainingWeeks = remainingYears * 52
    const remainingMonths = remainingYears * 12

    return {
      currentAge,
      remainingYears,
      healthyRemainingYears,
      remainingDays,
      remainingWeeks,
      remainingMonths,
    }
  }, [self, currentYear])

  if (!self) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">残り時間</h2>
        <div className="text-center space-y-4">
          <p className="text-gray-600">まず設定で自分の情報を登録してください</p>
          <Link
            href="/settings"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Settings className="w-5 h-5 mr-2" />
            設定へ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">残り時間</h2>

      {calculations && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600">
              {self.name ? `${self.name}さん、` : ""}現在{" "}
              <span className="font-bold text-2xl text-gray-900">{calculations.currentAge}</span> 歳
            </p>
            <p className="text-sm text-gray-500 mt-1">
              平均{lifeExpectancy}歳 / 健康{healthyLifeExpectancy}歳
            </p>
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

          {myEvents.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">あなたの予定</h3>
              <div className="space-y-3">
                {myEvents.slice(0, 5).map((item) => (
                  <div key={item?.personEvent.id} className="flex items-center justify-between">
                    <span className="text-gray-700">{item?.event.name}</span>
                    <span
                      className={`font-bold text-lg ${
                        (item?.remainingCount ?? 0) < 100 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      あと約 {(item?.remainingCount ?? 0).toLocaleString()} 回
                    </span>
                  </div>
                ))}
              </div>
              {myEvents.length > 5 && (
                <Link
                  href="/life-simulation"
                  className="text-blue-600 hover:text-blue-700 text-sm mt-3 inline-block"
                >
                  すべて見る →
                </Link>
              )}
            </div>
          )}

          <div className="border-t pt-6 space-y-3">
            <Link
              href="/settings"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Settings className="w-5 h-5" />
              人と予定を管理
            </Link>
            <Link
              href="/life-simulation"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              詳細なシミュレーション
            </Link>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-800">今を大切に</p>
          </div>
        </div>
      )}
    </div>
  )
}
