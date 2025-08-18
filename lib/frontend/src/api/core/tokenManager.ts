import { handleTokenRefresh } from './token'

export const getValidToken = async (): Promise<string> => {
  await handleTokenRefresh()
  
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No token found!')
  }
  
  return token
}

export const getAuthHeaders = async () => {
  const token = await getValidToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}