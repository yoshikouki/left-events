"use client"

import { AlertTriangle, Calendar, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import type { LifeEvent } from "@/app/(shared)/types"
import { LifeEventCard } from "./components/LifeEventCard"
import { LifeEventForm } from "./components/LifeEventForm"

// デモデータ
const initialEvents: LifeEvent[] = [
  {
    id: "1",
    userId: "user-1",
    title: "親と一緒に旅行する",
    description: "両親が元気なうちに一緒に旅行を楽しむ",
    averageFrequency: 1,
    lastOccurrence: new Date("2023-08-15"),
    importance: "high",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user-1",
    title: "子どもの運動会を見る",
    description: "子どもの成長を見守る大切な機会",
    averageFrequency: 1,
    importance: "high",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    userId: "user-1",
    title: "親友と会う",
    description: "昔からの親友と定期的に会って話す",
    averageFrequency: 4,
    lastOccurrence: new Date("2024-01-10"),
    importance: "medium",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function LifeSimulationPage() {
  const [birthYear, setBirthYear] = useState<string>("")
  const [events, setEvents] = useState<LifeEvent[]>(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null)

  const currentYear = new Date().getFullYear()
  const lifeExpectancy = 85

  const remainingCounts = useMemo(() => {
    if (!birthYear || parseInt(birthYear) < 1900 || parseInt(birthYear) > currentYear) {
      return {}
    }

    const birthYearNum = parseInt(birthYear)
    const currentAge = currentYear - birthYearNum
    const remainingYears = Math.max(0, lifeExpectancy - currentAge)

    const counts: Record<string, number> = {}
    events.forEach((event) => {
      // 特殊なケースの処理
      if (event.title.includes("子ども") && currentAge > 60) {
        counts[event.id] = 0 // 子ども関連のイベントは年齢によって0になる
      } else if (event.title.includes("親") && currentAge > 50) {
        // 親関連のイベントは親の寿命を考慮
        const parentRemainingYears = Math.max(0, 20 - (currentAge - 50))
        counts[event.id] = Math.round(event.averageFrequency * parentRemainingYears)
      } else {
        counts[event.id] = Math.round(event.averageFrequency * remainingYears)
      }
    })

    return counts
  }, [birthYear, events, currentYear])

  const handleCreateEvent = (data: Partial<LifeEvent>) => {
    const newEvent: LifeEvent = {
      ...data,
      id: Date.now().toString(),
      userId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as LifeEvent

    setEvents([...events, newEvent])
    setShowForm(false)
  }

  const handleUpdateEvent = (data: Partial<LifeEvent>) => {
    if (!editingEvent) return

    setEvents(
      events.map((event) =>
        event.id === editingEvent.id ? { ...event, ...data, updatedAt: new Date() } : event,
      ),
    )
    setEditingEvent(null)
  }

  const handleDeleteEvent = (id: string) => {
    if (confirm("このライフイベントを削除しますか？")) {
      setEvents(events.filter((event) => event.id !== id))
    }
  }

  const sortedEvents = [...events].sort((a, b) => {
    const aCount = remainingCounts[a.id] || 0
    const bCount = remainingCounts[b.id] || 0
    if (aCount === bCount) {
      const importanceOrder = { high: 0, medium: 1, low: 2 }
      return importanceOrder[a.importance] - importanceOrder[b.importance]
    }
    return aCount - bCount
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">残り経験回数シミュレーション</h1>
          <p className="text-gray-600">
            人生で大切なイベントがあと何回できるか計算して、優先順位を考えましょう
          </p>
        </div>

        {/* 生まれ年入力 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <label htmlFor="birthYearSim" className="block text-sm font-medium text-gray-700 mb-2">
            生まれ年を入力してください
          </label>
          <div className="flex gap-4">
            <input
              id="birthYearSim"
              type="number"
              min="1900"
              max={currentYear}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="例: 1990"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>平均寿命: {lifeExpectancy}歳</span>
            </div>
          </div>
        </div>

        {/* 新規作成ボタン */}
        {!showForm && !editingEvent && birthYear && (
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              ライフイベントを追加
            </button>
          </div>
        )}

        {/* フォーム */}
        {(showForm || editingEvent) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingEvent ? "ライフイベントを編集" : "新しいライフイベント"}
            </h2>
            <LifeEventForm
              initialData={editingEvent || undefined}
              onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
              onCancel={() => {
                setShowForm(false)
                setEditingEvent(null)
              }}
            />
          </div>
        )}

        {/* イベントリスト */}
        {birthYear ? (
          <div className="space-y-6">
            {sortedEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 mb-4">
                  まだライフイベントが登録されていません。
                  <br />
                  大切なイベントを追加して、残り回数を確認しましょう。
                </p>
              </div>
            ) : (
              <>
                {/* 警告メッセージ */}
                {sortedEvents.some((event) => (remainingCounts[event.id] || 0) < 10) && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">
                        残り回数が少ないイベントがあります
                      </p>
                      <p className="text-sm text-orange-700 mt-1">
                        優先的に計画を立てることをお勧めします
                      </p>
                    </div>
                  </div>
                )}

                {/* イベントカード */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sortedEvents.map((event) => (
                    <LifeEventCard
                      key={event.id}
                      event={event}
                      remainingCount={remainingCounts[event.id] || 0}
                      onEdit={() => setEditingEvent(event)}
                      onDelete={() => handleDeleteEvent(event.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">
              生まれ年を入力すると、ライフイベントの残り回数が表示されます
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
