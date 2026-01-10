// lib/api-client.ts
class ApiClient {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      // If unauthorized, try to refresh tokens and retry
      if (response.status === 401) {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })

        if (refreshResponse.ok) {
          // Retry the original request with new tokens
          return await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          })
        } else {
          // Refresh failed, redirect to login
          window.location.href = '/login'
          throw new Error('Authentication failed')
        }
      }

      return response
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async post(url: string, data: any) {
    return this.fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()