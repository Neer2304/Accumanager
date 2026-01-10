// // lib/auth-helper.ts
// import { cookies } from 'next/headers'
// import { generateAuthToken, generateRefreshToken } from '@/lib/jwt'

// /**
//  * Set authentication cookies
//  */
// export const setAuthCookies = async (user: any) => {
//   try {
//     const cookieStore = cookies()
    
//     // Generate tokens
//     const authToken = generateAuthToken(user)
//     const refreshToken = generateRefreshToken(user)

//     // Set auth token cookie (15 minutes)
//     ;(await cookieStore).set('auth_token', authToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 15 * 60, // 15 minutes
//       path: '/',
//     })

//     // Set refresh token cookie (30 days)
//     ;(await cookieStore).set('refresh_token', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 60 * 60 * 24 * 30, // 30 days
//       path: '/',
//     })

//     // Set user data in a non-httpOnly cookie for client-side access
//     const userData = {
//       id: user.id || user._id?.toString(),
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       shopName: user.shopName,
//     }

//     ;(await cookieStore).set('user_data', JSON.stringify(userData), {
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 15 * 60, // Same as auth token
//       path: '/',
//     })

//     console.log('✅ Auth cookies set for user:', user.email)
//     return { success: true, authToken }
//   } catch (error) {
//     console.error('❌ Error setting auth cookies:', error)
//     return { success: false, error }
//   }
// }

// /**
//  * Clear all authentication cookies
//  */
// export const clearAuthCookies = async () => {
//   try {
//     const cookieStore = cookies()
    
//     ;(await cookieStore).delete('auth_token')
//     ;(await cookieStore).delete('refresh_token')
//     ;(await cookieStore).delete('user_data')
    
//     console.log('✅ Auth cookies cleared')
//     return { success: true }
//   } catch (error) {
//     console.error('❌ Error clearing auth cookies:', error)
//     return { success: false, error }
//   }
// }

// /**
//  * Get authenticated user from cookies
//  */
// export const getAuthUser = async () => {
//   try {
//     const cookieStore = cookies()
//     const authToken = (await cookieStore).get('auth_token')?.value
    
//     if (!authToken) {
//       return null
//     }

//     const { verifyToken } = await import('@/lib/jwt')
//     return verifyToken(authToken)
//   } catch (error) {
//     console.error('❌ Error getting auth user:', error)
//     return null
//   }
// }

// /**
//  * Check if user is authenticated
//  */
// export const isAuthenticated = async (): Promise<boolean> => {
//   try {
//     const user = await getAuthUser()
//     return !!user
//   } catch {
//     return false
//   }
// }

// /**
//  * Check if user has specific role
//  */
// export const hasRole = async (requiredRoles: string | string[]): Promise<boolean> => {
//   try {
//     const user = await getAuthUser()
//     if (!user) return false

//     const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
//     return roles.includes(user.role || 'user')
//   } catch {
//     return false
//   }
// }