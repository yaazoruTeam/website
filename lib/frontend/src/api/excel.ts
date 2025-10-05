import { apiPost } from './core/apiHelpers'

export interface ExcelUploadResponse {
  success: boolean
  message: string
  results: {
    totalRows: number
    successCount: number
    errorsCount: number
    successRate: string
  }
  errorFile?: {
    generated: boolean
    message: string
    fileName?: string
  }
  sampleData?: any[]
}

/**
 * העלאת קובץ Excel של לקוחות ומכשירים
 */
export const uploadCustomerDeviceExcel = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<ExcelUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  return apiPost<ExcelUploadResponse>('/excel/customerDevice', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    },
  })
}

/**
 * העלאת קובץ Excel של מכשירים בלבד
 */
export const uploadDeviceExcel = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<ExcelUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  return apiPost<ExcelUploadResponse>('/excel/device', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    },
  })
}

/**
 * הורדת קובץ שגיאות Excel
 */
export const downloadErrorFile = async (fileName: string): Promise<Blob> => {
  const baseURL = import.meta.env.VITE_BASE_URL || ''
  const response = await fetch(`${baseURL}/excel/errors/${fileName}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })

  if (!response.ok) {
    throw new Error('שגיאה בהורדת קובץ השגיאות')
  }

  return response.blob()
}