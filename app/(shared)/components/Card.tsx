import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}
