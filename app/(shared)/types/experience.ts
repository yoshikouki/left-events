export interface Experience {
  id: string
  userId: string
  title: string
  description?: string
  date: Date
  imageUrls?: string[]
  category: Category
  participants?: Participant[]
  location?: string
  emotions?: string[]
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  emoji?: string
  userId?: string // カスタムカテゴリの場合
  isSystem: boolean // システムデフォルトカテゴリかどうか
}

export interface Participant {
  id: string
  name: string
  relationship?: string // 「母」「友人」など
  email?: string
}

export interface ExperienceShare {
  id: string
  experienceId: string
  sharedBy: string
  sharedWith: string[]
  shareUrl: string
  expiresAt?: Date
  createdAt: Date
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "adventure", name: "冒険", color: "#60A5FA", emoji: "🗺️", isSystem: true },
  { id: "challenge", name: "挑戦", color: "#F87171", emoji: "🎯", isSystem: true },
  { id: "sharing", name: "分かち合い", color: "#34D399", emoji: "🤝", isSystem: true },
  { id: "learning", name: "学び", color: "#A78BFA", emoji: "📚", isSystem: true },
  { id: "travel", name: "旅行", color: "#FBBF24", emoji: "✈️", isSystem: true },
  { id: "family", name: "家族", color: "#FB7185", emoji: "👨‍👩‍👧‍👦", isSystem: true },
]
