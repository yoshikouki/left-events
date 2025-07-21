"use client"

import { useState } from "react"
import type { Experience } from "@/app/(shared)/types"
import { ExperienceCard } from "./ExperienceCard"

interface ExperienceListProps {
  experiences: Experience[]
  onExperienceClick?: (experience: Experience) => void
  onExperienceEdit?: (experience: Experience) => void
  onExperienceDelete?: (experience: Experience) => void
}

export function ExperienceList({
  experiences,
  onExperienceClick,
  onExperienceEdit,
  onExperienceDelete,
}: ExperienceListProps) {
  const [sortBy, setSortBy] = useState<"date" | "created">("date")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const sortedExperiences = [...experiences].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const filteredExperiences =
    filterCategory === "all"
      ? sortedExperiences
      : sortedExperiences.filter((exp) => exp.category.id === filterCategory)

  const categories = Array.from(new Set(experiences.map((exp) => exp.category.id))).map((id) => {
    const category = experiences.find((exp) => exp.category.id === id)?.category
    return category || { id: "", name: "不明", color: "#666", emoji: "❓", isSystem: false }
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            並び順
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "created")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">経験日順</option>
            <option value="created">登録日順</option>
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ
          </label>
          <select
            id="filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">すべて</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.emoji} {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredExperiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">まだ経験の記録がありません</p>
          <p className="text-sm text-gray-400 mt-2">
            新しい経験を記録して、あなたの人生の物語を始めましょう
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onClick={() => onExperienceClick?.(experience)}
              onEdit={() => onExperienceEdit?.(experience)}
              onDelete={() => onExperienceDelete?.(experience)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
