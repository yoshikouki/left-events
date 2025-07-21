"use client"

import { AlertTriangle, ArrowLeft, Calendar, Link2, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useEvents, usePersonEvents, usePersons } from "@/app/(shared)/hooks/useStorage"
import type { Person, PersonEvent, RecurringEvent } from "@/app/(shared)/types/models"

export default function LifeSimulationPage() {
  const { persons, loading: personsLoading } = usePersons()
  const { events, loading: eventsLoading } = useEvents()
  const { personEvents, savePersonEvent, deletePersonEvent } = usePersonEvents()

  const [selectedPersonId, setSelectedPersonId] = useState<string>("")
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [untilAge, setUntilAge] = useState<string>("")

  const currentYear = new Date().getFullYear()
  const lifeExpectancy = 85
  const healthyLifeExpectancy = 72

  // 自分を選択
  useEffect(() => {
    if (!personsLoading && persons.length > 0 && !selectedPersonId) {
      const self = persons.find((p) => p.relation === "self") || persons[0]
      if (self) setSelectedPersonId(self.id)
    }
  }, [persons, personsLoading, selectedPersonId])

  const selectedPerson = persons.find((p) => p.id === selectedPersonId)

  const remainingCounts = useMemo(() => {
    const counts: Array<{
      person: Person
      event: RecurringEvent
      personEvent: PersonEvent
      remainingCount: number
      yearsRemaining: number
    }> = []

    personEvents.forEach((pe) => {
      const person = persons.find((p) => p.id === pe.personId)
      const event = events.find((e) => e.id === pe.eventId)
      if (!person || !event) return

      const age = currentYear - person.birthYear
      const untilAgeNum = pe.untilAge || lifeExpectancy
      const yearsRemaining = Math.max(0, untilAgeNum - age)

      // 健康寿命を考慮
      let effectiveYears = yearsRemaining
      if (person.relation === "self") {
        effectiveYears = Math.min(yearsRemaining, Math.max(0, healthyLifeExpectancy - age))
      }

      const remainingCount = Math.round(event.frequency * effectiveYears)

      counts.push({
        person,
        event,
        personEvent: pe,
        remainingCount,
        yearsRemaining: effectiveYears,
      })
    })

    return counts.sort((a, b) => a.remainingCount - b.remainingCount)
  }, [personEvents, persons, events, currentYear])

  const handleAddPersonEvent = async () => {
    if (!selectedPersonId || !selectedEventId) return

    const personEvent: PersonEvent = {
      id: Date.now().toString(),
      personId: selectedPersonId,
      eventId: selectedEventId,
      untilAge: untilAge ? parseInt(untilAge) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await savePersonEvent(personEvent)
    setSelectedEventId("")
    setUntilAge("")
  }

  if (personsLoading || eventsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold">シミュレーション</h1>
            </div>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Settings className="w-4 h-4" />
              設定
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {persons.length === 0 || events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">まず設定で人と予定を登録してください</p>
            <Link
              href="/settings"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              設定へ
            </Link>
          </div>
        ) : (
          <>
            {/* 人と予定の関連付け */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Link2 className="w-5 h-5 mr-2" />
                人と予定を関連付け
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                <select
                  value={selectedPersonId}
                  onChange={(e) => setSelectedPersonId(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">人を選択</option>
                  {persons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name ||
                        (person.relation === "self"
                          ? "自分"
                          : person.relation === "parent"
                            ? "親"
                            : person.relation === "child"
                              ? "子供"
                              : person.relation === "partner"
                                ? "パートナー"
                                : person.relation === "friend"
                                  ? "友人"
                                  : "その他")}
                      （{currentYear - person.birthYear}歳）
                    </option>
                  ))}
                </select>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">予定を選択</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}（年{event.frequency}回）
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="何歳まで（省略可）"
                  value={untilAge}
                  onChange={(e) => setUntilAge(e.target.value)}
                  min="1"
                  max="120"
                  className="px-3 py-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={handleAddPersonEvent}
                  disabled={!selectedPersonId || !selectedEventId}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  追加
                </button>
              </div>
            </div>

            {/* 現在の自分の情報 */}
            {selectedPerson && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {selectedPerson.name || "自分"}：{currentYear - selectedPerson.birthYear}歳
                  </span>
                  <span>•</span>
                  <span>
                    平均余命：
                    {Math.max(0, lifeExpectancy - (currentYear - selectedPerson.birthYear))}年
                  </span>
                  <span>•</span>
                  <span>
                    健康余命：
                    {Math.max(0, healthyLifeExpectancy - (currentYear - selectedPerson.birthYear))}
                    年
                  </span>
                </div>
              </div>
            )}

            {/* 残り回数一覧 */}
            <div className="space-y-6">
              {remainingCounts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-500">まだ関連付けがありません</p>
                </div>
              ) : (
                <>
                  {/* 警告 */}
                  {remainingCounts.some((item) => item.remainingCount < 100) && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800">残り少ない予定があります</p>
                      </div>
                    </div>
                  )}

                  {/* カード一覧 */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {remainingCounts.map((item) => (
                      <div
                        key={item.personEvent.id}
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{item.event.name}</h3>
                            <p className="text-sm text-gray-600">
                              {item.person.name ||
                                (item.person.relation === "self"
                                  ? "自分"
                                  : item.person.relation === "parent"
                                    ? "親"
                                    : item.person.relation === "child"
                                      ? "子供"
                                      : item.person.relation === "partner"
                                        ? "パートナー"
                                        : item.person.relation === "friend"
                                          ? "友人"
                                          : "その他")}
                              と
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deletePersonEvent(item.personEvent.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            削除
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div
                            className={`text-3xl font-bold ${
                              item.remainingCount < 100 ? "text-red-600" : "text-gray-900"
                            }`}
                          >
                            あと {item.remainingCount.toLocaleString()} 回
                          </div>
                          <div className="text-sm text-gray-500">
                            年{item.event.frequency}回 × {item.yearsRemaining}年
                            {item.personEvent.untilAge && ` （${item.personEvent.untilAge}歳まで）`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
