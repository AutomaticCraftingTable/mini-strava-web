import { ref, computed } from 'vue'

export interface Notification {
  id: string
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
}

const notifications = ref<Notification[]>([])
const timeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const useNotifications = () => {
  const addNotification = (message: string, type: Notification['type'] = 'error') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 11)
    const notification: Notification = {
      id,
      message,
      type, 
    }
    
    notifications.value.push(notification)

    const timeout = setTimeout(
      () => {
        removeNotification(id)
      }, 
      3000,
    )

    timeouts.set(id, timeout)

    return {
      id,
      timeout, 
    }
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n: Notification) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
    
    const timeout = timeouts.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeouts.delete(id)
    }
  }

  const showError = (message: string) => addNotification(message, 'error')

  const showSuccess = (message: string) => addNotification(message, 'success')


  return {
    notifications: computed(() => notifications.value),
    addNotification,
    removeNotification,
    showError,
    showSuccess,

  }
}
