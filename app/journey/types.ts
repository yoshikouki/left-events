export interface LifeEvent {
  id: string
  name: string
  category: "health" | "family" | "career" | "hobby" | "travel" | "other"
  frequency: number // 年間回数
  startAge: number
  endAge: number
  priority: "high" | "medium" | "low"
  color?: string
}

export interface TimeBucket {
  decade: number // 30, 40, 50...
  events: LifeEvent[]
  totalSteps: number
}

export interface Person {
  id: string
  name: string
  currentAge: number
  lifeExpectancy: number
}
