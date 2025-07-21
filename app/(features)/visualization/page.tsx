"use client"

import { ArrowRight, BookOpen, Calendar, MapPin, Users } from "lucide-react"
import { useMemo, useState } from "react"
import type { Experience } from "@/app/(shared)/types"
import { ExperienceChart } from "./components/ExperienceChart"
import { StatCard } from "./components/StatCard"
import { TimelineChart } from "./components/TimelineChart"

// デモデータ（後で実際のデータ取得に置き換え）
const demoExperiences: Experience[] = []

export default function VisualizationPage() {
  const [experiences] = useState<Experience[]>(demoExperiences)

  const stats = useMemo(() => {
    const total = experiences.length
    const thisYear = experiences.filter(
      (exp) => new Date(exp.date).getFullYear() === new Date().getFullYear(),
    ).length
    const withOthers = experiences.filter(
      (exp) => exp.participants && exp.participants.length > 0,
    ).length
    const uniqueLocations = new Set(
      experiences.filter((exp) => exp.location).map((exp) => exp.location),
    ).size

    return {
      total,
      thisYear,
      withOthers,
      uniqueLocations,
    }
  }, [experiences])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">経験の可視化</h1>
          <p className="text-gray-600">これまでの経験を振り返り、人生のバランスを確認しましょう</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="総経験数"
            value={stats.total}
            description="記録された経験"
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="今年の経験"
            value={stats.thisYear}
            description="今年記録した数"
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="誰かと共有"
            value={stats.withOthers}
            description="誰かと一緒の経験"
            icon={Users}
            color="purple"
          />
          <StatCard
            title="訪れた場所"
            value={stats.uniqueLocations}
            description="ユニークな場所数"
            icon={MapPin}
            color="yellow"
          />
        </div>

        {/* チャート */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ExperienceChart experiences={experiences} />
          <TimelineChart experiences={experiences} />
        </div>

        {/* データがない場合のメッセージ */}
        {experiences.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">
              まだ経験の記録がありません。
              <br />
              経験を記録すると、ここに可視化されたデータが表示されます。
            </p>
            <a
              href="/experiences"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              経験を記録する
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
