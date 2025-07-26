"use client"

import { useState } from "react"
import { Button } from "@/app/(shared)/components/Button"
import { Card } from "@/app/(shared)/components/Card"
import type { Person } from "@/app/(shared)/types"

interface PersonFormProps {
  onSubmit: (person: Omit<Person, "id">) => void
  onCancel: () => void
}

const RELATIONSHIPS = [
  { value: "child", label: "子供" },
  { value: "partner", label: "パートナー" },
  { value: "parent", label: "親" },
  { value: "friend", label: "友人" },
  { value: "other", label: "その他" },
] as const

export function PersonForm({ onSubmit, onCancel }: PersonFormProps) {
  const currentYear = new Date().getFullYear()
  const [name, setName] = useState("")
  const [birthYear, setBirthYear] = useState(currentYear - 10)
  const [relationship, setRelationship] = useState<Person["relationship"]>("child")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name, birthYear, relationship })
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">大切な人を追加</h3>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            名前
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="太郎"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
            生まれ年
          </label>
          <input
            id="birthYear"
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(parseInt(e.target.value) || currentYear)}
            min="1900"
            max={currentYear}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
            関係
          </label>
          <select
            id="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value as Person["relationship"])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {RELATIONSHIPS.map((rel) => (
              <option key={rel.value} value={rel.value}>
                {rel.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1">
            追加
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            キャンセル
          </Button>
        </div>
      </form>
    </Card>
  )
}
