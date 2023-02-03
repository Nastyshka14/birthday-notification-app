import { EventsCollections, Notification } from '@domain/types'
import { getDataFromStorage, removeDataFromStorage, saveDataToStorage } from '@utils/functions/sessionStorageData'
import { NotificationTitle } from '@components/core/NotificationTitle'
import { Notifications } from '@components/Notifications'
import { notification } from 'antd'

export const filterNotificationsForToday = (notificationsForToday: EventsCollections) => {
  let notificationsList: Array<Notification> = []

  for (const notificationCollection in notificationsForToday) {
    notificationsList = [
      ...notificationsList,
      ...(notificationsForToday[notificationCollection] as Array<Notification>),
    ]
  }

  const notificationsForTodayFromStorage: Array<Notification> = JSON.parse(
    getDataFromStorage('notifications'),
  )

  if (notificationsForTodayFromStorage) {
    if (
      !isServerStorageNotificationForTodayTheSame(
        notificationsList,
        notificationsForTodayFromStorage,
      )
    ) {
      const newEventsForToday = filterUpdatedNotifications(
        notificationsList,
        notificationsForTodayFromStorage,
      )

      newEventsForToday.filter((item: Notification): boolean => item.type === 'Birthdays').length > 0 &&
        notification.open({
          message: <NotificationTitle />,
          description: Notifications(newEventsForToday.filter((item) => item.type === 'Birthdays')),
          duration: 0,
        })
      newEventsForToday.filter((item: Notification): boolean => item.type === 'Vacation').length > 0 &&
        notification.open({
          message: <NotificationTitle />,
          description: Notifications(newEventsForToday.filter((item) => item.type === 'Vacation')),
          duration: 0,
        })

      removeDataFromStorage('notifications')
      saveDataToStorage('notifications', JSON.stringify(notificationsList))
    }
  } else {
    notificationsList.filter((item) => item.type === 'Vacation').length > 0 &&
      notification.open({
        message: <NotificationTitle />,
        description: Notifications(notificationsList.filter((item) => item.type === 'Vacation')),
        duration: 0,
      })
    notificationsList.filter((item) => item.type === 'Birthdays').length > 0 &&
      notification.open({
        message: <NotificationTitle />,
        description: Notifications(notificationsList.filter((item) => item.type === 'Birthdays')),
        duration: 0,
      })
    saveDataToStorage('notifications', JSON.stringify(notificationsList))
  }
}

const filterUpdatedNotifications = (
  serverNotificationForToday: Array<Notification>,
  storageNotificationForToday: Array<Notification>,
): Array<Notification> => {
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
  serverNotifications: Array<Notification>,
): Array<Notification> => {
  const notificationsForTodayFromStorage: Array<Notification> = JSON.parse(
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
  serverNotificationForToday: Array<Notification>,
  storageNotificationForToday: Array<Notification>,
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

const sortNotifications = (notifications: Array<Notification>): Array<Notification> => {
  return notifications.sort((notificationFirst, notificationSecond) => {
    return notificationFirst.identifier.id.localeCompare(notificationSecond.identifier.id)
  })
}