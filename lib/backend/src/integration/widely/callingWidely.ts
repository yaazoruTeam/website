import axios, { AxiosError } from 'axios'
import * as https from 'https'
import { createAuth } from '@integration/widely/auth'
import { config } from '@config/index'
import { HttpError } from '@model'
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
    logger.debug(`Request Body: ${JSON.stringify({ func_name, data, auth: '[REDACTED]' })}`)
    const response = await axios.post(config.widely.urlAccountAction, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: config.env === 'development' ? false : true, // Disable SSL validation only in development
      }),
    })
    logger.debug(`Response Data received. Keys: ${Object.keys(response.data).join(', ')}`)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      // Always return 500 for Widely API errors, include original status in message
      const originalStatus = axiosError.response?.status
      const errorMessage = originalStatus
        ? `Widely API Error - HTTP ${originalStatus}: ${axiosError.message}`
        : `Widely API Error: ${axiosError.message}`

      throw <HttpError.Model>{
        message: errorMessage,
        status: 500, // Always return 500 for external API errors
      }
    } else {
      throw error
    }
  }
}

export { callingWidely }
