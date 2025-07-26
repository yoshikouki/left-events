"use client"

import { motion } from "framer-motion"

interface CircularProgressProps {
  value: number
  maxValue: number
  size?: number
  strokeWidth?: number
  label?: string
  color?: string
  showPercentage?: boolean
}

export function CircularProgress({
  value,
  maxValue,
  size = 120,
  strokeWidth = 8,
  label,
  color = "#3B82F6",
  showPercentage = false,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min((value / maxValue) * 100, 100)
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        role="img"
        aria-label={`進捗: ${value}/${maxValue}`}
      >
        <title>
          進捗: {value}/{maxValue}
        </title>
        {/* 背景の円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* プログレスの円 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">{value}</div>
        {label && <div className="text-xs text-gray-600 mt-0 sm:mt-1">{label}</div>}
        {showPercentage && (
          <div className="text-xs sm:text-sm text-gray-500">{Math.round(percentage)}%</div>
        )}
      </div>
    </div>
  )
}
