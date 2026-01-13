import { ref, computed } from 'vue'
import { useNotifications } from './useNotifications'
import { API_BASE_URL, handleApiError } from '$src/utils/api'

const STORAGE_KEY = 'isLoggedIn'
const ADMIN_STORAGE_KEY = 'isAdminLoggedIn'
const ADMIN_TOKEN_KEY = 'adminToken'

const isLoggedIn = ref<boolean>(false)
const isAdminLoggedIn = ref<boolean>(false)

export const useAuth = () => {
  const { showError, showSuccess } = useNotifications()

  const checkAuthStatus = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    isLoggedIn.value = stored === 'true'
  }

  const checkAdminAuthStatus = () => {
    const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY)
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    isAdminLoggedIn.value = stored === 'true' && !!token
  }

  const login = () => {
    isLoggedIn.value = true
    sessionStorage.setItem(STORAGE_KEY, 'true')
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

  const logout = () => {
    isLoggedIn.value = false
    sessionStorage.removeItem(STORAGE_KEY)
  }

  const getAdminToken = (): string | null => sessionStorage.getItem(ADMIN_TOKEN_KEY)

  return {
    isLoggedIn: computed(() => isLoggedIn.value),
    isAdminLoggedIn: computed(() => isAdminLoggedIn.value),
    login,
    logout,
    adminLogin,
    adminLogout,
    checkAuthStatus,
    checkAdminAuthStatus,
    getAdminToken,
  }
}
