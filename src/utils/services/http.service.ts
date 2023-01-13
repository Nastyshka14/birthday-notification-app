import { Entry, createClient } from 'contentful-management'
import { IItemFromContentful } from '@domain/types'

const client = createClient({
  accessToken: process.env.REACT_APP_ACCESS_TOKEN,
})

export const getItemById = async (id: string): Promise<void | Entry> => {
  try {
    const space = await client.getSpace(process.env.REACT_APP_SPACE_ID)
    const environment = await space.getEnvironment(process.env.REACT_APP_ENVIRONMENT)
    return await environment.getEntry(id)
  } catch (message) {
    throw new Error(message)
  }
}

export const createEvent = async (type: string, id: string, event: IItemFromContentful): Promise<void | Entry> => {
  try {
    const space = await client.getSpace(process.env.REACT_APP_SPACE_ID)
    const environment = await space.getEnvironment(process.env.REACT_APP_ENVIRONMENT)
    const entry = environment.createEntryWithId(type.toLocaleLowerCase(), id, {
        fields: {
          ...event,
        },
      })
    return (await entry).publish()
  } catch (message) {
    throw new Error(message)
  }
}

export const updateEvent = async (id: string, event: IItemFromContentful): Promise<void> => {
  try {
    const space = await client.getSpace(process.env.REACT_APP_SPACE_ID)
    const environment = await space.getEnvironment(process.env.REACT_APP_ENVIRONMENT)
    const entry = await environment.getEntry(id)
    entry.fields = { ...event }
    const updatedEntry = await entry.update()
    updatedEntry.publish()
  } catch (error) {
    throw new Error(error.message)
  }
}

export const deleteEventByID = async (id: string): Promise<boolean | void> => {
  try {
    const space = await client.getSpace(process.env.REACT_APP_SPACE_ID)
    const environment = await space.getEnvironment(process.env.REACT_APP_ENVIRONMENT)
    const entry = await environment.getEntry(id)
    const unpublishedEntry = await entry.unpublish()
    return await unpublishedEntry.delete()
  } catch (error) {
    throw new Error(error.message)
  }
}

export const isEventWithIDExist = async (id: string): Promise<Entry | void> => {
  try {
    const space = await client.getSpace(process.env.REACT_APP_SPACE_ID)
    const environment = await space.getEnvironment(process.env.REACT_APP_ENVIRONMENT)
    return await environment.getEntry(id, { locale: 'en-US' })
  } catch (message) {
    throw new Error(message)
  }
}
