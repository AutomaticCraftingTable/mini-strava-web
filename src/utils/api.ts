const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://212.127.78.111/api'

const HTTP_STATUS_UNAUTHORIZED = 401
const HTTP_STATUS_NOT_FOUND = 404

const getAuthHeaders = (getToken: () => string | null): Record<string, string> => {
  const token = getToken()
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const handleApiError = async (response: Response, defaultMessage: string): Promise<Error> => {
  if (response.status === HTTP_STATUS_UNAUTHORIZED) {
    return new Error('Brak autoryzacji. Zaloguj się ponownie.')
  }
  if (response.status === HTTP_STATUS_NOT_FOUND) {
    return new Error('Dane nie zostały znalezione')
  }

  try {
    const errorData = await response.json()
    if (errorData?.message) {
      return new Error(errorData.message)
    }
  }
  catch {
    // empty
  }

  return new Error(defaultMessage)
}

const fetchWithAuth = async (
  endpoint: string,
  getToken: () => string | null,
  options: RequestInit = {},
): Promise<Response> => {
  const headers = getAuthHeaders(getToken)
  return fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    },
  )
}

export { API_BASE_URL, getAuthHeaders, handleApiError, fetchWithAuth }
