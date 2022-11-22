import { createClient } from 'contentful-management'

const client = createClient({
  accessToken: 'CFPAT-70dkQZ7ta2SQCUWWgoamQkkiezW-zUpLcNZX-ptfzPI' ,
})

export const getItemById = (id: string): Promise<any> => {
  return client.getSpace('g5vcvjt0rgq7')
    .then((space) => space.getEnvironment('master'))
    .then(environment => environment.getEntry(id))
    .then(entry => entry, reason => null)
    .catch(console.error)
}


export const createEvent = (type: string, id: string, event: object) => {
  client.getSpace('g5vcvjt0rgq7')
    .then((space) => space.getEnvironment('master'))
    .then((environment) => environment.createEntryWithId(type.toLocaleLowerCase(), id, {
      fields: {
        ...event
      }
    }))
    .then((entry) => { entry.publish(); return entry })
    .catch(console.error)
}

export const updateEvent = (id: string, event: object) => {
  return client.getSpace('g5vcvjt0rgq7')
    .then(space => space.getEnvironment('master'))
    .then(environment => environment.getEntry(id))
    .then(entry => {
      entry.fields = { ...event }
      return entry.update()

    }).then((entry) => {entry.publish()})
    .then(result => true, reason => false)
    .catch(error => console.error(error.message))
}

export const deleteEventByID = (id: string): Promise<boolean | void> => {
  return client.getSpace('g5vcvjt0rgq7')
    .then(space => space.getEnvironment('master'))
    .then(environment => environment.getEntry(id))
    .then(entry => entry.unpublish())
    .then(entry => entry.delete())
    .then(result => true, reason => false)
    .catch(error => console.error(error.message))
}

export const isEventWithIDExist = (id: string): Promise<boolean | void> => {
  return client.getSpace('g5vcvjt0rgq7')
    .then((space) => space.getEnvironment('master'))
    .then(environment => environment.getEntry(id, { locale: 'en-US' }))
    .then(result => { return true },
      reason => { return false })
    .catch(console.error)
}
