"use client"

import { useState } from "react"
import type { Experience } from "@/app/(shared)/types"
import { DEFAULT_CATEGORIES } from "@/app/(shared)/types"

interface ExperienceFormProps {
  initialData?: Partial<Experience>
  onSubmit: (data: Partial<Experience>) => Promise<void>
  onCancel?: () => void
}

export function ExperienceForm({ initialData, onSubmit, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState<Partial<Experience>>({
    title: "",
    description: "",
    date: new Date(),
    category: DEFAULT_CATEGORIES[0],
    participants: [],
    location: "",
    emotions: [],
    isPrivate: true,
    ...initialData,
  })

  const [newParticipant, setNewParticipant] = useState("")
  const [newEmotion, setNewEmotion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addParticipant = () => {
    if (newParticipant.trim()) {
      setFormData({
        ...formData,
        participants: [
          ...(formData.participants || []),
          { id: Date.now().toString(), name: newParticipant.trim() },
        ],
      })
      setNewParticipant("")
    }
  }

  const removeParticipant = (id: string) => {
    setFormData({
      ...formData,
      participants: formData.participants?.filter((p) => p.id !== id),
    })
  }

  const addEmotion = () => {
    if (newEmotion.trim() && !formData.emotions?.includes(newEmotion.trim())) {
      setFormData({
        ...formData,
        emotions: [...(formData.emotions || []), newEmotion.trim()],
      })
      setNewEmotion("")
    }
  }

  const removeEmotion = (emotion: string) => {
    setFormData({
      ...formData,
      emotions: formData.emotions?.filter((e) => e !== emotion),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          タイトル *
        </label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="例：家族で行った初めての北海道旅行"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          詳細
        </label>
        <textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="その時の思い出や感じたことを記録しましょう"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-2">
          日付 *
        </label>
        <input
          id="date"
          type="date"
          required
          value={formData.date ? new Date(formData.date).toISOString().split("T")[0] : ""}
          onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2">
          カテゴリ *
        </label>
        <select
          id="category"
          value={formData.category?.id}
          onChange={(e) => {
            const category = DEFAULT_CATEGORIES.find((c) => c.id === e.target.value)
            if (category) setFormData({ ...formData, category })
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {DEFAULT_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.emoji} {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="block text-sm font-medium mb-2">一緒にいた人</p>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addParticipant()
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="名前を入力"
            />
            <button
              type="button"
              onClick={addParticipant}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              追加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.participants?.map((participant) => (
              <span
                key={participant.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {participant.name}
                <button
                  type="button"
                  onClick={() => removeParticipant(participant.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          場所
        </label>
        <input
          id="location"
          type="text"
          value={formData.location || ""}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="例：北海道札幌市"
        />
      </div>

      <div>
        <p className="block text-sm font-medium mb-2">感情タグ</p>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newEmotion}
              onChange={(e) => setNewEmotion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addEmotion()
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="例：感動、楽しい、新鮮"
            />
            <button
              type="button"
              onClick={addEmotion}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              追加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.emotions?.map((emotion) => (
              <span
                key={emotion}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700"
              >
                {emotion}
                <button
                  type="button"
                  onClick={() => removeEmotion(emotion)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!formData.isPrivate}
            onChange={(e) => setFormData({ ...formData, isPrivate: !e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm">この経験を他の人と共有可能にする</span>
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "保存中..." : "保存"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
