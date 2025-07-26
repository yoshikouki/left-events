"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia(query)

    // 初期値を設定
    setMatches(media.matches)

    // イベントリスナーを設定
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // modern browsers
    if (media.addEventListener) {
      media.addEventListener("change", listener)
    } else {
      // fallback for older browsers
      media.addListener(listener)
    }

    // クリーンアップ
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [query])

  return matches
}

// 便利なプリセット
export const useIsMobile = () => useMediaQuery("(max-width: 639px)")
export const useIsTablet = () => useMediaQuery("(min-width: 640px) and (max-width: 1023px)")
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)")
