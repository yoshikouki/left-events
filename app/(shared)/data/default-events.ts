import type { LifeEvent, LifeMilestone } from "../types"

export const DEFAULT_LIFE_EVENTS: LifeEvent[] = [
  {
    id: "birthday",
    name: "誕生日",
    annualFrequency: 1,
    category: "milestone",
  },
  {
    id: "new-year",
    name: "お正月",
    annualFrequency: 1,
    category: "milestone",
  },
  {
    id: "family-trip",
    name: "家族旅行",
    annualFrequency: 2,
    category: "special",
  },
  {
    id: "cherry-blossom",
    name: "花見",
    annualFrequency: 1,
    category: "special",
  },
  {
    id: "summer-festival",
    name: "夏祭り",
    annualFrequency: 1,
    category: "special",
  },
  {
    id: "christmas",
    name: "クリスマス",
    annualFrequency: 1,
    category: "milestone",
  },
  {
    id: "monthly-dinner",
    name: "月例ディナー",
    annualFrequency: 12,
    category: "routine",
  },
  {
    id: "movie-date",
    name: "映画鑑賞",
    annualFrequency: 6,
    category: "routine",
  },
]

export const LIFE_MILESTONES: LifeMilestone[] = [
  {
    name: "健康寿命",
    targetAge: 72,
    description: "健康で活動的に過ごせる平均年齢",
  },
  {
    name: "定年退職",
    targetAge: 65,
    description: "仕事から解放される年齢",
  },
  {
    name: "平均寿命",
    targetAge: 85,
    description: "日本人の平均寿命",
  },
]
