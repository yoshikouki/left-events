import type { SelectHTMLAttributes } from "react"
import { useId } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: React.ReactNode
}

export function Select({ label, error, className = "", children, id, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id || generatedId
  const baseClasses = `
    w-full px-3 py-2 
    bg-white dark:bg-gray-800 
    border border-gray-300 dark:border-gray-600 
    rounded-md 
    text-gray-900 dark:text-gray-100 
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    disabled:bg-gray-100 dark:disabled:bg-gray-700 
    disabled:cursor-not-allowed
    transition-colors
  `

  const errorClasses = error
    ? "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500"
    : ""

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${baseClasses} ${errorClasses} ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
