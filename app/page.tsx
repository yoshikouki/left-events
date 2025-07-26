"use client"

import { useState } from "react"
import { EventManager } from "./journey/components/EventManager"
import { TimelineView } from "./journey/components/TimelineView"
import { useLifeData } from "./journey/hooks/useLifeData"

export default function HomePage() {
  const { currentAge, events, addEvent } = useLifeData()
  const [showEventManager, setShowEventManager] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Life Journey</h1>
          <p className="text-base md:text-lg text-slate-600 px-4">
            あなたの人生の残りステップを可視化
          </p>
        </header>

        <TimelineView
          currentAge={currentAge}
          events={events}
          onAddEventClick={() => setShowEventManager(true)}
        />

        {showEventManager && (
          <EventManager onClose={() => setShowEventManager(false)} onAddEvent={addEvent} />
        )}
      </div>
    </div>
  )
}
