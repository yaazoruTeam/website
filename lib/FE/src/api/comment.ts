import axios, { AxiosResponse } from 'axios'
import { Comment } from '../model/src'
import { handleTokenRefresh } from './token'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/comment`

export interface PaginatedCommentsResponse {
  data: Comment.Model[]
  total: number
  page?: number
  totalPages: number
}

// GET
export const getCommentsByEntityTypeAndEntityId = async (
  entity_type: string,
  entity_id: string,
  page: number,
): Promise<PaginatedCommentsResponse> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return { data: [], total: 0, totalPages: 0 }
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaginatedCommentsResponse> = await axios.get(
      `${baseUrl}/${entity_type}/${entity_id}?page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching comments', error)
    throw error
  }
}

export const createComment = async (comment: Comment.Model): Promise<Comment.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      throw new Error('Failed to refresh token')
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<Comment.Model> = await axios.post(baseUrl, comment, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating comment', error)
    throw error
  }
}
