"use client"

import { useMemo } from "react"
import type { LifeEvent } from "../types"
import { calculateTimeBuckets } from "../utils/calculations"
import { TimeBucket } from "./TimeBucket"

interface TimelineViewProps {
  currentAge: number
  events: LifeEvent[]
  onAddEventClick: () => void
}

export function TimelineView({ currentAge, events, onAddEventClick }: TimelineViewProps) {
  const timeBuckets = useMemo(() => calculateTimeBuckets(currentAge, events), [currentAge, events])

  const currentDecade = Math.floor(currentAge / 10) * 10

  return (
    <div className="relative">
      {/* Desktop Timeline Path */}
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 transform -translate-y-1/2" />

      {/* Mobile Timeline Path */}
      <div className="md:hidden absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-300 transform -translate-x-1/2" />

      {/* Current Position Marker - Desktop */}
      <div
        className="hidden md:block absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20"
        style={{ left: `${((currentAge % 10) / 10) * 100}%` }}
      >
        <div className="relative">
          <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse" />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-blue-600 whitespace-nowrap">
            現在 {currentAge}歳
          </div>
        </div>
      </div>

      {/* Time Buckets */}
      <div className="relative flex md:flex-row flex-col gap-4 md:overflow-x-auto overflow-y-auto py-8 md:py-16 px-4 md:px-4">
        {timeBuckets.map((bucket, _index) => (
          <div key={bucket.decade} className="relative">
            {/* Mobile Current Position Marker */}
            {bucket.decade === currentDecade && (
              <div className="md:hidden absolute -left-8 top-1/2 transform -translate-y-1/2">
                <div className="relative">
                  <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse" />
                  <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-blue-600 whitespace-nowrap ml-2">
                    現在 {currentAge}歳
                  </div>
                </div>
              </div>
            )}
            <TimeBucket
              bucket={bucket}
              isCurrentDecade={bucket.decade === currentDecade}
              isPast={bucket.decade < currentDecade}
            />
          </div>
        ))}
      </div>

      {/* Add Event Button */}
      <div className="flex justify-center mt-4 md:mt-8 px-4">
        <button
          type="button"
          onClick={onAddEventClick}
          className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          イベントを追加
        </button>
      </div>
    </div>
  )
}
