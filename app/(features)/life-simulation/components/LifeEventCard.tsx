import { AlertCircle, Calendar, Clock, Edit2, Star, Trash2 } from "lucide-react"
import type { LifeEvent } from "@/app/(shared)/types"

interface LifeEventCardProps {
  event: LifeEvent
  remainingCount: number
  onEdit?: () => void
  onDelete?: () => void
}

export function LifeEventCard({ event, remainingCount, onEdit, onDelete }: LifeEventCardProps) {
  const importanceColors = {
    high: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: "text-red-500",
    },
    medium: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      icon: "text-yellow-500",
    },
    low: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: "text-green-500",
    },
  }

  const colors = importanceColors[event.importance]
  const isUrgent = remainingCount < 10

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-6 relative`}>
      {isUrgent && (
        <div className="absolute top-2 right-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className={`w-4 h-4 ${colors.icon}`} />
          <span className="text-gray-700">
            頻度:{" "}
            {event.averageFrequency < 1
              ? `${Math.round(12 / event.averageFrequency)}ヶ月に1回`
              : event.averageFrequency === 1
                ? "年1回"
                : `年${event.averageFrequency}回`}
          </span>
        </div>

        {event.lastOccurrence && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className={`w-4 h-4 ${colors.icon}`} />
            <span className="text-gray-700">
              最後: {new Date(event.lastOccurrence).toLocaleDateString("ja-JP")}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <Star className={`w-4 h-4 ${colors.icon}`} />
          <span className={colors.text}>
            重要度:{" "}
            {event.importance === "high" ? "高" : event.importance === "medium" ? "中" : "低"}
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">あと約 {remainingCount} 回</p>
            {isUrgent && <p className="text-sm text-orange-600 mt-1">残り少なくなっています</p>}
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <Edit2 className="w-3 h-3" />
                  編集
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-3 h-3" />
                  削除
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
