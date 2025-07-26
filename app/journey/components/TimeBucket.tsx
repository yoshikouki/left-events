"use client"

import type { TimeBucket as TimeBucketType } from "../types"

interface TimeBucketProps {
  bucket: TimeBucketType
  isCurrentDecade: boolean
  isPast: boolean
}

export function TimeBucket({ bucket, isCurrentDecade, isPast }: TimeBucketProps) {
  const opacity = isPast ? "opacity-50" : "opacity-100"
  const borderColor = isCurrentDecade ? "border-blue-500" : "border-slate-300"
  const bgColor = isPast ? "bg-slate-100" : isCurrentDecade ? "bg-blue-50" : "bg-white"

  return (
    <div className={`relative flex-shrink-0 w-full md:w-64 ${opacity} transition-opacity`}>
      {/* Decade Label */}
      <div className="absolute -top-6 left-1/2 md:left-1/2 transform -translate-x-1/2 text-lg font-bold text-slate-700">
        {bucket.decade}代
      </div>

      {/* Bucket Card */}
      <div
        className={`${bgColor} border-2 ${borderColor} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
      >
        {/* Total Steps */}
        <div className="mb-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-slate-800">
            {bucket.totalSteps.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">ステップ</div>
        </div>

        {/* Event List */}
        <div className="space-y-2">
          {bucket.events.slice(0, 3).map((event) => (
            <div key={event.id} className="flex items-center justify-between text-sm">
              <span className="truncate flex-1 text-slate-700">{event.name}</span>
              <span className="ml-2 font-medium text-slate-900">
                {(
                  event.frequency *
                  (event.endAge - Math.max(event.startAge, bucket.decade))
                ).toLocaleString()}
              </span>
            </div>
          ))}
          {bucket.events.length > 3 && (
            <div className="text-sm text-slate-500 text-center">
              他 {bucket.events.length - 3} 件
            </div>
          )}
        </div>

        {/* Visual Steps */}
        <div className="mt-4 flex flex-wrap gap-1 justify-center">
          {Array.from({ length: Math.min(20, Math.floor(bucket.totalSteps / 50)) }).map((_, i) => (
            <div
              key={`step-${bucket.decade}-${i}`}
              className={`w-2 h-2 rounded-full ${isPast ? "bg-slate-300" : "bg-blue-400"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
