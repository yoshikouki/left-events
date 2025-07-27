"use client"

import { useMemo, useState } from "react"
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
  minimal?: boolean
}

type DisplayMode = "number" | "circular" | "dots"

export function EventCounter({
  event,
  currentAge,
  targetAge,
  targetLabel,
  minimal = false,
}: EventCounterProps) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("circular")

  const { remainingCount, totalPossibleCount, isUrgent, isVeryUrgent } = useMemo(() => {
    const remaining = calculateRemainingCount(currentAge, targetAge, event.annualFrequency)
    const total = calculateRemainingCount(currentAge, LIFE_EXPECTANCY, event.annualFrequency)
    return {
      remainingCount: remaining,
      totalPossibleCount: total,
      isUrgent: remaining < 20,
      isVeryUrgent: remaining < 10,
    }
  }, [currentAge, targetAge, event.annualFrequency])

  const eventShape = useMemo(() => {
    if (event.name.includes("誕生日")) return "heart"
    if (event.category === "special") return "circle"
    return "square"
  }, [event.name, event.category])

  const eventColor = useMemo(() => {
    if (isUrgent) return "#DC2626"
    if (event.category === "milestone") return "#7C3AED"
    if (event.category === "special") return "#EC4899"
    return "#3B82F6"
  }, [isUrgent, event.category])

  if (minimal) {
    return (
      <div className="group cursor-pointer">
        <div className="transition-all duration-300 hover:scale-105">
          <CircularProgress
            value={remainingCount}
            maxValue={totalPossibleCount}
            size={100}
            strokeWidth={4}
            label=""
            color={eventColor}
            showPercentage={false}
          />
        </div>
        <h3 className="text-sm font-medium text-gray-700 mt-3 text-center">{event.name}</h3>
        <p className="text-xs text-gray-500 text-center mt-1">あと{remainingCount}回</p>
      </div>
    )
  }

  return (
    <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 line-clamp-2">
            {event.name}
          </h3>
          <button
            type="button"
            onClick={() => {
              const modes: DisplayMode[] = ["number", "circular", "dots"]
              const currentIndex = modes.indexOf(displayMode)
              setDisplayMode(modes[(currentIndex + 1) % modes.length])
            }}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors ml-2 flex-shrink-0"
          >
            切替
          </button>
        </div>

        <div className="flex flex-col items-center py-1 sm:py-2">
          {displayMode === "number" && (
            <div className="text-center space-y-1">
              <div
                className={`text-2xl sm:text-3xl font-bold ${isUrgent ? "text-red-600" : "text-gray-900"}`}
              >
                あと{remainingCount}回
              </div>
              {isVeryUrgent && (
                <div className="text-xs sm:text-sm text-red-600 font-medium">残りわずか</div>
              )}
            </div>
          )}

          {displayMode === "circular" && (
            <CircularProgress
              value={remainingCount}
              maxValue={totalPossibleCount}
              size={80}
              strokeWidth={6}
              label="回"
              color={eventColor}
              showPercentage={false}
            />
          )}

          {displayMode === "dots" && (
            <DotMatrix
              total={remainingCount}
              filled={remainingCount}
              maxDisplay={30}
              dotSize={5}
              gap={2}
              filledColor={eventColor}
              shape={eventShape}
            />
          )}
        </div>

        <div className="space-y-1">
          <div className="text-xs sm:text-sm text-gray-600">{targetLabel}まで</div>
          <div className="text-xs text-gray-500">年{event.annualFrequency}回</div>
        </div>
      </div>
    </Card>
  )
}
