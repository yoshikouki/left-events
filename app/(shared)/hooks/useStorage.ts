import { useCallback, useEffect, useState } from "react"
import { getStorageAdapter } from "@/app/(shared)/services/storage"
import type { Person, PersonEvent, RecurringEvent } from "@/app/(shared)/types/models"

export function usePersons() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const storage = getStorageAdapter()

  useEffect(() => {
    storage.getAllPersons().then((data) => {
      setPersons(data)
      setLoading(false)
    })
  }, [storage])

  const savePerson = useCallback(
    async (person: Person) => {
      await storage.savePerson(person)
      const updated = await storage.getAllPersons()
      setPersons(updated)
    },
    [storage],
  )

  const deletePerson = useCallback(
    async (id: string) => {
      await storage.deletePerson(id)
      const updated = await storage.getAllPersons()
      setPersons(updated)
    },
    [storage],
  )

  return { persons, loading, savePerson, deletePerson }
}

export function useEvents() {
  const [events, setEvents] = useState<RecurringEvent[]>([])
  const [loading, setLoading] = useState(true)
  const storage = getStorageAdapter()

  useEffect(() => {
    storage.getAllEvents().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [storage])

  const saveEvent = useCallback(
    async (event: RecurringEvent) => {
      await storage.saveEvent(event)
      const updated = await storage.getAllEvents()
      setEvents(updated)
    },
    [storage],
  )

  const deleteEvent = useCallback(
    async (id: string) => {
      await storage.deleteEvent(id)
      const updated = await storage.getAllEvents()
      setEvents(updated)
    },
    [storage],
  )

  return { events, loading, saveEvent, deleteEvent }
}

export function usePersonEvents() {
  const [personEvents, setPersonEvents] = useState<PersonEvent[]>([])
  const [loading, setLoading] = useState(true)
  const storage = getStorageAdapter()

  const loadPersonEvents = useCallback(async () => {
    const allPersonEvents: PersonEvent[] = []
    const persons = await storage.getAllPersons()
    for (const person of persons) {
      const events = await storage.getPersonEventsByPerson(person.id)
      allPersonEvents.push(...events)
    }
    setPersonEvents(allPersonEvents)
    setLoading(false)
  }, [storage])

  useEffect(() => {
    loadPersonEvents()
  }, [loadPersonEvents])

  const savePersonEvent = useCallback(
    async (personEvent: PersonEvent) => {
      await storage.savePersonEvent(personEvent)
      await loadPersonEvents()
    },
    [loadPersonEvents, storage],
  )

  const deletePersonEvent = useCallback(
    async (id: string) => {
      await storage.deletePersonEvent(id)
      await loadPersonEvents()
    },
    [loadPersonEvents, storage],
  )

  const getByPerson = useCallback(
    (personId: string) => {
      return personEvents.filter((pe) => pe.personId === personId)
    },
    [personEvents],
  )

  const getByEvent = useCallback(
    (eventId: string) => {
      return personEvents.filter((pe) => pe.eventId === eventId)
    },
    [personEvents],
  )

  return {
    personEvents,
    loading,
    savePersonEvent,
    deletePersonEvent,
    getByPerson,
    getByEvent,
  }
}
