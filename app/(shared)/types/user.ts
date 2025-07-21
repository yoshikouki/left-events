export interface User {
  id: string
  email: string
  name: string
  birthDate?: Date
  profileImageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface LifeEvent {
  id: string
  userId: string
  title: string // 例：「親と過ごす正月」
  description?: string
  averageFrequency: number // 年間の平均回数
  lastOccurrence?: Date
  estimatedRemainingCount?: number
  category?: string
  importance: "high" | "medium" | "low"
  createdAt: Date
  updatedAt: Date
}

export interface LifeExpectancy {
  currentAge: number
  estimatedLifespan: number // 平均寿命
  remainingYears: number
  confidence: number // 推定の信頼度（0-1）
}
