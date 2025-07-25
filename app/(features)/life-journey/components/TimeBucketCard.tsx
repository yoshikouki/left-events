"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Calendar, ChevronDown, ChevronUp, Users } from "lucide-react"
import { useState } from "react"
import type { TimeBucket } from "../utils/calculations"

interface TimeBucketCardProps {
  bucket: TimeBucket
  currentAge: number
}

export function TimeBucketCard({ bucket }: TimeBucketCardProps) {
  const [isExpanded, setIsExpanded] = useState(bucket.isCurrent)

  const getBucketStyle = () => {
    if (bucket.isPast) return "bg-gray-100 border-gray-300"
    if (bucket.isCurrent) return "bg-blue-50 border-blue-400 shadow-lg"
    return "bg-white border-gray-200"
  }

  const getStepColor = () => {
    if (bucket.isPast) return "text-gray-400"
    if (bucket.isCurrent) return "text-blue-600"
    return "text-gray-700"
  }

  return (
    <div className={`relative ${bucket.isCurrent ? "z-10" : ""}`}>
      {/* 接続点 */}
      <div className="absolute left-1/2 top-8 w-4 h-4 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`w-full h-full rounded-full border-2 ${
            bucket.isPast
              ? "bg-gray-300 border-gray-400"
              : bucket.isCurrent
                ? "bg-blue-500 border-blue-600"
                : "bg-white border-gray-400"
          }`}
        />
      </div>

      {/* カード */}
      <motion.div
        className={`mx-auto max-w-2xl rounded-lg border-2 p-6 transition-all ${getBucketStyle()}`}
        whileHover={{ scale: bucket.isCurrent ? 1 : 1.02 }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-xl font-bold ${getStepColor()}`}>
              {bucket.label}
              {bucket.isCurrent && (
                <span className="ml-2 text-sm font-normal text-blue-600">（現在）</span>
              )}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {bucket.events.length}個の予定
              </span>
              <span className="flex items-center gap-1 font-medium">計{bucket.totalSteps}回</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* 歩数ビジュアライゼーション */}
        {!bucket.isPast && bucket.totalSteps > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: Math.min(bucket.totalSteps, 50) }).map((_, i) => (
                <motion.div
                  key={`step-${bucket.decade}-${i}`}
                  className={`w-2 h-2 rounded-full ${
                    bucket.isCurrent ? "bg-blue-400" : "bg-gray-300"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                />
              ))}
              {bucket.totalSteps > 50 && (
                <span className="text-xs text-gray-500 ml-2">+{bucket.totalSteps - 50}</span>
              )}
            </div>
          </div>
        )}

        {/* 展開内容 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t space-y-3">
                {bucket.events.map((item) => (
                  <div
                    key={`${item.event.id}-${item.personEvent?.id}`}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{item.event.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        {item.person && item.person.id !== item.personEvent?.personId && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.person.name || "名前なし"}
                          </span>
                        )}
                        <span>{item.event.frequency}回/年</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          item.remainingCount < 10 ? "text-red-500" : getStepColor()
                        }`}
                      >
                        {item.remainingCount}回
                      </div>
                      <div className="text-xs text-gray-500">この10年間</div>
                    </div>
                  </div>
                ))}

                {bucket.events.length === 0 && (
                  <p className="text-center text-gray-500 py-4">この期間に予定はありません</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
