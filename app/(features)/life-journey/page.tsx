"use client"

import { useEffect, useState } from "react"
import { usePersons } from "@/app/(shared)/hooks/useStorage"
import type { Person } from "@/app/(shared)/types/models"
import { Timeline } from "./components/Timeline"

export default function LifeJourneyPage() {
  const { persons } = usePersons()
  const [self, setSelf] = useState<Person | null>(null)
  const [currentAge, setCurrentAge] = useState<number>(35)

  useEffect(() => {
    const selfPerson = persons.find((p) => p.relation === "self")
    if (selfPerson) {
      setSelf(selfPerson)
      const age = new Date().getFullYear() - selfPerson.birthYear
      setCurrentAge(age)
    }
  }, [persons])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Life Journey</h1>
          <p className="text-gray-600 text-sm mt-1">
            あなたの人生の旅路と、残された時間を可視化します
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {self ? (
          <Timeline self={self} currentAge={currentAge} />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600">まず設定から生まれ年を登録してください</p>
          </div>
        )}
      </main>
    </div>
  )
}
