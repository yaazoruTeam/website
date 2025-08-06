import { Comment, EntityType, CreateCommentDto } from '@model'
import { 
  apiGet,
  apiPost,
  // safeGetPaginated,
  PaginatedResponse 
} from './core/apiHelpers'
import axios from 'axios'
import { getAuthHeaders } from './core/tokenManager'

const ENDPOINT = '/comment'
const baseURL = import.meta.env.VITE_BASE_URL

export const getCommentsByEntityTypeAndEntityId = async (
  entity_type: EntityType,
  entity_id: string,
  page: number
): Promise<PaginatedResponse<Comment.Model>> => {
  try {
    const response = await apiGet<PaginatedResponse<Comment.Model>>(
      `${ENDPOINT}/${entity_type}/${entity_id}?page=${page}`
    )
    
    const formattedData = response.data.map((commentItem) => ({
      ...commentItem,
      created_at: new Date(commentItem.created_at as unknown as string),
    }))

    return { ...response, data: formattedData }
  } catch (error) {
    console.error('Error fetching comments', error)
    return { data: [], total: 0, page, totalPages: 0 }
  }
}

export const createComment = async (
  commentData: CreateCommentDto.Model
): Promise<Comment.Model> => {
  const response = await apiPost<Comment.Model>(ENDPOINT, commentData)
  return {
    ...response,
    created_at: new Date(response.created_at as unknown as string),
  }
}

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const headers = await getAuthHeaders()
    const formData = new FormData()
    formData.append('audio', audioBlob)

    const response = await axios.post<{ transcription: string }>(
      `${baseURL}${ENDPOINT}/transcribe`,
      formData,
      {
        headers: {
          ...headers,
        },
      }
    )

    return response.data.transcription
  } catch (error) {
    console.error('Error transcribing audio:', error)
    throw error
  }
}
