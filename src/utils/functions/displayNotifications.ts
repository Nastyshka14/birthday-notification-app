/**
 * 1) the notifications for current day are showing just ones
 * 2) do not repeat displaying notifications for user, notifications data is stored in session storage
 * 3) every time reading notifications for from Contenful the notifications data is synchronized with data from session storage data
 * 4) the checking algorithm compare data by identifier first to check if new entity was created or deleted
 *  after that for the notifications with the same identifier checking by fields is implemented to define updated entities
 * 5) comparison is implemented for different types of events with different field set
 */

import { notification } from 'antd'
import { IEventsCollections, INotification } from '../../domain/types'
import {
  saveDataToStorage,
  getDataFromStorage,
  removeDataFromStorage,
} from '../../utils/functions/sessionStorageData'

import { Notifications } from '../../components/Notifications'

export const displayNotifications = (notificationsForToday: IEventsCollections) => {
  let isNotificationsWithUpdates = false
  let notificationsList: Array<INotification> = []

  for (const notificationCollection in notificationsForToday) {
    notificationsList = [
      ...notificationsList,
      ...(notificationsForToday[notificationCollection] as Array<INotification>),
    ]
  }

  const notificationsForTodayFromStorage: Array<INotification> = JSON.parse(
    getDataFromStorage('notifications'),
  )

  if (notificationsForTodayFromStorage) {
    if (
      !isServerStorageNotificationForTodayTheSame(
        notificationsList,
        notificationsForTodayFromStorage,
      )
    ) {
      isNotificationsWithUpdates = true
    }
  } else {
    isNotificationsWithUpdates = true
  }

  if (isNotificationsWithUpdates) {
    const newEventsForToday = filterUpdatedNotifications(
      notificationsList,
      notificationsForTodayFromStorage,
    )

    newEventsForToday.length > 0 &&
      notification.open({
        message: 'Notifications',
        description: Notifications(JSON.stringify(newEventsForToday)),
        duration: 0,
      })

    removeDataFromStorage('notifications')
    saveDataToStorage('notifications', JSON.stringify(notificationsList))
  }
}


const filterUpdatedNotifications = (
  serverNotificationForToday: Array<INotification>,
  storageNotificationForToday: Array<INotification>,
): Array<INotification> => {
  const serverNotifications = sortNotifications([...serverNotificationForToday])
  const storageNotifications = sortNotifications([...storageNotificationForToday])

  const newNotifications = serverNotifications.filter((serverNotification) => {
    return !storageNotifications.some((storageNotification) => {
      return storageNotification.identifier.id === serverNotification.identifier.id
    })
  })

  const existingServerNotifications = serverNotifications.filter((serverNotification) => {
    return storageNotifications.some((storageNotification) => {
      return storageNotification.identifier.id === serverNotification.identifier.id
    })
  })

  const updatedNotifications = getUpdatedNotifications(existingServerNotifications)

  return [...newNotifications, ...updatedNotifications]
}

const getUpdatedNotifications = (
  serverNotifications: Array<INotification>,
): Array<INotification> => {
  const notificationsForTodayFromStorage: Array<INotification> = JSON.parse(
    getDataFromStorage('notifications'),
  )

  const updatedNotifications = []

  for (const serverNotification of serverNotifications) {
    const sameStorageNotification = notificationsForTodayFromStorage.filter(
      (storageNotification) => {
        return storageNotification.identifier.id === serverNotification.identifier.id
      },
    )[0]

    const fieldsList = Object.keys(serverNotification)

    for (const field of fieldsList) {
      if (typeof serverNotification[field] !== 'object') {
        if (serverNotification[field] !== sameStorageNotification[field]) {
          updatedNotifications.push(serverNotification)
          break
        }
      }
    }
  }

  return updatedNotifications
}

const isServerStorageNotificationForTodayTheSame = (
  serverNotificationForToday: Array<INotification>,
  storageNotificationForToday: Array<INotification>,
): boolean => {
  if (serverNotificationForToday.length !== storageNotificationForToday.length) {
    return false
  }

  const serverNotifications = sortNotifications([...serverNotificationForToday])
  const storageNotification = sortNotifications([...storageNotificationForToday])

  for (let i = 0; i < serverNotifications.length; i++) {
    if (serverNotifications[i].identifier.id !== storageNotification[i].identifier.id) {
      return false
    }

    const fieldsList = Object.keys(serverNotifications[i])

    for (const field of fieldsList) {
      if (typeof serverNotifications[i][field] !== 'object') {
        if (serverNotifications[i][field] !== storageNotification[i][field]) {
          return false
        }
      }
    }
  }

  return true
}

const sortNotifications = (notifications: Array<INotification>): Array<INotification> => {
  return notifications.sort((notificationFirst, notificationSecond) => {
    return notificationFirst.identifier.id.localeCompare(notificationSecond.identifier.id)
  })
}
