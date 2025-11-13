import cron from 'node-cron'
import logger from '@utils/logger'
import { terminateMobile } from '@integration/widely/widelyActions'
import { CustomerDevice } from '@model'
import { customerDeviceRepository } from '../repositories/CustomerDeviceRepository'
import { deviceRepository } from '../repositories/DeviceRepository'

/**
 * שירות לביטול אוטומטי של קווים כאשר מגיע תאריך סיום התוכנית
 * רץ לפי תזמון קבוע (cron)
 */

interface CancellationResult {
  success: boolean
  customerDevice_id: string
  device_number?: string
  error?: string
}

/**
 * ביטול יחיד במערכת Widely בלבד
 */
async function cancelSingleLineInWidely(customerDevice: CustomerDevice.Model): Promise<CancellationResult> {
  try {
    const device = await deviceRepository.getDeviceById(customerDevice.device_id)
    if (!device) {
      logger.warn(`Device not found for customerDevice_id: ${customerDevice.customerDevice_id}`)
      return {
        success: false,
        customerDevice_id: String(customerDevice.customerDevice_id),
        error: 'Device not found',
      }
    }

    logger.info(`Starting line cancellation for device: ${device.device_number}`)

    const endpoint_id = String(device.device_number) // ✅ המרה למחרוזת
    await terminateMobile(endpoint_id)

    logger.info(`✅ Successfully terminated mobile in Widely for device: ${device.device_number}`)
    return {
      success: true,
      customerDevice_id: String(customerDevice.customerDevice_id),
      device_number: String(device.device_number),
    }
  } catch (error) {
    logger.error(`❌ Failed to terminate mobile for ${customerDevice.customerDevice_id}`, error)
    return {
      success: false,
      customerDevice_id: String(customerDevice.customerDevice_id),
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * טיפול בכל הקווים שתוקפם פג
 */
async function processExpiredLines(): Promise<void> {
  logger.info('🔄 Starting automatic line cancellation process...')

  try {
    const expiredDevices = await customerDeviceRepository.getExpiredPlanDevices()
    if (!expiredDevices || expiredDevices.length === 0) {
      logger.info('✅ No expired lines found.')
      return
    }

    logger.info(`📋 Found ${expiredDevices.length} expired lines to process`)
    const results: CancellationResult[] = []

    for (const customerDevice of expiredDevices) {
      const result = await cancelSingleLineInWidely(customerDevice)
      results.push(result)
      await new Promise(resolve => setTimeout(resolve, 2000)) // השהיה
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount
    logger.info(`📊 Done: Success=${successCount}, Failed=${failureCount}`)

  } catch (error) {
    logger.error('❌ Error in automatic line cancellation process:', error)
  }
}

/**
 * הפעלת Cron
 */
export function startAutoCancelLineScheduler(): void {
  logger.info('📅 Initializing automatic line cancellation scheduler...')
  cron.schedule(
    '0 2 * * *', // כל יום בשעה 2:00 בלילה
    async () => {
      logger.info('⏰ Triggered automatic cancellation task')
      await processExpiredLines()
    },
    { timezone: 'Asia/Jerusalem' }
  )
  logger.info('✅ Scheduler started successfully.')
}

/**
 * הרצה ידנית לבדיקה
 */
export async function manualProcessExpiredLines(): Promise<void> {
  logger.info('🔧 Manual trigger: Processing expired lines')
  await processExpiredLines()
}
