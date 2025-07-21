import { Edit2, Lock, MapPin, Trash2, Users } from "lucide-react"
import type { Experience } from "@/app/(shared)/types"

interface ExperienceCardProps {
  experience: Experience
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function ExperienceCard({ experience, onClick, onEdit, onDelete }: ExperienceCardProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date)
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <article
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{experience.title}</h3>
          <p className="text-sm text-gray-600">{formatDate(experience.date)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: `${experience.category.color}20`,
              color: experience.category.color,
            }}
          >
            {experience.category.emoji} {experience.category.name}
          </span>
          {experience.isPrivate && (
            <span title="プライベート">
              <Lock className="w-4 h-4 text-gray-400" />
            </span>
          )}
        </div>
      </div>

      {experience.description && (
        <p className="text-gray-700 mb-4 line-clamp-2">{experience.description}</p>
      )}

      <div className="space-y-3">
        {experience.participants && experience.participants.length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {experience.participants.map((participant) => (
                <span
                  key={participant.id}
                  className="inline-block px-2 py-1 bg-gray-100 rounded text-xs"
                >
                  {participant.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {experience.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{experience.location}</span>
          </div>
        )}

        {experience.emotions && experience.emotions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {experience.emotions.map((emotion) => (
              <span
                key={emotion}
                className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
              >
                {emotion}
              </span>
            ))}
          </div>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <Edit2 className="w-3 h-3" />
              編集
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-3 h-3" />
              削除
            </button>
          )}
        </div>
      )}
    </article>
  )
}
