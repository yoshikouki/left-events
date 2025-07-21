"use client"

import { Edit, Lock, MapPin, Share2, X } from "lucide-react"
import type { Experience } from "@/app/(shared)/types"

interface ExperienceDetailProps {
  experience: Experience
  onClose: () => void
  onEdit?: () => void
  onShare?: () => void
}

export function ExperienceDetail({ experience, onClose, onEdit, onShare }: ExperienceDetailProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date)
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{experience.title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <span
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${experience.category.color}20`,
                color: experience.category.color,
              }}
            >
              {experience.category.emoji} {experience.category.name}
            </span>
            <span className="text-gray-600">{formatDate(experience.date)}</span>
            {experience.isPrivate && (
              <span className="flex items-center gap-1 text-gray-400" title="プライベート">
                <Lock className="w-4 h-4" />
                プライベート
              </span>
            )}
          </div>

          {experience.description && (
            <div>
              <h3 className="font-semibold mb-2">詳細</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{experience.description}</p>
            </div>
          )}

          {experience.participants && experience.participants.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">一緒にいた人</h3>
              <div className="flex flex-wrap gap-2">
                {experience.participants.map((participant) => (
                  <span
                    key={participant.id}
                    className="inline-block px-3 py-1 bg-gray-100 rounded-full"
                  >
                    {participant.name}
                    {participant.relationship && (
                      <span className="text-gray-500 text-sm ml-1">
                        ({participant.relationship})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {experience.location && (
            <div>
              <h3 className="font-semibold mb-2">場所</h3>
              <p className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4" />
                {experience.location}
              </p>
            </div>
          )}

          {experience.emotions && experience.emotions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">感情タグ</h3>
              <div className="flex flex-wrap gap-2">
                {experience.emotions.map((emotion) => (
                  <span
                    key={emotion}
                    className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {experience.imageUrls && experience.imageUrls.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">写真</h3>
              <div className="grid grid-cols-2 gap-4">
                {experience.imageUrls.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt={`${experience.title} - 写真`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
            <p>登録日: {formatDate(experience.createdAt)}</p>
            {experience.updatedAt !== experience.createdAt && (
              <p>更新日: {formatDate(experience.updatedAt)}</p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Edit className="w-4 h-4" />
                編集
              </button>
            )}
            {onShare && !experience.isPrivate && (
              <button
                type="button"
                onClick={onShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
              >
                <Share2 className="w-4 h-4" />
                共有
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
