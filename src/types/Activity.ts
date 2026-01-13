import type { User } from './User'

export type ActivityType = 'run' | 'ride' | 'walk' | 'swim' | 'other'

export interface Activity {
  id: number
  user_id: number
  title: string
  note: string | null
  activity_type: ActivityType
  distance: number
  time: number
  pace: number
  speed: number
  created_at: string
  updated_at: string
  user: User
}
