"use client"

import { AlertTriangle, Calendar, Plus, Users, X } from "lucide-react"
import { useMemo, useState } from "react"
import type { LifeEvent } from "@/app/(shared)/types"
import { LifeEventCard } from "./components/LifeEventCard"
import { LifeEventForm } from "./components/LifeEventForm"

// デモデータ
const initialEvents: LifeEvent[] = [
  {
    id: "1",
    userId: "user-1",
    title: "親と旅行",
    description: "",
    averageFrequency: 1,
    lastOccurrence: new Date("2023-08-15"),
    importance: "high",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user-1",
    title: "運動会",
    description: "",
    averageFrequency: 1,
    importance: "high",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    userId: "user-1",
    title: "親友",
    description: "",
    averageFrequency: 4,
    lastOccurrence: new Date("2024-01-10"),
    importance: "medium",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

interface FamilyMember {
  id: string
  name: string
  relation: string
  age: number
}

export default function LifeSimulationPage() {
  const currentYear = new Date().getFullYear()
  const defaultAge = 35
  const defaultBirthYear = (currentYear - defaultAge).toString()

  const [birthYear, setBirthYear] = useState<string>(defaultBirthYear)
  const [events, setEvents] = useState<LifeEvent[]>(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [ageInputMode, setAgeInputMode] = useState<"age" | "year">("age")

  const lifeExpectancy = 85
  const healthyLifeExpectancy = 72

  const remainingCounts = useMemo(() => {
    if (!birthYear || parseInt(birthYear) < 1900 || parseInt(birthYear) > currentYear) {
      return {}
    }

    const birthYearNum = parseInt(birthYear)
    const currentAge = currentYear - birthYearNum
    const remainingYears = Math.max(0, lifeExpectancy - currentAge)
    const healthyRemainingYears = Math.max(0, healthyLifeExpectancy - currentAge)

    const counts: Record<string, number> = {}
    events.forEach((event) => {
      // 家族メンバーとの関連イベント
      const relatedMember = familyMembers.find(
        (member) =>
          event.title.includes(member.name) ||
          (member.relation === "子供" && event.title.includes("子")) ||
          (member.relation === "親" && event.title.includes("親")),
      )

      if (relatedMember) {
        if (relatedMember.relation === "子供") {
          const yearsUntilGraduation = Math.max(0, 22 - relatedMember.age)
          counts[event.id] = Math.round(
            event.averageFrequency * Math.min(yearsUntilGraduation, healthyRemainingYears),
          )
        } else if (relatedMember.relation === "親") {
          const parentRemainingYears = Math.max(0, 85 - relatedMember.age)
          counts[event.id] = Math.round(
            event.averageFrequency * Math.min(parentRemainingYears, healthyRemainingYears),
          )
        } else {
          counts[event.id] = Math.round(event.averageFrequency * healthyRemainingYears)
        }
      } else {
        // 通常のイベント
        counts[event.id] = Math.round(event.averageFrequency * remainingYears)
      }
    })

    return counts
  }, [birthYear, events, currentYear, familyMembers])

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
    if (confirm("削除？")) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">残り回数</h1>
        </div>

        {/* 生まれ年入力 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <label htmlFor="birthYearSim" className="block text-sm font-medium text-gray-700 mb-2">
            生まれ年
          </label>
          <div className="flex gap-4">
            <input
              id="birthYearSim"
              type="number"
              min="1900"
              max={currentYear}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="1990"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                平均{lifeExpectancy}歳 / 健康{healthyLifeExpectancy}歳
              </span>
            </div>
          </div>
        </div>

        {/* 家族メンバー入力 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            大切な人
          </h3>
          <div className="space-y-3">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <span className="text-sm">
                  {member.name || member.relation} ({member.age}歳)
                </span>
                <button
                  type="button"
                  onClick={() => setFamilyMembers(familyMembers.filter((m) => m.id !== member.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="名前（省略可）"
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  id="family-name"
                />
                <select
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  id="family-relation"
                >
                  <option value="">関係</option>
                  <option value="配偶者">配偶者</option>
                  <option value="子供">子供</option>
                  <option value="親">親</option>
                  <option value="兄弟">兄弟</option>
                  <option value="友人">友人</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setAgeInputMode("age")}
                    className={`px-2 py-1 text-xs rounded ${
                      ageInputMode === "age"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    年齢
                  </button>
                  <button
                    type="button"
                    onClick={() => setAgeInputMode("year")}
                    className={`px-2 py-1 text-xs rounded ${
                      ageInputMode === "year"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    生年
                  </button>
                </div>
                <input
                  type="number"
                  placeholder={ageInputMode === "age" ? "年齢" : "生まれ年"}
                  min={ageInputMode === "age" ? "0" : "1900"}
                  max={ageInputMode === "age" ? "120" : currentYear.toString()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  id={ageInputMode === "age" ? "family-age" : "family-birth-year"}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const nameInput = document.getElementById("family-name") as HTMLInputElement
                const relationInput = document.getElementById(
                  "family-relation",
                ) as HTMLSelectElement
                const ageInput = document.getElementById("family-age") as HTMLInputElement
                const birthYearInput = document.getElementById(
                  "family-birth-year",
                ) as HTMLInputElement

                if (relationInput.value) {
                  let age: number
                  if (ageInputMode === "age" && ageInput?.value) {
                    age = parseInt(ageInput.value)
                  } else if (ageInputMode === "year" && birthYearInput?.value) {
                    age = currentYear - parseInt(birthYearInput.value)
                  } else {
                    return
                  }

                  setFamilyMembers([
                    ...familyMembers,
                    {
                      id: Date.now().toString(),
                      name: nameInput.value || "",
                      relation: relationInput.value,
                      age,
                    },
                  ])
                  nameInput.value = ""
                  relationInput.value = ""
                  if (ageInput) ageInput.value = ""
                  if (birthYearInput) birthYearInput.value = ""
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              <Plus className="w-4 h-4" />
              追加
            </button>
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
              追加
            </button>
          </div>
        )}

        {/* フォーム */}
        {(showForm || editingEvent) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editingEvent ? "編集" : "新規"}</h2>
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
                <p className="text-gray-500 mb-4">データなし</p>
              </div>
            ) : (
              <>
                {/* 警告メッセージ */}
                {sortedEvents.some((event) => (remainingCounts[event.id] || 0) < 10) && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">残り少ない</p>
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
            <p className="text-gray-500">生まれ年を入力</p>
          </div>
        )}
      </div>
    </div>
  )
}
