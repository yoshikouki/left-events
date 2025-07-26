"use client"

import { useEffect, useState } from "react"

interface WindowSize {
  width: number
  height: number
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // デバウンス処理
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 150)
    }

    window.addEventListener("resize", debouncedResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return windowSize
}
