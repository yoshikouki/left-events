import type { Person, PersonEvent, RecurringEvent } from "@/app/(shared)/types/models"

export interface StorageAdapter {
  // Person
  savePerson(person: Person): Promise<void>
  getPerson(id: string): Promise<Person | null>
  getAllPersons(): Promise<Person[]>
  deletePerson(id: string): Promise<void>

  // RecurringEvent
  saveEvent(event: RecurringEvent): Promise<void>
  getEvent(id: string): Promise<RecurringEvent | null>
  getAllEvents(): Promise<RecurringEvent[]>
  deleteEvent(id: string): Promise<void>

  // PersonEvent
  savePersonEvent(personEvent: PersonEvent): Promise<void>
  getPersonEvent(id: string): Promise<PersonEvent | null>
  getPersonEventsByPerson(personId: string): Promise<PersonEvent[]>
  getPersonEventsByEvent(eventId: string): Promise<PersonEvent[]>
  deletePersonEvent(id: string): Promise<void>

  // Bulk operations
  clear(): Promise<void>
}
