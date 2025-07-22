"use client"

import { Calendar, Check, Clock, Heart, Plus, Trash2, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useEvents, usePersonEvents, usePersons } from "@/app/(shared)/hooks/useStorage"
import type { Person, PersonEvent, RecurringEvent } from "@/app/(shared)/types/models"
import { Select } from "./Select"
import { TextInput } from "./TextInput"
import { YearSelect } from "./YearSelect"

export function LifeCalculator() {
  const { persons, savePerson, deletePerson } = usePersons()
  const { events, saveEvent, deleteEvent } = useEvents()
  const { personEvents, savePersonEvent, deletePersonEvent } = usePersonEvents()

  const currentYear = new Date().getFullYear()
  const defaultAge = 35
  const lifeExpectancy = 85
  const healthyLifeExpectancy = 72

  // 自分のデータ
  const self = persons.find((p) => p.relation === "self")
  const [birthYear, setBirthYear] = useState<string>("")
  const [showPersonForm, setShowPersonForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)

  // 新しい人の入力
  const [newPersonName, setNewPersonName] = useState("")
  const [newPersonBirthYear, setNewPersonBirthYear] = useState("")
  const [newPersonRelation, setNewPersonRelation] = useState<Person["relation"]>("parent")

  // 新しい予定の入力
  const [newEventName, setNewEventName] = useState("")
  const [newEventInterval, setNewEventInterval] = useState<"year" | "month" | "week" | "day">(
    "year",
  )
  const [newEventFrequency, setNewEventFrequency] = useState("1")
  const [showPersonEventForm, setShowPersonEventForm] = useState<string>("") // 人物関連付けフォームを表示するイベントID
  const [selectedPersonForEvent, setSelectedPersonForEvent] = useState<string>("") // イベントに関連付ける人物
  const [personEventUntilAge, setPersonEventUntilAge] = useState<string>("") // 人物別の節目年齢

  // 初回アクセス時のデフォルトデータ作成
  useEffect(() => {
    if (!self && birthYear && parseInt(birthYear) >= 1900 && parseInt(birthYear) <= currentYear) {
      // 自分を作成
      const newSelf: Person = {
        id: Date.now().toString(),
        birthYear: parseInt(birthYear),
        relation: "self",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      savePerson(newSelf)

      // デフォルトの予定を作成
      const defaultEvents = [
        { name: "桜", frequency: 1 },
        { name: "誕生日", frequency: 1 },
        { name: "正月", frequency: 1 },
        { name: "家族旅行", frequency: 2 },
      ]

      setTimeout(async () => {
        for (const eventData of defaultEvents) {
          const event: RecurringEvent = {
            id: Date.now().toString() + Math.random(),
            ...eventData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          await saveEvent(event)

          // 自分と関連付け
          const personEvent: PersonEvent = {
            id: Date.now().toString() + Math.random(),
            personId: newSelf.id,
            eventId: event.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          await savePersonEvent(personEvent)
        }
      }, 100)
    }
  }, [self, birthYear, currentYear, savePerson, saveEvent, savePersonEvent])

  // 自分の年齢設定
  useEffect(() => {
    if (self) {
      setBirthYear(self.birthYear.toString())
    } else {
      setBirthYear((currentYear - defaultAge).toString())
    }
  }, [self, currentYear])

  // 生まれ年の更新
  const handleBirthYearChange = async (value: string) => {
    setBirthYear(value)
    if (self && value && parseInt(value) >= 1900 && parseInt(value) <= currentYear) {
      const updated: Person = {
        ...self,
        birthYear: parseInt(value),
        updatedAt: new Date().toISOString(),
      }
      await savePerson(updated)
    }
  }

  // 大切な人の追加
  const handleAddPerson = async () => {
    if (!newPersonRelation || !newPersonBirthYear) return

    const birthYearNum = parseInt(newPersonBirthYear)

    const person: Person = {
      id: Date.now().toString(),
      name: newPersonName || undefined,
      birthYear: birthYearNum,
      relation: newPersonRelation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await savePerson(person)
    setNewPersonName("")
    setNewPersonBirthYear("")
    setShowPersonForm(false)
  }

  // 予定の追加
  const handleAddEvent = async () => {
    if (!self) return

    const frequency = parseInt(newEventFrequency)
    if (Number.isNaN(frequency) || frequency <= 0) return

    // 間隔を年間回数に変換
    let annualFrequency: number
    switch (newEventInterval) {
      case "day":
        annualFrequency = frequency * 365
        break
      case "week":
        annualFrequency = frequency * 52
        break
      case "month":
        annualFrequency = frequency * 12
        break
      case "year":
      default:
        annualFrequency = frequency
        break
    }

    const event: RecurringEvent = {
      id: Date.now().toString(),
      name:
        newEventName ||
        `${frequency}回/${newEventInterval === "year" ? "年" : newEventInterval === "month" ? "月" : newEventInterval === "week" ? "週" : "日"}`,
      frequency: annualFrequency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await saveEvent(event)

    // 自分と関連付け
    const personEvent: PersonEvent = {
      id: Date.now().toString() + Math.random(),
      personId: self.id,
      eventId: event.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await savePersonEvent(personEvent)

    setNewEventName("")
    setNewEventInterval("year")
    setNewEventFrequency("1")
    setShowEventForm(false)
  }

  // 予定の削除
  const handleDeleteEvent = async (eventId: string) => {
    // 関連するPersonEventを削除
    const relatedPersonEvents = personEvents.filter((pe) => pe.eventId === eventId)
    for (const pe of relatedPersonEvents) {
      await deletePersonEvent(pe.id)
    }
    // イベント自体を削除
    await deleteEvent(eventId)
  }

  // 予定に人物を関連付け
  const handleAddPersonToEvent = async (eventId: string) => {
    if (!selectedPersonForEvent) return

    const personEvent: PersonEvent = {
      id: Date.now().toString() + Math.random(),
      personId: selectedPersonForEvent,
      eventId: eventId,
      untilAge: personEventUntilAge ? parseInt(personEventUntilAge) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await savePersonEvent(personEvent)

    setShowPersonEventForm("")
    setSelectedPersonForEvent("")
    setPersonEventUntilAge("")
  }

  // 計算
  const calculations = useMemo(() => {
    if (!birthYear || parseInt(birthYear) < 1900 || parseInt(birthYear) > currentYear) {
      return null
    }

    const birthYearNum = parseInt(birthYear)
    const currentAge = currentYear - birthYearNum
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
  }, [birthYear, currentYear])

  // 残り回数の計算
  const remainingCounts = useMemo(() => {
    if (!self || !calculations) return []

    const counts: Array<{
      event: RecurringEvent
      personEvent: PersonEvent
      remainingCount: number
      person?: Person
    }> = []

    // 自分の予定
    const myPersonEvents = personEvents.filter((pe) => pe.personId === self.id)
    myPersonEvents.forEach((pe) => {
      const event = events.find((e) => e.id === pe.eventId)
      if (!event) return

      const untilAge = pe.untilAge || lifeExpectancy
      const yearsRemaining = Math.max(0, untilAge - calculations.currentAge)
      const effectiveYears = Math.min(
        yearsRemaining,
        Math.max(0, healthyLifeExpectancy - calculations.currentAge),
      )
      const remainingCount = Math.round(event.frequency * effectiveYears)

      counts.push({ event, personEvent: pe, remainingCount })
    })

    // 他の人との予定（家族との時間など）
    const otherPersons = persons.filter((p) => p.relation !== "self")
    otherPersons.forEach((person) => {
      const theirEvents = personEvents.filter((pe) => pe.personId === person.id)
      theirEvents.forEach((pe) => {
        const event = events.find((e) => e.id === pe.eventId)
        if (!event) return

        const personAge = currentYear - person.birthYear
        let yearsRemaining = 0

        // untilAgeが設定されている場合はそれを使用、そうでなければデフォルトの節目年齢を使用
        if (pe.untilAge) {
          yearsRemaining = Math.max(0, pe.untilAge - personAge)
        } else {
          if (person.relation === "child") {
            yearsRemaining = Math.max(0, 18 - personAge) // 子供は18歳まで
          } else if (person.relation === "parent") {
            yearsRemaining = Math.max(0, 85 - personAge) // 親は85歳まで
          } else if (person.relation === "partner") {
            // パートナーは自分の健康寿命まで
            yearsRemaining = Math.min(
              calculations.healthyRemainingYears,
              Math.max(0, healthyLifeExpectancy - personAge),
            )
          } else {
            // その他は30年または健康寿命のいずれか短い方
            yearsRemaining = Math.min(calculations.healthyRemainingYears, 30)
          }
        }

        const remainingCount = Math.round(event.frequency * yearsRemaining)
        counts.push({ event, personEvent: pe, remainingCount, person })
      })
    })

    return counts.sort((a, b) => a.remainingCount - b.remainingCount)
  }, [self, calculations, personEvents, events, persons, currentYear])

  const relationLabels: Record<Person["relation"], string> = {
    self: "自分",
    parent: "親",
    child: "子供",
    partner: "パートナー",
    friend: "友人",
    other: "その他",
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">残り時間</h2>

      <div className="mb-8">
        <YearSelect
          label="生まれ年"
          value={birthYear}
          onChange={(e) => handleBirthYearChange(e.target.value)}
          className="text-lg"
        />
      </div>

      {calculations && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600">
              現在{" "}
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

          {/* 残り回数 */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">残り回数</h3>
              <button
                type="button"
                onClick={() => setShowEventForm(!showEventForm)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4 inline-block mr-1" />
                予定追加
              </button>
            </div>

            {showEventForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-2">
                  <Select
                    value={newEventInterval}
                    onChange={(e) => setNewEventInterval(e.target.value as typeof newEventInterval)}
                    className="w-24"
                  >
                    <option value="year">年</option>
                    <option value="month">月</option>
                    <option value="week">週</option>
                    <option value="day">日</option>
                  </Select>
                  <Select
                    value={newEventFrequency}
                    onChange={(e) => setNewEventFrequency(e.target.value)}
                    className="w-20"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 24, 30, 50, 100].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </Select>
                  <TextInput
                    type="text"
                    placeholder="予定名"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    aria-label="予定を追加"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                    aria-label="キャンセル"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {events.map((event) => {
                const myPersonEvent = personEvents.find(
                  (pe) => pe.eventId === event.id && pe.personId === self?.id,
                )
                if (!myPersonEvent) return null

                const sharedWithPersons = personEvents
                  .filter((pe) => pe.eventId === event.id && pe.personId !== self?.id)
                  .map((pe) => {
                    const person = persons.find((p) => p.id === pe.personId)
                    return { personEvent: pe, person }
                  })
                  .filter((item) => item.person)

                const myRemainingCount = calculations
                  ? Math.round(event.frequency * calculations.healthyRemainingYears)
                  : 0

                return (
                  <div key={event.id} className="bg-gray-50 rounded-lg p-4 group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-700 font-medium">{event.name}</span>
                        <span className="text-xs text-gray-500">年{event.frequency}回</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-bold text-lg ${
                            myRemainingCount < 100 ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          あと約 {myRemainingCount.toLocaleString()} 回
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPersonEventForm(event.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 共有している人のリスト */}
                    {sharedWithPersons.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">一緒に過ごす人:</p>
                        <div className="flex flex-wrap gap-2">
                          {sharedWithPersons.map(({ personEvent, person }) => {
                            if (!person) return null
                            const personAge = currentYear - person.birthYear
                            let yearsRemaining = 0

                            if (personEvent.untilAge) {
                              yearsRemaining = Math.max(0, personEvent.untilAge - personAge)
                            } else {
                              if (person.relation === "child") {
                                yearsRemaining = Math.max(0, 18 - personAge)
                              } else if (person.relation === "parent") {
                                yearsRemaining = Math.max(0, 85 - personAge)
                              } else if (person.relation === "partner" && calculations) {
                                yearsRemaining = Math.min(
                                  calculations.healthyRemainingYears,
                                  Math.max(0, healthyLifeExpectancy - personAge),
                                )
                              } else if (calculations) {
                                yearsRemaining = Math.min(calculations.healthyRemainingYears, 30)
                              }
                            }

                            const remainingCount = Math.round(event.frequency * yearsRemaining)

                            return (
                              <span
                                key={personEvent.id}
                                className="text-sm bg-white px-2 py-1 rounded"
                              >
                                {person.name || relationLabels[person.relation]} (
                                <span
                                  className={
                                    remainingCount < 20 ? "text-red-600 font-semibold" : ""
                                  }
                                >
                                  {remainingCount}回
                                </span>
                                )
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* 人物追加フォーム */}
                    {showPersonEventForm === event.id && (
                      <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                        <div className="flex gap-2">
                          <Select
                            value={selectedPersonForEvent}
                            onChange={(e) => setSelectedPersonForEvent(e.target.value)}
                            className="flex-1"
                          >
                            <option value="">人を選択</option>
                            {persons
                              .filter((p) => {
                                // すでに関連付けられている人は除外
                                const isAlreadyLinked = personEvents.some(
                                  (pe) => pe.eventId === event.id && pe.personId === p.id,
                                )
                                return p.relation !== "self" && !isAlreadyLinked
                              })
                              .map((person) => (
                                <option key={person.id} value={person.id}>
                                  {person.name || relationLabels[person.relation]}
                                </option>
                              ))}
                          </Select>
                          <TextInput
                            type="number"
                            placeholder="何歳まで"
                            value={personEventUntilAge}
                            onChange={(e) => setPersonEventUntilAge(e.target.value)}
                            className="w-24"
                            min="1"
                            max="120"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddPersonToEvent(event.id)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPersonEventForm("")}
                            className="p-2 text-gray-600 hover:text-gray-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 大切な人との時間 */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">大切な人との時間</h3>
              <button
                type="button"
                onClick={() => setShowPersonForm(!showPersonForm)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4 inline-block mr-1" />
                人を追加
              </button>
            </div>

            {showPersonForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    type="text"
                    placeholder="名前（省略可）"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    className="text-sm"
                  />
                  <Select
                    value={newPersonRelation}
                    onChange={(e) => setNewPersonRelation(e.target.value as Person["relation"])}
                    className="text-sm"
                  >
                    {Object.entries(relationLabels)
                      .filter(([key]) => key !== "self")
                      .map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                  </Select>
                </div>
                <div className="flex gap-2">
                  <YearSelect
                    value={newPersonBirthYear}
                    onChange={(e) => setNewPersonBirthYear(e.target.value)}
                    className="flex-1 text-sm"
                    placeholder="生年"
                  />
                  <button
                    type="button"
                    onClick={handleAddPerson}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    追加
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPersonForm(false)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {persons
                .filter((p) => p.relation !== "self")
                .map((person) => {
                  const age = currentYear - person.birthYear
                  const personCounts = remainingCounts.filter((rc) => rc.person?.id === person.id)

                  // デフォルトの節目年齢を取得
                  let defaultMilestone = ""
                  if (person.relation === "child") {
                    defaultMilestone = "18歳まで"
                  } else if (person.relation === "parent") {
                    defaultMilestone = "85歳まで"
                  }

                  return (
                    <div key={person.id} className="bg-gray-50 rounded-lg p-4 group">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-lg">
                            {person.name || relationLabels[person.relation]}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">({age}歳)</span>
                          {defaultMilestone && (
                            <span className="text-xs text-gray-500 ml-2">{defaultMilestone}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => deletePerson(person.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {/* 関連付けられた予定は「残り回数」セクションで表示されるため、ここでは簡略表示 */}
                      <p className="text-sm text-gray-600">
                        {personCounts.length > 0
                          ? `${personCounts.length}個の予定が共有されています`
                          : "予定が登録されていません"}
                      </p>
                    </div>
                  )
                })}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-800">今を大切に</p>
          </div>
        </div>
      )}
    </div>
  )
}
