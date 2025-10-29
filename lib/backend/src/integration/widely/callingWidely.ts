import axios, { AxiosError } from 'axios'
import * as https from 'https'
import { createAuth } from '@integration/widely/auth'
import { config } from '@config/index'
import { HttpError, HttpErrorWithStatus } from '@model'
import logger from '@/src/utils/logger'

const callingWidely = async (
  func_name: string,
  data: Record<string, unknown> = {}, // ברירת מחדל - אובייקט ריק
) => {
  logger.info(`Calling Widely API function: ${func_name}`)
  const requestBody = {
    auth: createAuth(),
    func_name,
    data,
  }

  try {
    logger.debug(`callingWidely Request Body: ${JSON.stringify({ func_name, data, auth: '[REDACTED]' })}`)
    const response = await axios.post(config.widely.urlAccountAction, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: config.node_env === 'development' ? false : true, // Disable SSL validation only in development
      }),
    })
    logger.debug(`callingWidely Response Data received. Keys: ${Object.keys(response.data).join(', ')}`)
    return response.data
  } catch (error: unknown) {
    logger.debug('Error calling Widely API', { error })
    if (axios.isAxiosError(error)) {
      logger.debug('Axios error calling Widely API', { error })
      const axiosError = error as AxiosError
      
      // Always return 500 for Widely API errors, include original status in message
      const originalStatus = axiosError.response?.status
      
      // Try to extract error message from Widely API response
      let widelyMessage = ''
      if (axiosError.response?.data) {
        try {
          const responseData = axiosError.response.data
          logger.debug('Widely API error response data:', { responseData })
          
          // Check for various message fields that Widely might use
          if (typeof responseData === 'object' && responseData !== null) {
            const data = responseData as Record<string, unknown>
            const possibleMessage = data.message || data.error || data.error_message || data.description
            widelyMessage = typeof possibleMessage === 'string' ? possibleMessage : ''
          } else if (typeof responseData === 'string') {
            widelyMessage = responseData
          }
        } catch (parseError) {
          logger.debug('Failed to parse Widely API error response', { parseError })
        }
      }
      
      // Build comprehensive error message
      let errorMessage = originalStatus
        ? `Widely API Error - HTTP ${originalStatus}: ${axiosError.message}`
        : `Widely API Error: ${axiosError.message}`
      
      if (widelyMessage && widelyMessage.trim()) {
        errorMessage += ` | Widely says: "${widelyMessage.trim()}"`
      }

      logger.debug('Throwing HttpError for Widely API error', { errorMessage, widelyMessage })

      const httpError = new Error(errorMessage) as HttpErrorWithStatus.Model;
      httpError.status = 500; // Always return 500 for external API errors
      throw httpError
    } else {
      logger.debug('Unexpected error calling Widely API', { error })
      throw error
    }
  }
}

export { callingWidely }
