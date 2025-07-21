import type { Person, PersonEvent, RecurringEvent } from "@/app/(shared)/types/models"
import type { StorageAdapter } from "./types"

const STORAGE_KEYS = {
  PERSONS: "left-events:persons",
  EVENTS: "left-events:events",
  PERSON_EVENTS: "left-events:person-events",
} as const

export class LocalStorageAdapter implements StorageAdapter {
  private isClient = typeof window !== "undefined"

  private getItem<T>(key: string): T | null {
    if (!this.isClient) return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isClient) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Failed to save to localStorage: ${key}`, error)
    }
  }

  // Person
  async savePerson(person: Person): Promise<void> {
    const persons = await this.getAllPersons()
    const index = persons.findIndex((p) => p.id === person.id)
    if (index >= 0) {
      persons[index] = person
    } else {
      persons.push(person)
    }
    this.setItem(STORAGE_KEYS.PERSONS, persons)
  }

  async getPerson(id: string): Promise<Person | null> {
    const persons = await this.getAllPersons()
    return persons.find((p) => p.id === id) || null
  }

  async getAllPersons(): Promise<Person[]> {
    return this.getItem<Person[]>(STORAGE_KEYS.PERSONS) || []
  }

  async deletePerson(id: string): Promise<void> {
    const persons = await this.getAllPersons()
    const filtered = persons.filter((p) => p.id !== id)
    this.setItem(STORAGE_KEYS.PERSONS, filtered)

    // Delete related PersonEvents
    const personEvents = await this.getAllPersonEvents()
    const filteredEvents = personEvents.filter((pe) => pe.personId !== id)
    this.setItem(STORAGE_KEYS.PERSON_EVENTS, filteredEvents)
  }

  // RecurringEvent
  async saveEvent(event: RecurringEvent): Promise<void> {
    const events = await this.getAllEvents()
    const index = events.findIndex((e) => e.id === event.id)
    if (index >= 0) {
      events[index] = event
    } else {
      events.push(event)
    }
    this.setItem(STORAGE_KEYS.EVENTS, events)
  }

  async getEvent(id: string): Promise<RecurringEvent | null> {
    const events = await this.getAllEvents()
    return events.find((e) => e.id === id) || null
  }

  async getAllEvents(): Promise<RecurringEvent[]> {
    return this.getItem<RecurringEvent[]>(STORAGE_KEYS.EVENTS) || []
  }

  async deleteEvent(id: string): Promise<void> {
    const events = await this.getAllEvents()
    const filtered = events.filter((e) => e.id !== id)
    this.setItem(STORAGE_KEYS.EVENTS, filtered)

    // Delete related PersonEvents
    const personEvents = await this.getAllPersonEvents()
    const filteredEvents = personEvents.filter((pe) => pe.eventId !== id)
    this.setItem(STORAGE_KEYS.PERSON_EVENTS, filteredEvents)
  }

  // PersonEvent
  async savePersonEvent(personEvent: PersonEvent): Promise<void> {
    const personEvents = await this.getAllPersonEvents()
    const index = personEvents.findIndex((pe) => pe.id === personEvent.id)
    if (index >= 0) {
      personEvents[index] = personEvent
    } else {
      personEvents.push(personEvent)
    }
    this.setItem(STORAGE_KEYS.PERSON_EVENTS, personEvents)
  }

  async getPersonEvent(id: string): Promise<PersonEvent | null> {
    const personEvents = await this.getAllPersonEvents()
    return personEvents.find((pe) => pe.id === id) || null
  }

  async getPersonEventsByPerson(personId: string): Promise<PersonEvent[]> {
    const personEvents = await this.getAllPersonEvents()
    return personEvents.filter((pe) => pe.personId === personId)
  }

  async getPersonEventsByEvent(eventId: string): Promise<PersonEvent[]> {
    const personEvents = await this.getAllPersonEvents()
    return personEvents.filter((pe) => pe.eventId === eventId)
  }

  async deletePersonEvent(id: string): Promise<void> {
    const personEvents = await this.getAllPersonEvents()
    const filtered = personEvents.filter((pe) => pe.id !== id)
    this.setItem(STORAGE_KEYS.PERSON_EVENTS, filtered)
  }

  async clear(): Promise<void> {
    if (!this.isClient) return
    localStorage.removeItem(STORAGE_KEYS.PERSONS)
    localStorage.removeItem(STORAGE_KEYS.EVENTS)
    localStorage.removeItem(STORAGE_KEYS.PERSON_EVENTS)
  }

  // Helper method
  private async getAllPersonEvents(): Promise<PersonEvent[]> {
    return this.getItem<PersonEvent[]>(STORAGE_KEYS.PERSON_EVENTS) || []
  }
}
