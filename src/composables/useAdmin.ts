import { ref, computed } from 'vue'
import { useApiExecutor } from './useApiExecutor'
import { useAuth } from './useAuth'
import { useNotifications } from './useNotifications'
import type { Activity } from '$src/types/Activity'
import type { AdminStats } from '$src/types/AdminStats'
import type { User } from '$src/types/User'
import { fetchWithAuth, handleApiError } from '$src/utils/api'


const adminUsers = ref<User[]>([])
const adminActivities = ref<Activity[]>([])
const adminStats = ref<AdminStats | null>(null)

const { isLoading, executeApiCall } = useApiExecutor()

export const useAdmin = () => {
  const { showError, showSuccess } = useNotifications()
  const { getAdminToken } = useAuth()

  const loadAdminUsers = async () => {
    await executeApiCall<User[]>(
      async () => fetchWithAuth('/admin/users', getAdminToken),
      'Nie udało się pobrać użytkowników',
      (data) => {
        adminUsers.value = data 
      },
    )
  }

  const loadAdminActivities = async () => {
    await executeApiCall<Activity[]>(
      async () => fetchWithAuth('/admin/activities', getAdminToken),
      'Nie udało się pobrać aktywności',
      (data) => {
        adminActivities.value = data 
      },
    )
  }

  const deleteAdminActivity = async (activityId: string) => {
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
      adminActivities.value = adminActivities.value.filter((activity: Activity) => activity.id.toString() !== activityId)
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

  const loadAdminStats = async () => {
    await executeApiCall<AdminStats>(
      async () => fetchWithAuth('/admin/stats', getAdminToken),
      'Nie udało się pobrać statystyk',
      (data) => {
        adminStats.value = data 
      },
    )
  }

  return {
    adminUsers: computed(() => adminUsers.value),
    adminActivities: computed(() => adminActivities.value),
    adminStats: computed(() => adminStats.value),
    isLoading: computed(() => isLoading.value),
    loadAdminUsers,
    loadAdminActivities,
    deleteAdminActivity,
    loadAdminStats,
  }
}
