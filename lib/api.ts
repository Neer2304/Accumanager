// lib/api.ts
import { getAuthCookie } from './cookies'

export const getAuthHeaders = () => {
  const token = getAuthCookie()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const handleApiError = (error: any) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message)
  }
  throw new Error(error.message || 'Something went wrong')
}

export const fetcher = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    ...options,
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return response.json()
}