"use client"

import { motion } from "framer-motion"
import { useEvents, usePersonEvents, usePersons } from "@/app/(shared)/hooks/useStorage"
import type { Person } from "@/app/(shared)/types/models"
import { calculateLifeProgress, createTimeBuckets } from "../utils/calculations"
import { TimeBucketCard } from "./TimeBucketCard"

interface TimelineProps {
  self: Person
  currentAge: number
}

export function Timeline({ self, currentAge }: TimelineProps) {
  const { events } = useEvents()
  const { personEvents } = usePersonEvents()
  const { persons } = usePersons()

  const timeBuckets = createTimeBuckets(self, currentAge, events, personEvents, persons)
  const lifeProgress = calculateLifeProgress(self.birthYear)

  return (
    <div className="relative">
      {/* 人生の進捗バー */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">人生の旅路</span>
          <span className="text-sm font-medium">{Math.round(lifeProgress)}%</span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${lifeProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0歳</span>
          <span className="font-medium text-blue-600">{currentAge}歳（現在）</span>
          <span>100歳</span>
        </div>
      </div>

      {/* タイムライン */}
      <div className="relative">
        {/* 中心線 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 -translate-x-1/2" />

        {/* タイムバケット */}
        <div className="space-y-6">
          {timeBuckets.map((bucket, index) => (
            <motion.div
              key={bucket.decade}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TimeBucketCard bucket={bucket} currentAge={currentAge} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
