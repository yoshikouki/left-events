import type { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  size?: "small" | "medium" | "large"
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-500",
    ghost: "text-blue-500 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-500",
  }

  const sizeStyles = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  )
}
