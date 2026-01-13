import { ref, computed } from 'vue'
import { useApiExecutor } from './useApiExecutor'
import { useAuth } from './useAuth'
import { useNotifications } from './useNotifications'
import type { Activity } from '$src/types/Activity'
import type { AdminStats } from '$src/types/AdminStats'
import type { User } from '$src/types/User'
import { fetchWithAuth, handleApiError } from '$src/utils/api'


const users = ref<User[]>([])
const activities = ref<Activity[]>([])
const stats = ref<AdminStats | null>(null)

const { isLoading, executeApiCall } = useApiExecutor()

export const useData = () => {
  const { showError, showSuccess } = useNotifications()
  const { getAdminToken } = useAuth()

  const loadUsers = async () => {
    await executeApiCall<User[]>(
      async () => fetchWithAuth('/admin/users', getAdminToken),
      'Nie udało się pobrać użytkowników',
      (data) => {
        users.value = data 
      },
    )
  }

  const loadActivities = async () => {
    await executeApiCall<Activity[]>(
      async () => fetchWithAuth('/admin/activities', getAdminToken),
      'Nie udało się pobrać aktywności',
      (data) => {
        activities.value = data 
      },
    )
  }

  const loadStats = async () => {
    await executeApiCall<AdminStats>(
      async () => fetchWithAuth('/admin/stats', getAdminToken),
      'Nie udało się pobrać statystyk',
      (data) => {
        stats.value = data 
      },
    )
  }

  const deleteActivity = async (activityId: string) => {
    try {
      isLoading.value = true
      const response = await fetchWithAuth(
        `/admin/activities/${activityId}`, 
        getAdminToken, 
        { method: 'DELETE' },
      )
      if (!response.ok) {
        const error = await handleApiError(response, 'Nie udało się usunąć aktywności')
        showError(error.message)
        return
      }
      activities.value = activities.value.filter((activity: Activity) => activity.id.toString() !== activityId)
      showSuccess('Aktywność została usunięta')
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Wystąpił błąd podczas usuwania aktywności'
      showError(message)
    }
    finally {
      isLoading.value = false
    }
  }

  const totalUsers = computed(() => stats.value?.users_number ?? 0)
  const totalActivities = computed(() => stats.value?.activities_number ?? 0)
  const totalDistance = computed(() => stats.value?.distance_summary ?? 0)

  return {
    users: computed(() => users.value),
    activities: computed(() => activities.value),
    totalUsers,
    totalActivities,
    totalDistance,
    isLoading: computed(() => isLoading.value),
    loadUsers,
    loadActivities,
    loadStats,
    deleteActivity,
  }
}
