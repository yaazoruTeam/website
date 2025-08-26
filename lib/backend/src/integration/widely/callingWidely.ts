import axios, { AxiosError } from 'axios'
import * as https from 'https'
import { createAuth } from '@integration/widely/auth'
import { config } from '@config/index'
import { HttpError, WidelyApiTypes } from '@model'

const callingWidely = async (func_name: string, data: WidelyApiTypes.WidelyRequestData) => {
  const requestBody = {
    auth: createAuth(),
    func_name,
    data,
  }

  try {
    const response = await axios.post(config.widely.urlAccountAction, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: config.env === 'development' ? false : true, // Disable SSL validation only in development
      }),
    })

    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      throw <HttpError.Model>{
        message: axiosError.message,
        status: axiosError.response?.status || 500,
      }
    } else {
      throw error
    }
  }
}

export { callingWidely }
