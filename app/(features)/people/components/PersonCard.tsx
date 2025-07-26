"use client"

import { Button } from "@/app/(shared)/components/Button"
import { Card } from "@/app/(shared)/components/Card"
import type { LifeEvent, Person } from "@/app/(shared)/types"
import { calculateRemainingCount, getDefaultUntilAge } from "@/app/(shared)/utils/calculations"

interface PersonCardProps {
  person: Person
  events: LifeEvent[]
  currentAge: number
  onRemove: (id: string) => void
}

const RELATIONSHIP_LABELS: Record<Person["relationship"], string> = {
  self: "自分",
  child: "子供",
  partner: "パートナー",
  parent: "親",
  friend: "友人",
  other: "その他",
}

export function PersonCard({ person, events, currentAge, onRemove }: PersonCardProps) {
  const personAge = new Date().getFullYear() - person.birthYear
  const untilAge = getDefaultUntilAge(person.relationship, personAge, currentAge)

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{person.name}</h3>
            <p className="text-sm text-gray-600">
              {personAge}歳 / {RELATIONSHIP_LABELS[person.relationship]}
            </p>
          </div>
          <Button variant="ghost" size="small" onClick={() => onRemove(person.id)}>
            削除
          </Button>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">
            {person.name}の{untilAge}歳まで
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {events.slice(0, 4).map((event) => {
              const remainingCount = calculateRemainingCount(
                personAge,
                untilAge,
                event.annualFrequency,
              )
              const isUrgent = remainingCount < 20

              return (
                <div key={event.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700">{event.name}</div>
                  <div
                    className={`text-xl font-bold ${isUrgent ? "text-red-600" : "text-gray-900"}`}
                  >
                    あと{remainingCount}回
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
