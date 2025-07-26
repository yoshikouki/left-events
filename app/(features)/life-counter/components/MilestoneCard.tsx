"use client"

import { motion } from "framer-motion"
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

  const getColorClass = () => {
    if (isNear) return "from-orange-50 to-orange-100 border-orange-200"
    return "from-blue-50 to-indigo-100 border-blue-200"
  }

  const getTextColor = () => {
    if (isNear) return "text-orange-600"
    return "text-gray-900"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`p-6 bg-gradient-to-br ${getColorClass()} border`}>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{milestone.name}</h3>
            {milestone.description && (
              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <motion.span
                    className={`text-5xl font-bold ${getTextColor()}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    {remainingYears}
                  </motion.span>
                  <span className="text-lg text-gray-600">年</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{milestone.targetAge}歳で迎える</div>
              </div>

              {/* ビジュアルインジケーター */}
              <div className="relative w-24 h-24">
                <svg
                  className="w-full h-full transform -rotate-90"
                  role="img"
                  aria-label={`${milestone.name}まで${remainingYears}年`}
                >
                  <title>
                    {milestone.name}まで{remainingYears}年
                  </title>
                  <circle cx="48" cy="48" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={isNear ? "#EA580C" : "#3B82F6"}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - remainingYears / 50) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
