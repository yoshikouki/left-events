"use client"

import { Card } from "@/app/(shared)/components/Card"
import type { LifeEvent } from "@/app/(shared)/types"
import { calculateRemainingCount } from "@/app/(shared)/utils/calculations"

interface EventCounterProps {
  event: LifeEvent
  currentAge: number
  targetAge: number
  targetLabel: string
}

export function EventCounter({ event, currentAge, targetAge, targetLabel }: EventCounterProps) {
  const remainingCount = calculateRemainingCount(currentAge, targetAge, event.annualFrequency)
  const isUrgent = remainingCount < 20
  const isVeryUrgent = remainingCount < 10

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
        <div className="text-sm text-gray-600">{targetLabel}まで</div>
        <div className={`text-3xl font-bold ${isUrgent ? "text-red-600" : "text-gray-900"}`}>
          あと{remainingCount}回
        </div>
        {isVeryUrgent && <div className="text-sm text-red-600 font-medium">残りわずか</div>}
        <div className="text-xs text-gray-500">年{event.annualFrequency}回</div>
      </div>
    </Card>
  )
}
