"use client"

import { Card } from "@/app/(shared)/components/Card"
import type { LifeMilestone } from "@/app/(shared)/types"

interface MilestoneCardProps {
  milestone: LifeMilestone
  currentAge: number
}

export function MilestoneCard({ milestone, currentAge }: MilestoneCardProps) {
  const remainingYears = milestone.targetAge - currentAge
  const isReached = remainingYears <= 0
  const isNear = remainingYears > 0 && remainingYears <= 5

  if (isReached) return null

  return (
    <Card className="p-6">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">{milestone.name}</h3>
        {milestone.description && <p className="text-sm text-gray-600">{milestone.description}</p>}
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${isNear ? "text-orange-600" : "text-gray-900"}`}>
            {remainingYears}
          </span>
          <span className="text-lg text-gray-600">年後</span>
        </div>
        <div className="text-sm text-gray-500">{milestone.targetAge}歳</div>
      </div>
    </Card>
  )
}
