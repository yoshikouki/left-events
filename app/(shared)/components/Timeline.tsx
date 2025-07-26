"use client"

import { motion } from "framer-motion"
import type { LifeMilestone } from "@/app/(shared)/types"

interface TimelineProps {
  currentAge: number
  milestones: LifeMilestone[]
  maxAge?: number
}

export function Timeline({ currentAge, milestones, maxAge = 100 }: TimelineProps) {
  const getPositionPercentage = (age: number) => ((age - 0) / (maxAge - 0)) * 100

  const sortedMilestones = [...milestones]
    .filter((m) => m.targetAge > currentAge)
    .sort((a, b) => a.targetAge - b.targetAge)

  return (
    <div className="relative w-full bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 overflow-x-auto">
      {/* タイムラインの背景 */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden min-w-[300px]">
        {/* 経過した部分 */}
        <motion.div
          className="absolute left-0 top-0 h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${getPositionPercentage(currentAge)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* 現在地のマーカー */}
      <motion.div
        className="absolute top-6 transform -translate-x-1/2"
        style={{ left: `${getPositionPercentage(currentAge)}%` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="relative">
          <div className="w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-100" />
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="text-xs sm:text-sm font-medium text-blue-600">現在</div>
            <div className="text-xs text-gray-600">{currentAge}歳</div>
          </div>
        </div>
      </motion.div>

      {/* マイルストーンマーカー */}
      {sortedMilestones.map((milestone, index) => (
        <motion.div
          key={milestone.name}
          className="absolute top-6 transform -translate-x-1/2"
          style={{ left: `${getPositionPercentage(milestone.targetAge)}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
        >
          <div className="relative">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
              <div className="text-xs font-medium text-gray-700 hidden sm:block">
                {milestone.name}
              </div>
              <div className="text-xs text-gray-500">{milestone.targetAge}歳</div>
              <div className="text-xs text-gray-500 hidden sm:block">
                あと{milestone.targetAge - currentAge}年
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* 年齢の目盛り */}
      <div className="absolute w-full top-0 flex justify-between text-xs text-gray-400 mt-1 min-w-[300px]">
        <span>0</span>
        <span className="hidden sm:inline">25</span>
        <span>50</span>
        <span className="hidden sm:inline">75</span>
        <span>100</span>
      </div>
    </div>
  )
}
