"use client"

import { useMemo } from "react"
import type { Experience } from "@/app/(shared)/types"

interface TimelineChartProps {
  experiences: Experience[]
}

export function TimelineChart({ experiences }: TimelineChartProps) {
  const monthlyData = useMemo(() => {
    const monthCounts: Record<string, number> = {}

    experiences.forEach((exp) => {
      const date = new Date(exp.date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthCounts[key] = (monthCounts[key] || 0) + 1
    })

    // 過去12ヶ月のデータを生成
    const months: { key: string; label: string; count: number }[] = []
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const label = `${date.getMonth() + 1}月`
      months.push({
        key,
        label,
        count: monthCounts[key] || 0,
      })
    }

    return months
  }, [experiences])

  const maxCount = Math.max(...monthlyData.map((d) => d.count), 1)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">月別経験数（過去12ヶ月）</h3>
      <div className="relative">
        <div className="flex items-end gap-2 h-32">
          {monthlyData.map(({ key, label, count }) => (
            <div key={key} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t transition-all duration-500"
                style={{
                  height: `${(count / maxCount) * 100}%`,
                  minHeight: count > 0 ? "4px" : "0",
                }}
              />
              <span className="text-xs text-gray-600 mt-1">{label}</span>
              {count > 0 && <span className="text-xs text-gray-800 font-medium">{count}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
