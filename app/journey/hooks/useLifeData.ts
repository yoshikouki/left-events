"use client"

import { useCallback, useEffect, useState } from "react"
import type { LifeEvent } from "../types"

const STORAGE_KEY = "life-journey:events"
const DEFAULT_AGE = 35

export function useLifeData() {
  const [currentAge, setCurrentAge] = useState(DEFAULT_AGE)
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setEvents(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (typeof window === "undefined" || isLoading) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (error) {
      console.error("Failed to save events:", error)
    }
  }, [events, isLoading])

  const addEvent = useCallback((event: LifeEvent) => {
    setEvents((prev) => [...prev, event])
  }, [])

  const removeEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }, [])

  const updateEvent = useCallback((eventId: string, updates: Partial<LifeEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...updates } : e)))
  }, [])

  return {
    currentAge,
    setCurrentAge,
    events,
    addEvent,
    removeEvent,
    updateEvent,
    isLoading,
  }
}
