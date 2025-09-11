import axios from 'axios'
import logger from '../../utils/logger'

interface SamsungDeviceValidationRequest {
  imei: string
  serialNumber: string
}

interface SamsungDeviceValidationResponse {
  isValid: boolean
  model?: string
  manufactureDate?: string
  errorMessage?: string
}

class SamsungApiService {
  private baseUrl: string
  private apiKey: string
  private timeout: number

  constructor() {
    this.baseUrl = process.env.SAMSUNG_API_BASE_URL || 'https://api.samsung.com/device'
    this.apiKey = process.env.SAMSUNG_API_KEY || ''
    this.timeout = 10000 // 10 seconds
  }

  async validateDevice(request: SamsungDeviceValidationRequest): Promise<SamsungDeviceValidationResponse> {
    try {
      logger.debug(`🔍 Validating Samsung device - IMEI: ${request.imei}, Serial: ${request.serialNumber}`)

      // בשלב פיתוח - Mock response
      if (process.env.NODE_ENV === 'development') {
        return this.getMockResponse(request)
      }

      const response = await axios.post(
        `${this.baseUrl}/validate`,
        {
          imei: request.imei,
          serial_number: request.serialNumber
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      )

      const { data } = response
      
      if (response.status === 200 && data.valid) {
        logger.info(`✅ Samsung device validated successfully - IMEI: ${request.imei}`)
        return {
          isValid: true,
          model: data.model,
          manufactureDate: data.manufacture_date
        }
      } else {
        logger.warn(`❌ Samsung device validation failed - IMEI: ${request.imei}, Error: ${data.message}`)
        return {
          isValid: false,
          errorMessage: data.message || 'Device validation failed'
        }
      }
    } catch (error: any) {
      logger.error(`💥 Samsung API error for IMEI ${request.imei}:`, error.message)
      
      if (error.code === 'ECONNABORTED') {
        return {
          isValid: false,
          errorMessage: 'Samsung API timeout - please try again later'
        }
      }
      
      return {
        isValid: false,
        errorMessage: `Samsung API error: ${error.message}`
      }
    }
  }

  private getMockResponse(request: SamsungDeviceValidationRequest): SamsungDeviceValidationResponse {
    // Mock logic - בהמשך תחליף לקריאה אמיתית
    const isValidImei = request.imei.length >= 14 && request.imei.length <= 16
    const isValidSerial = request.serialNumber.length >= 6
    
    if (isValidImei && isValidSerial) {
      logger.debug(`🎭 Mock: Device validation passed for IMEI: ${request.imei}`)
      return {
        isValid: true,
        model: 'Galaxy Mock Model',
        manufactureDate: '2024-01-01'
      }
    } else {
      logger.debug(`🎭 Mock: Device validation failed for IMEI: ${request.imei}`)
      return {
        isValid: false,
        errorMessage: 'Mock: IMEI or Serial Number format invalid'
      }
    }
  }
}

export { SamsungApiService, SamsungDeviceValidationRequest, SamsungDeviceValidationResponse }
