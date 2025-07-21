export interface ExperienceStatistics {
  userId: string
  totalExperiences: number
  experiencesByCategory: CategoryCount[]
  experiencesByYear: YearCount[]
  experiencesByMonth: MonthCount[]
  topParticipants: ParticipantCount[]
  emotionFrequency: EmotionCount[]
  lastUpdated: Date
}

export interface CategoryCount {
  category: string
  count: number
  percentage: number
}

export interface YearCount {
  year: number
  count: number
}

export interface MonthCount {
  year: number
  month: number
  count: number
}

export interface ParticipantCount {
  participant: string
  count: number
}

export interface EmotionCount {
  emotion: string
  count: number
}

export interface Feedback {
  id: string
  userId: string
  type: "achievement" | "milestone" | "suggestion" | "reflection"
  title: string
  message: string
  relatedExperienceIds?: string[]
  isRead: boolean
  createdAt: Date
}
