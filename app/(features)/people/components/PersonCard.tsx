"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"
import { Button } from "@/app/(shared)/components/Button"
import { Card } from "@/app/(shared)/components/Card"
import { CircularProgress } from "@/app/(shared)/components/CircularProgress"
import type { LifeEvent, Person } from "@/app/(shared)/types"
import {
  calculateRemainingCount,
  getDefaultUntilAge,
  LIFE_EXPECTANCY,
} from "@/app/(shared)/utils/calculations"

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
  const personAge = useMemo(() => new Date().getFullYear() - person.birthYear, [person.birthYear])
  const untilAge = useMemo(
    () => getDefaultUntilAge(person.relationship, personAge, currentAge),
    [person.relationship, personAge, currentAge],
  )

  const relationshipEmoji = useMemo(() => {
    const emojis: Record<Person["relationship"], string> = {
      self: "😊",
      child: "👶",
      partner: "💑",
      parent: "👨‍👩‍👧",
      friend: "🤝",
      other: "👥",
    }
    return emojis[person.relationship] || "👥"
  }, [person.relationship])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="text-2xl sm:text-3xl">{relationshipEmoji}</div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{person.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {personAge}歳 / {RELATIONSHIP_LABELS[person.relationship]}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="small" onClick={() => onRemove(person.id)}>
              削除
            </Button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm font-medium text-gray-700">
                {person.name}の{untilAge}歳まで
              </div>
              <div className="text-xs text-gray-500">あと{untilAge - personAge}年</div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {events.slice(0, 4).map((event) => {
                const remainingCount = calculateRemainingCount(
                  personAge,
                  untilAge,
                  event.annualFrequency,
                )
                const totalCount = calculateRemainingCount(
                  personAge,
                  LIFE_EXPECTANCY,
                  event.annualFrequency,
                )
                const isUrgent = remainingCount < 20

                return (
                  <motion.div
                    key={event.id}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-gray-100"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <div className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                        {event.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CircularProgress
                        value={remainingCount}
                        maxValue={totalCount}
                        size={40}
                        strokeWidth={3}
                        color={isUrgent ? "#DC2626" : "#8B5CF6"}
                        showPercentage={false}
                      />
                      <div>
                        <div
                          className={`text-base sm:text-lg font-bold ${isUrgent ? "text-red-600" : "text-gray-900"}`}
                        >
                          {remainingCount}回
                        </div>
                        <div className="text-xs text-gray-500">残り</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
