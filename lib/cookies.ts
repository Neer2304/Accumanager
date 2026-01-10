// lib/cookies.ts
import { cookies } from 'next/headers'

// Server-side cookie functions
export const getAuthCookie = (): string | null => {
  try {
    const cookieStore = cookies()
    return cookieStore.get('auth_token')?.value || null
  } catch (error) {
    console.error('Error getting auth cookie:', error)
    return null
  }
}

export const setAuthCookie = (token: string) => {
  try {
    const cookieStore = cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  } catch (error) {
    console.error('Error setting auth cookie:', error)
  }
}

export const removeAuthCookie = () => {
  try {
    const cookieStore = cookies()
    cookieStore.delete('auth_token')
  } catch (error) {
    console.error('Error removing auth cookie:', error)
  }
}

export const setUserCookie = (user: any) => {
  try {
    const cookieStore = cookies()
    cookieStore.set('user_data', JSON.stringify(user), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  } catch (error) {
    console.error('Error setting user cookie:', error)
  }
}

export const getUserCookie = (): any => {
  try {
    const cookieStore = cookies()
    const userData = cookieStore.get('user_data')?.value
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error getting user cookie:', error)
    return null
  }
}

export const removeUserCookie = () => {
  try {
    const cookieStore = cookies()
    cookieStore.delete('user_data')
  } catch (error) {
    console.error('Error removing user cookie:', error)
  }
}