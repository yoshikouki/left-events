import type { LifeEvent, Person, PersonEvent } from "../types"

const STORAGE_KEYS = {
  EVENTS: "life-events",
  PEOPLE: "people",
  PERSON_EVENTS: "person-events",
  USER_AGE: "user-age",
} as const

export class LocalStorageAdapter {
  private isClient = typeof window !== "undefined"

  getEvents(): LifeEvent[] {
    if (!this.isClient) return []
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS)
    return data ? JSON.parse(data) : []
  }

  saveEvents(events: LifeEvent[]): void {
    if (!this.isClient) return
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events))
  }

  getPeople(): Person[] {
    if (!this.isClient) return []
    const data = localStorage.getItem(STORAGE_KEYS.PEOPLE)
    return data ? JSON.parse(data) : []
  }

  savePeople(people: Person[]): void {
    if (!this.isClient) return
    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people))
  }

  getPersonEvents(): PersonEvent[] {
    if (!this.isClient) return []
    const data = localStorage.getItem(STORAGE_KEYS.PERSON_EVENTS)
    return data ? JSON.parse(data) : []
  }

  savePersonEvents(personEvents: PersonEvent[]): void {
    if (!this.isClient) return
    localStorage.setItem(STORAGE_KEYS.PERSON_EVENTS, JSON.stringify(personEvents))
  }

  getUserAge(): number {
    if (!this.isClient) return 35
    const age = localStorage.getItem(STORAGE_KEYS.USER_AGE)
    return age ? parseInt(age, 10) : 35
  }

  saveUserAge(age: number): void {
    if (!this.isClient) return
    localStorage.setItem(STORAGE_KEYS.USER_AGE, age.toString())
  }
}

export const storage = new LocalStorageAdapter()
