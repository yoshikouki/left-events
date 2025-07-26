"use client"

import { motion } from "framer-motion"

interface DotMatrixProps {
  total: number
  filled: number
  maxDisplay?: number
  dotSize?: number
  gap?: number
  filledColor?: string
  emptyColor?: string
  shape?: "circle" | "square" | "heart"
}

export function DotMatrix({
  total,
  filled,
  maxDisplay = 100,
  dotSize = 8,
  gap = 4,
  filledColor = "#3B82F6",
  emptyColor = "#E5E7EB",
  shape = "circle",
}: DotMatrixProps) {
  const displayTotal = Math.min(total, maxDisplay)
  const displayFilled = Math.min(filled, displayTotal)
  const columns = Math.ceil(Math.sqrt(displayTotal))
  const rows = Math.ceil(displayTotal / columns)

  const getShape = (isFilled: boolean) => {
    const color = isFilled ? filledColor : emptyColor

    switch (shape) {
      case "square":
        return <rect width={dotSize} height={dotSize} fill={color} rx={1} />
      case "heart":
        return (
          <path
            d={`M${dotSize / 2} ${dotSize * 0.9}C${dotSize * 0.2} ${dotSize * 0.6} 0 ${dotSize * 0.3} 0 ${dotSize * 0.2}C0 0 ${dotSize * 0.2} 0 ${dotSize * 0.3} 0C${dotSize * 0.4} 0 ${dotSize / 2} ${dotSize * 0.1} ${dotSize / 2} ${dotSize * 0.1}C${dotSize / 2} ${dotSize * 0.1} ${dotSize * 0.6} 0 ${dotSize * 0.7} 0C${dotSize * 0.8} 0 ${dotSize} 0 ${dotSize} ${dotSize * 0.2}C${dotSize} ${dotSize * 0.3} ${dotSize * 0.8} ${dotSize * 0.6} ${dotSize / 2} ${dotSize * 0.9}Z`}
            fill={color}
          />
        )
      default:
        return <circle cx={dotSize / 2} cy={dotSize / 2} r={dotSize / 2} fill={color} />
    }
  }

  return (
    <div className="inline-block">
      <svg
        width={columns * (dotSize + gap) - gap}
        height={rows * (dotSize + gap) - gap}
        className="overflow-visible"
        role="img"
        aria-label={`ドット表示: ${filled}/${total}`}
      >
        <title>
          ドット表示: {filled}/{total}
        </title>
        {Array.from({ length: displayTotal }).map((_, index) => {
          const row = Math.floor(index / columns)
          const col = index % columns
          const x = col * (dotSize + gap)
          const y = row * (dotSize + gap)
          const isFilled = index < displayFilled

          return (
            <motion.g
              key={`dot-${index}-${filled}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.01,
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <g transform={`translate(${x}, ${y})`}>{getShape(isFilled)}</g>
            </motion.g>
          )
        })}
      </svg>
      {total > maxDisplay && (
        <div className="text-sm text-gray-500 mt-2 text-center">他 {total - maxDisplay} 回</div>
      )}
    </div>
  )
}
