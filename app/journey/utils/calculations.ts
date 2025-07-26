import type { LifeEvent, TimeBucket } from "../types"

export function calculateTimeBuckets(
  _currentAge: number,
  events: LifeEvent[],
  maxAge: number = 90,
): TimeBucket[] {
  const buckets: TimeBucket[] = []

  // Create buckets for each decade
  for (let decade = 0; decade <= maxAge; decade += 10) {
    const bucketEvents = events.filter(
      (event) => event.startAge < decade + 10 && event.endAge > decade,
    )

    // Calculate total steps for this decade
    let totalSteps = 0
    bucketEvents.forEach((event) => {
      const startInDecade = Math.max(event.startAge, decade)
      const endInDecade = Math.min(event.endAge, decade + 10)
      const yearsInDecade = Math.max(0, endInDecade - startInDecade)
      totalSteps += event.frequency * yearsInDecade
    })

    buckets.push({
      decade,
      events: bucketEvents,
      totalSteps,
    })
  }

  return buckets
}

export function calculateRemainingSteps(event: LifeEvent, currentAge: number): number {
  if (currentAge >= event.endAge) return 0

  const remainingYears = event.endAge - Math.max(currentAge, event.startAge)
  return Math.max(0, event.frequency * remainingYears)
}

export function getCategoryColor(category: LifeEvent["category"]): string {
  const colors = {
    health: "bg-green-500",
    family: "bg-red-500",
    career: "bg-blue-500",
    hobby: "bg-purple-500",
    travel: "bg-yellow-500",
    other: "bg-gray-500",
  }
  return colors[category]
}
