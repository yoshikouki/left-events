"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { AgeInput } from "@/app/(features)/life-counter/components/AgeInput"
import { EventCounter } from "@/app/(features)/life-counter/components/EventCounter"
import { MilestoneCard } from "@/app/(features)/life-counter/components/MilestoneCard"
import { PersonCard } from "@/app/(features)/people/components/PersonCard"
import { PersonForm } from "@/app/(features)/people/components/PersonForm"
import { Button } from "@/app/(shared)/components/Button"
import { Timeline } from "@/app/(shared)/components/Timeline"
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* ヘッダー */}
        <motion.header
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            人生の残り時間
          </h1>
          <p className="text-xl text-gray-600">大切な人との時間を可視化して、今を大切に生きる</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg text-gray-700">あなたの年齢：</span>
            <AgeInput initialAge={currentAge} onAgeChange={handleAgeChange} />
          </div>
        </motion.header>

        {/* タイムラインビュー */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">人生のタイムライン</h2>
          <Timeline currentAge={currentAge} milestones={LIFE_MILESTONES} />
        </motion.section>

        {/* マイルストーン */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">人生の節目まで</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LIFE_MILESTONES.map((milestone, index) => (
              <motion.div
                key={milestone.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <MilestoneCard milestone={milestone} currentAge={currentAge} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 自分のイベントカウンター */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">あなたの残り回数</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEFAULT_LIFE_EVENTS.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
              >
                <EventCounter
                  event={event}
                  currentAge={currentAge}
                  targetAge={HEALTHY_LIFE_EXPECTANCY}
                  targetLabel="健康寿命"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 大切な人 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
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
        </motion.section>
      </div>
    </div>
  )
}
