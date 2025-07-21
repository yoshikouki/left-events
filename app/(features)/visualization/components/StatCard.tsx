interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: string
  color?: string
}

export function StatCard({ title, value, description, icon, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    yellow: "bg-yellow-100 text-yellow-700",
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <span
            className={`text-2xl p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  )
}
