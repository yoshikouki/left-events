import type { InputHTMLAttributes } from "react"
import { useId } from "react"

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function TextInput({ label, error, className = "", id, ...props }: TextInputProps) {
  const generatedId = useId()
  const inputId = id || generatedId
  const baseClasses = `
    w-full px-3 py-2 
    bg-white dark:bg-gray-800 
    border border-gray-300 dark:border-gray-600 
    rounded-md 
    text-gray-900 dark:text-gray-100 
    placeholder-gray-500 dark:placeholder-gray-400
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
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${baseClasses} ${errorClasses} ${className}`.trim()}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
