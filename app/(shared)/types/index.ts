export interface LifeEvent {
  id: string
  name: string
  annualFrequency: number
  category: "milestone" | "routine" | "special"
}

export interface Person {
  id: string
  name: string
  birthYear: number
  relationship: "self" | "child" | "parent" | "partner" | "friend" | "other"
}

export interface PersonEvent {
  eventId: string
  personId: string
  untilAge?: number
}

export interface LifeMilestone {
  name: string
  targetAge: number
  description?: string
}
