"use client"

import { useMemo } from "react"
import type { Experience } from "@/app/(shared)/types"

interface ExperienceChartProps {
  experiences: Experience[]
}

export function ExperienceChart({ experiences }: ExperienceChartProps) {
  const categoryData = useMemo(() => {
    const counts = experiences.reduce(
      (acc, exp) => {
        const categoryId = exp.category.id
        acc[categoryId] = (acc[categoryId] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const total = experiences.length
    const data = Object.entries(counts).map(([categoryId, count]) => {
      const category = experiences.find((exp) => exp.category.id === categoryId)?.category
      return {
        category: category || {
          id: categoryId,
          name: "不明",
          color: "#666",
          emoji: "❓",
          isSystem: false,
        },
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }
    })

    return data.sort((a, b) => b.count - a.count)
  }, [experiences])

  const maxCount = Math.max(...categoryData.map((d) => d.count), 1)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">カテゴリ別経験数</h3>
      {categoryData.length === 0 ? (
        <p className="text-gray-500 text-center py-8">まだデータがありません</p>
      ) : (
        <div className="space-y-4">
          {categoryData.map(({ category, count, percentage }) => (
            <div key={category.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span>{category.emoji}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {count}件 ({percentage}%)
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
