import type { User } from '$src/types/User'

export const formatDistance = (distance: number): string => `${(distance / 1000).toFixed(2)} km`

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

export const formatDate = (dateString: string): string => new Date(dateString).toLocaleDateString(
  'pl-PL',
  {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
)

export const formatDateTime = (dateString: string): string => new Date(dateString).toLocaleString(
  'pl-PL',
  {
    dateStyle: 'medium',
    timeStyle: 'medium',
  },
)

export const getUserFullName = (user: User): string => {
  const name = user.name ?? ''
  const surname = user.surname ?? ''
  if (name && surname) {
    return `${name} ${surname}`
  }
  if (name) {
    return name
  }
  if (surname) {
    return surname
  }
  return '-'
}
