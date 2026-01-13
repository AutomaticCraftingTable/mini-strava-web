export interface User {
  id: number
  name: string | null
  surname: string | null
  birthdate: string | null
  gender: string | null
  height: number | null
  weight: number | null
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  activities_count?: number
}
