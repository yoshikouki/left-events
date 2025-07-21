export interface Person {
  id: string
  name?: string
  birthYear: number
  relation: "self" | "parent" | "child" | "partner" | "friend" | "other"
  createdAt: string
  updatedAt: string
}

export interface RecurringEvent {
  id: string
  name: string
  frequency: number // 年間の回数
  description?: string
  createdAt: string
  updatedAt: string
}

export interface PersonEvent {
  id: string
  personId: string
  eventId: string
  untilAge?: number // この年齢まで続ける
  createdAt: string
  updatedAt: string
}

export interface RemainingCount {
  person: Person
  event: RecurringEvent
  personEvent: PersonEvent
  remainingCount: number
  yearsRemaining: number
}
