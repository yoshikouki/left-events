"use client"

import { Save } from "lucide-react"
import { useState } from "react"
import type { LifeEvent } from "@/app/(shared)/types"

interface LifeEventFormProps {
  initialData?: Partial<LifeEvent>
  onSubmit: (data: Partial<LifeEvent>) => void
  onCancel: () => void
}

export function LifeEventForm({ initialData, onSubmit, onCancel }: LifeEventFormProps) {
  const [formData, setFormData] = useState<Partial<LifeEvent>>({
    title: "",
    description: "",
    averageFrequency: 1,
    importance: "medium",
    ...initialData,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          イベント
        </label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="親と旅行"
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
          rows={3}
          placeholder="説明"
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-medium mb-2">
          頻度（年間）
        </label>
        <input
          id="frequency"
          type="number"
          required
          min="0.1"
          step="0.1"
          value={formData.averageFrequency}
          onChange={(e) =>
            setFormData({ ...formData, averageFrequency: parseFloat(e.target.value) })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="1"
        />
        <p className="text-xs text-gray-500 mt-1">年1=1、月1=12、週1=52</p>
      </div>

      <div>
        <label htmlFor="lastOccurrence" className="block text-sm font-medium mb-2">
          最終日
        </label>
        <input
          id="lastOccurrence"
          type="date"
          value={
            formData.lastOccurrence
              ? new Date(formData.lastOccurrence).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              lastOccurrence: e.target.value ? new Date(e.target.value) : undefined,
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="importance" className="block text-sm font-medium mb-2">
          重要度
        </label>
        <select
          id="importance"
          value={formData.importance}
          onChange={(e) =>
            setFormData({ ...formData, importance: e.target.value as "high" | "medium" | "low" })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Save className="w-4 h-4" />
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
