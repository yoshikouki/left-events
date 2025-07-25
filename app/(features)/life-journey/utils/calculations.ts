import type { Person, PersonEvent, RecurringEvent } from "@/app/(shared)/types/models"

export interface TimeBucket {
  decade: number // 30, 40, 50...
  label: string // "30代", "40代"...
  events: EventWithCount[]
  totalSteps: number
  isPast: boolean
  isCurrent: boolean
  isFuture: boolean
}

export interface EventWithCount {
  event: RecurringEvent
  personEvent?: PersonEvent
  person?: Person
  remainingCount: number
  totalCount: number // この10年間での総回数
}

export function createTimeBuckets(
  self: Person,
  currentAge: number,
  events: RecurringEvent[],
  personEvents: PersonEvent[],
  persons: Person[],
): TimeBucket[] {
  const buckets: TimeBucket[] = []
  const currentDecade = Math.floor(currentAge / 10) * 10

  // 現在の10年区間を中心に前後2つずつ、計5つのバケットを作成
  for (let i = -2; i <= 2; i++) {
    const decade = currentDecade + i * 10
    if (decade < 0 || decade > 90) continue

    const bucket: TimeBucket = {
      decade,
      label: `${decade}代`,
      events: [],
      totalSteps: 0,
      isPast: decade < currentDecade,
      isCurrent: decade === currentDecade,
      isFuture: decade > currentDecade,
    }

    // このバケットの年齢範囲
    const startAge = decade
    const endAge = decade + 9

    // 各イベントについて、このバケット内での回数を計算
    events.forEach((event) => {
      const relevantPersonEvents = personEvents.filter((pe) => pe.eventId === event.id)

      relevantPersonEvents.forEach((pe) => {
        const person = persons.find((p) => p.id === pe.personId)
        if (!person) return

        // 終了年齢の決定
        let untilAge = 100
        if (pe.untilAge) {
          untilAge = pe.untilAge
        } else if (person.id === self.id) {
          untilAge = 100
        }

        // このバケット内での開始年齢と終了年齢
        const bucketStartAge = Math.max(startAge, currentAge)
        const bucketEndAge = Math.min(endAge, untilAge)

        if (bucketStartAge <= bucketEndAge) {
          const yearsInBucket = bucketEndAge - bucketStartAge + 1
          const totalCount = Math.floor(event.frequency * yearsInBucket)

          if (totalCount > 0) {
            bucket.events.push({
              event,
              personEvent: pe,
              person,
              remainingCount: totalCount,
              totalCount,
            })
            bucket.totalSteps += totalCount
          }
        }
      })
    })

    buckets.push(bucket)
  }

  return buckets.sort((a, b) => a.decade - b.decade)
}

export function calculateLifeProgress(birthYear: number): number {
  const currentYear = new Date().getFullYear()
  const age = currentYear - birthYear
  const assumedLifespan = 100
  return Math.min((age / assumedLifespan) * 100, 100)
}
