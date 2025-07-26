"use client"

import { useState } from "react"
import { Button } from "@/app/(shared)/components/Button"

interface AgeInputProps {
  initialAge: number
  onAgeChange: (age: number) => void
}

export function AgeInput({ initialAge, onAgeChange }: AgeInputProps) {
  const [age, setAge] = useState(initialAge)
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAgeChange(age)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
      >
        {age}歳
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value) || 0)}
        min="0"
        max="120"
        className="w-20 px-3 py-1.5 text-2xl font-semibold text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-2xl font-semibold text-gray-900">歳</span>
      <Button type="submit" size="small">
        完了
      </Button>
    </form>
  )
}
