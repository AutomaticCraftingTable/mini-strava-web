import { ref, computed } from 'vue'
import { useNotifications } from './useNotifications'
import { API_BASE_URL, handleApiError } from '$src/utils/api'

const ADMIN_STORAGE_KEY = 'isAdminLoggedIn'
const ADMIN_TOKEN_KEY = 'adminToken'
const isAdminLoggedIn = ref<boolean>(false)

export const useAuth = () => {
  const { showError, showSuccess } = useNotifications()

  const checkAdminAuthStatus = () => {
    const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY)
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    isAdminLoggedIn.value = stored === 'true' && !!token
  }

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/auth/login`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      )

      if (!response.ok) {
        if (response.status === 401) {
          showError('Nieprawidłowy email lub hasło')
          return false
        }
        const error = await handleApiError(response, 'Nieprawidłowe dane logowania')
        showError(error.message)
        return false
      }

      const data = await response.json()
      const token = data.token ?? data.accessToken ?? 'admin-token'

      isAdminLoggedIn.value = true
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true')
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token)

      showSuccess('Zalogowano jako administrator')
      return true
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Wystąpił błąd podczas logowania'
      showError(message)
      return false
    }
  }

  const adminLogout = () => {
    isAdminLoggedIn.value = false
    sessionStorage.removeItem(ADMIN_STORAGE_KEY)
    sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  }

  const getAdminToken = (): string | null => sessionStorage.getItem(ADMIN_TOKEN_KEY)

  return {
    isAdminLoggedIn: computed(() => isAdminLoggedIn.value),
    adminLogin,
    adminLogout,
    checkAdminAuthStatus,
    getAdminToken,
  }
}
