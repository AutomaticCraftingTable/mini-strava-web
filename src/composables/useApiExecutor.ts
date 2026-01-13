import { ref } from 'vue'
import { useNotifications } from './useNotifications'
import { handleApiError } from '$src/utils/api'

export const useApiExecutor = () => {
  const isLoading = ref(false)
  const { showError } = useNotifications()

  const executeApiCall = async <T>(
    apiCall: () => Promise<Response>,
    errorMessage: string,
    onSuccess: (data: T) => void,
  ): Promise<void> => {
    isLoading.value = true
    try {
      const response = await apiCall()
      if (!response.ok) {
        const error = await handleApiError(response, errorMessage)
        showError(error.message)
        return
      }
      const data = await response.json()
      onSuccess(data)
    }
    catch (err) {
      const message = err instanceof Error ? err.message : errorMessage
      showError(message)
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    executeApiCall,
  }
}
