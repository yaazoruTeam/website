import axios from 'axios'
import * as https from 'https'
import { createAuth } from './auth'
import { config } from '../../config'

const callingWidely = async (func_name: string, data: any) => {
  const requestBody = {
    auth: createAuth(),
    func_name: func_name,
    data: data,
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
  } catch (error) {
    throw error
  }
}

export { callingWidely }
