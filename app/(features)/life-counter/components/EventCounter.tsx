"use client"

import { useState } from "react"
import { Card } from "@/app/(shared)/components/Card"
import { CircularProgress } from "@/app/(shared)/components/CircularProgress"
import { DotMatrix } from "@/app/(shared)/components/DotMatrix"
import type { LifeEvent } from "@/app/(shared)/types"
import { calculateRemainingCount, LIFE_EXPECTANCY } from "@/app/(shared)/utils/calculations"

interface EventCounterProps {
  event: LifeEvent
  currentAge: number
  targetAge: number
  targetLabel: string
}

type DisplayMode = "number" | "circular" | "dots"

export function EventCounter({ event, currentAge, targetAge, targetLabel }: EventCounterProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("circular")
  const remainingCount = calculateRemainingCount(currentAge, targetAge, event.annualFrequency)
  const totalPossibleCount = calculateRemainingCount(
    currentAge,
    LIFE_EXPECTANCY,
    event.annualFrequency,
  )
  const isUrgent = remainingCount < 20
  const isVeryUrgent = remainingCount < 10

  const getEventShape = () => {
    if (event.name.includes("誕生日")) return "heart"
    if (event.category === "special") return "circle"
    return "square"
  }

  const getEventColor = () => {
    if (isUrgent) return "#DC2626"
    if (event.category === "milestone") return "#7C3AED"
    if (event.category === "special") return "#EC4899"
    return "#3B82F6"
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
          <button
            type="button"
            onClick={() => {
              const modes: DisplayMode[] = ["number", "circular", "dots"]
              const currentIndex = modes.indexOf(displayMode)
              setDisplayMode(modes[(currentIndex + 1) % modes.length])
            }}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            表示切替
          </button>
        </div>

        <div className="flex flex-col items-center py-2">
          {displayMode === "number" && (
            <div className="text-center space-y-1">
              <div className={`text-3xl font-bold ${isUrgent ? "text-red-600" : "text-gray-900"}`}>
                あと{remainingCount}回
              </div>
              {isVeryUrgent && <div className="text-sm text-red-600 font-medium">残りわずか</div>}
            </div>
          )}

          {displayMode === "circular" && (
            <CircularProgress
              value={remainingCount}
              maxValue={totalPossibleCount}
              size={100}
              strokeWidth={8}
              label="回"
              color={getEventColor()}
              showPercentage={false}
            />
          )}

          {displayMode === "dots" && (
            <DotMatrix
              total={remainingCount}
              filled={remainingCount}
              maxDisplay={50}
              dotSize={6}
              gap={3}
              filledColor={getEventColor()}
              shape={getEventShape()}
            />
          )}
        </div>

        <div className="space-y-1">
          <div className="text-sm text-gray-600">{targetLabel}まで</div>
          <div className="text-xs text-gray-500">年{event.annualFrequency}回</div>
        </div>
      </div>
    </Card>
  )
}
