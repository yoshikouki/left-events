"use client"

import { useState } from "react"
import type { Experience } from "@/app/(shared)/types"
import { ExperienceDetail } from "./components/ExperienceDetail"
import { ExperienceForm } from "./components/ExperienceForm"
import { ExperienceList } from "./components/ExperienceList"

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

  const handleCreateExperience = async (data: Partial<Experience>) => {
    const newExperience: Experience = {
      ...data,
      id: Date.now().toString(),
      userId: "user-1", // TODO: 実際のユーザーIDを使用
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Experience

    setExperiences([newExperience, ...experiences])
    setShowForm(false)
  }

  const handleUpdateExperience = async (data: Partial<Experience>) => {
    if (!editingExperience) return

    const updatedExperience: Experience = {
      ...editingExperience,
      ...data,
      updatedAt: new Date(),
    }

    setExperiences(
      experiences.map((exp) => (exp.id === updatedExperience.id ? updatedExperience : exp)),
    )
    setEditingExperience(null)
    setSelectedExperience(null)
  }

  const handleDeleteExperience = (experience: Experience) => {
    if (confirm(`「${experience.title}」を削除しますか？`)) {
      setExperiences(experiences.filter((exp) => exp.id !== experience.id))
    }
  }

  const handleEditFromDetail = () => {
    if (selectedExperience) {
      setEditingExperience(selectedExperience)
      setSelectedExperience(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">あなたの経験</h1>
          <p className="text-gray-600">
            人生の大切な瞬間を記録し、振り返ることで新たな気づきを得ましょう
          </p>
        </div>

        {!showForm && !editingExperience && (
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm"
            >
              新しい経験を記録
            </button>
          </div>
        )}

        {(showForm || editingExperience) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingExperience ? "経験を編集" : "新しい経験を記録"}
            </h2>
            <ExperienceForm
              initialData={editingExperience || undefined}
              onSubmit={editingExperience ? handleUpdateExperience : handleCreateExperience}
              onCancel={() => {
                setShowForm(false)
                setEditingExperience(null)
              }}
            />
          </div>
        )}

        <ExperienceList
          experiences={experiences}
          onExperienceClick={setSelectedExperience}
          onExperienceEdit={setEditingExperience}
          onExperienceDelete={handleDeleteExperience}
        />

        {selectedExperience && (
          <ExperienceDetail
            experience={selectedExperience}
            onClose={() => setSelectedExperience(null)}
            onEdit={handleEditFromDetail}
            onShare={() => {
              // TODO: 共有機能の実装
              alert("共有機能は準備中です")
            }}
          />
        )}
      </div>
    </div>
  )
}
