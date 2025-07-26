"use client"

import { useState } from "react"
import type { LifeEvent } from "../types"

interface EventManagerProps {
  onClose: () => void
  onAddEvent: (event: LifeEvent) => void
}

const CATEGORIES = [
  { value: "health", label: "健康", color: "bg-green-500" },
  { value: "family", label: "家族", color: "bg-red-500" },
  { value: "career", label: "仕事", color: "bg-blue-500" },
  { value: "hobby", label: "趣味", color: "bg-purple-500" },
  { value: "travel", label: "旅行", color: "bg-yellow-500" },
  { value: "other", label: "その他", color: "bg-gray-500" },
] as const

const FREQUENCY_PRESETS = [
  { label: "毎日", value: 365 },
  { label: "週1回", value: 52 },
  { label: "月1回", value: 12 },
  { label: "年4回", value: 4 },
  { label: "年1回", value: 1 },
]

export function EventManager({ onClose, onAddEvent }: EventManagerProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<LifeEvent["category"]>("other")
  const [frequency, setFrequency] = useState(12)
  const [startAge, setStartAge] = useState(30)
  const [endAge, setEndAge] = useState(80)
  const [priority, _setPriority] = useState<LifeEvent["priority"]>("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEvent: LifeEvent = {
      id: Date.now().toString(),
      name,
      category,
      frequency,
      startAge,
      endAge,
      priority,
    }

    onAddEvent(newEvent)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4">新しいイベントを追加</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="event-name" className="block text-sm font-medium text-gray-700 mb-1">
              イベント名
            </label>
            <input
              id="event-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</div>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value as LifeEvent["category"])}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    category === cat.value
                      ? `${cat.color} text-white`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="frequency-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              頻度（年間回数）
            </label>
            <div className="grid grid-cols-3 md:flex md:flex-row gap-2 mb-2">
              {FREQUENCY_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setFrequency(preset.value)}
                  className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm ${
                    frequency === preset.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              id="frequency-input"
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="365"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div>
              <label htmlFor="start-age" className="block text-sm font-medium text-gray-700 mb-1">
                開始年齢
              </label>
              <input
                id="start-age"
                type="number"
                value={startAge}
                onChange={(e) => setStartAge(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label htmlFor="end-age" className="block text-sm font-medium text-gray-700 mb-1">
                終了年齢
              </label>
              <input
                id="end-age"
                type="number"
                value={endAge}
                onChange={(e) => setEndAge(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              追加
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
