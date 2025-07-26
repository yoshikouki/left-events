"use client"

import { useEffect, useState } from "react"
import { AgeInput } from "@/app/(features)/life-counter/components/AgeInput"
import { EventCounter } from "@/app/(features)/life-counter/components/EventCounter"
import { MilestoneCard } from "@/app/(features)/life-counter/components/MilestoneCard"
import { PersonCard } from "@/app/(features)/people/components/PersonCard"
import { PersonForm } from "@/app/(features)/people/components/PersonForm"
import { Button } from "@/app/(shared)/components/Button"
import { DEFAULT_LIFE_EVENTS, LIFE_MILESTONES } from "@/app/(shared)/data/default-events"
import type { Person } from "@/app/(shared)/types"
import { HEALTHY_LIFE_EXPECTANCY } from "@/app/(shared)/utils/calculations"
import { storage } from "@/app/(shared)/utils/storage"

export default function HomePage() {
  const [currentAge, setCurrentAge] = useState(35)
  const [people, setPeople] = useState<Person[]>([])
  const [showPersonForm, setShowPersonForm] = useState(false)

  // ローカルストレージから初期データを読み込み
  useEffect(() => {
    const savedAge = storage.getUserAge()
    const savedPeople = storage.getPeople()
    setCurrentAge(savedAge)
    setPeople(savedPeople)
  }, [])

  const handleAgeChange = (age: number) => {
    setCurrentAge(age)
    storage.saveUserAge(age)
  }

  const handleAddPerson = (personData: Omit<Person, "id">) => {
    const newPerson: Person = {
      ...personData,
      id: Date.now().toString(),
    }
    const updatedPeople = [...people, newPerson]
    setPeople(updatedPeople)
    storage.savePeople(updatedPeople)
    setShowPersonForm(false)
  }

  const handleRemovePerson = (id: string) => {
    const updatedPeople = people.filter((p) => p.id !== id)
    setPeople(updatedPeople)
    storage.savePeople(updatedPeople)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ヘッダー */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">人生の残り時間</h1>
          <p className="text-lg text-gray-600">大切な人との時間を可視化して、今を大切に生きる</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg text-gray-700">あなたの年齢：</span>
            <AgeInput initialAge={currentAge} onAgeChange={handleAgeChange} />
          </div>
        </header>

        {/* マイルストーン */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">人生の節目まで</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LIFE_MILESTONES.map((milestone) => (
              <MilestoneCard key={milestone.name} milestone={milestone} currentAge={currentAge} />
            ))}
          </div>
        </section>

        {/* 自分のイベントカウンター */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">あなたの残り回数</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEFAULT_LIFE_EVENTS.map((event) => (
              <EventCounter
                key={event.id}
                event={event}
                currentAge={currentAge}
                targetAge={HEALTHY_LIFE_EXPECTANCY}
                targetLabel="健康寿命"
              />
            ))}
          </div>
        </section>

        {/* 大切な人 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">大切な人との時間</h2>
            {!showPersonForm && (
              <Button onClick={() => setShowPersonForm(true)}>大切な人を追加</Button>
            )}
          </div>

          {showPersonForm && (
            <div className="mb-6">
              <PersonForm onSubmit={handleAddPerson} onCancel={() => setShowPersonForm(false)} />
            </div>
          )}

          {people.length === 0 && !showPersonForm && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-4">まだ大切な人が登録されていません</p>
              <p>大切な人を追加して、一緒に過ごせる時間を確認しましょう</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {people.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                events={DEFAULT_LIFE_EVENTS}
                currentAge={currentAge}
                onRemove={handleRemovePerson}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
