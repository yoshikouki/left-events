"use client"

import { ArrowLeft, Plus, Save, Trash2, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Select } from "@/app/(shared)/components/Select"
import { TextInput } from "@/app/(shared)/components/TextInput"
import { useEvents, usePersons } from "@/app/(shared)/hooks/useStorage"
import type { Person, RecurringEvent } from "@/app/(shared)/types/models"

export default function SettingsPage() {
  const { persons, savePerson, deletePerson } = usePersons()
  const { events, saveEvent, deleteEvent } = useEvents()
  const currentYear = new Date().getFullYear()

  const [newPersonName, setNewPersonName] = useState("")
  const [newPersonBirthYear, setNewPersonBirthYear] = useState((currentYear - 35).toString())
  const [newPersonRelation, setNewPersonRelation] = useState<Person["relation"]>("self")

  const [newEventName, setNewEventName] = useState("")
  const [newEventFrequency, setNewEventFrequency] = useState("52")
  const [newEventDescription, setNewEventDescription] = useState("")

  const handleAddPerson = async () => {
    if (!newPersonBirthYear) return

    const person: Person = {
      id: Date.now().toString(),
      name: newPersonName || undefined,
      birthYear: parseInt(newPersonBirthYear),
      relation: newPersonRelation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await savePerson(person)
    setNewPersonName("")
    setNewPersonBirthYear((currentYear - 35).toString())
    setNewPersonRelation("self")
  }

  const handleAddEvent = async () => {
    if (!newEventName || !newEventFrequency) return

    const event: RecurringEvent = {
      id: Date.now().toString(),
      name: newEventName,
      frequency: parseInt(newEventFrequency),
      description: newEventDescription || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await saveEvent(event)
    setNewEventName("")
    setNewEventFrequency("52")
    setNewEventDescription("")
  }

  const relationLabels: Record<Person["relation"], string> = {
    self: "自分",
    parent: "親",
    child: "子供",
    partner: "パートナー",
    friend: "友人",
    other: "その他",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold">設定</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 人の管理 */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />人
            </h2>

            {/* 人リスト */}
            <div className="mb-6 space-y-2">
              {persons.map((person) => {
                const age = currentYear - person.birthYear
                return (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium">
                        {person.name || relationLabels[person.relation]}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({age}歳・{person.birthYear}年生)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deletePerson(person.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
              {persons.length === 0 && (
                <p className="text-gray-500 text-center py-4">まだ登録されていません</p>
              )}
            </div>

            {/* 新規追加フォーム */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">新規追加</h3>
              <div className="space-y-3">
                <TextInput
                  type="text"
                  placeholder="名前（省略可）"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                />
                <div className="flex gap-2">
                  <TextInput
                    type="number"
                    placeholder="生まれ年"
                    value={newPersonBirthYear}
                    onChange={(e) => setNewPersonBirthYear(e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={newPersonRelation}
                    onChange={(e) => setNewPersonRelation(e.target.value as Person["relation"])}
                    className="flex-1"
                  >
                    {Object.entries(relationLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </div>
                <button
                  type="button"
                  onClick={handleAddPerson}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  追加
                </button>
              </div>
            </div>
          </section>

          {/* 繰り返し予定の管理 */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Save className="w-5 h-5 mr-2" />
              繰り返し予定
            </h2>

            {/* 予定リスト */}
            <div className="mb-6 space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-medium">{event.name}</span>
                    <span className="text-sm text-gray-600 ml-2">（年{event.frequency}回）</span>
                    {event.description && (
                      <p className="text-sm text-gray-500">{event.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-gray-500 text-center py-4">まだ登録されていません</p>
              )}
            </div>

            {/* 新規追加フォーム */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">新規追加</h3>
              <div className="space-y-3">
                <TextInput
                  type="text"
                  placeholder="予定名"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                />
                <TextInput
                  type="number"
                  placeholder="年間回数"
                  value={newEventFrequency}
                  onChange={(e) => setNewEventFrequency(e.target.value)}
                />
                <textarea
                  placeholder="説明（省略可）"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  追加
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/life-simulation"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            シミュレーションへ
          </Link>
        </div>
      </main>
    </div>
  )
}
