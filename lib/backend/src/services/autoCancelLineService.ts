import cron from 'node-cron'
import logger from '@utils/logger'
import { getExpiredPlanDevices } from '@db/CustomerDevice'
import { getDeviceById } from '@db/Device'
import { terminateMobile } from '@integration/widely/widelyActions'
import { CustomerDevice } from '@model'

/**
 * שירות לביטול אוטומטי של קווים כאשר מגיע תאריך סיום התוכנית
 * השירות רץ כל יום בשעה 2:00 בלילה
 * 
 * ⚠️ חשוב: השירות לא נוגע במסד נתונים - רק קורא ממנו ומבטל ב-Widely
 */

interface CancellationResult {
  success: boolean
  customerDevice_id: string
  device_number?: string
  error?: string
}

/**
 * פונקציה שמבטלת קו בודד במערכת Widely
 * לא מעדכנת את מסד הנתונים!
 */
async function cancelSingleLineInWidely(customerDevice: CustomerDevice.Model): Promise<CancellationResult> {
  try {
    // שלב 1: קבלת פרטי המכשיר
    const device = await getDeviceById(customerDevice.device_id)
    if (!device) {
      logger.warn(`Device not found for customerDevice_id: ${customerDevice.customerDevice_id}`)
      return {
        success: false,
        customerDevice_id: customerDevice.customerDevice_id,
        error: 'Device not found'
      }
    }

    logger.info(`Starting line cancellation for device: ${device.device_number}`)

    // שלב 2: ביטול הקו במערכת Widely בלבד
    const endpoint_id = device.device_number

    try {
      await terminateMobile(endpoint_id)
      logger.info(`✅ Successfully terminated mobile in Widely for device: ${device.device_number}`)
      
      return {
        success: true,
        customerDevice_id: customerDevice.customerDevice_id,
        device_number: device.device_number
      }
    } catch (widelyError) {
      logger.error(`❌ Failed to terminate mobile in Widely for device: ${device.device_number}`, widelyError)
      return {
        success: false,
        customerDevice_id: customerDevice.customerDevice_id,
        device_number: device.device_number,
        error: widelyError instanceof Error ? widelyError.message : 'Unknown error in Widely'
      }
    }
  } catch (error) {
    logger.error(`Error cancelling line for customerDevice_id: ${customerDevice.customerDevice_id}`, error)
    return {
      success: false,
      customerDevice_id: customerDevice.customerDevice_id,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * פונקציה ראשית שבודקת ומבטלת את כל הקווים שתוקפם פג
 * רק קוראת מהמסד נתונים ומבטלת ב-Widely - לא מעדכנת כלום במסד נתונים
 */
async function processExpiredLines(): Promise<void> {
  logger.info('🔄 Starting automatic line cancellation process...')

  try {
    // שלב 1: קבלת כל הקווים שתוקפם פג (קריאה בלבד מהמסד נתונים)
    const expiredDevices = await getExpiredPlanDevices()

    if (expiredDevices.length === 0) {
      logger.info('✅ No expired lines found. Process completed.')
      return
    }

    logger.info(`📋 Found ${expiredDevices.length} expired lines to process`)

    // שלב 2: ביטול כל הקווים ב-Widely בלבד
    const results: CancellationResult[] = []

    for (const customerDevice of expiredDevices) {
      const result = await cancelSingleLineInWidely(customerDevice)
      results.push(result)

      // המתנה קצרה בין כל ביטול כדי לא להעמיס על מערכת Widely
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // שלב 3: סיכום התוצאות
    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    logger.info('📊 Line cancellation process completed:')
    logger.info(`   ✅ Successful cancellations in Widely: ${successCount}`)
    logger.info(`   ❌ Failed cancellations: ${failureCount}`)

    if (failureCount > 0) {
      logger.warn('Failed cancellations:', results.filter(r => !r.success))
    }

    // הצגת רשימת הקווים שבוטלו בהצלחה
    const successfulCancellations = results.filter(r => r.success)
    if (successfulCancellations.length > 0) {
      logger.info('Successfully cancelled device numbers:', 
        successfulCancellations.map(r => r.device_number).join(', '))
    }
  } catch (error) {
    logger.error('❌ Error in automatic line cancellation process:', error)
  }
}

/**
 * התחלת תזמון המשימה
 */
export function startAutoCancelLineScheduler(): void {
  logger.info('📅 Initializing automatic line cancellation scheduler...')
  logger.info('📍 Registering cron job now...')
  // פורמט cron: דקה שעה יום חודש יום_בשבוע
  cron.schedule('*/1 * * * *', async () => {
    logger.info('⏰ Scheduled task triggered: Auto-cancel expired lines')
    await processExpiredLines()
  }, {
    timezone: "Asia/Jerusalem"
  })
  logger.info('📍 Cron job successfully registered')

  logger.info('✅ Automatic line cancellation scheduler started successfully')
  logger.info('   Schedule: Every day at 15:20 (Israel Time)')
  logger.info('   ⚠️  Note: Only cancels in Widely - does NOT update database')
}
/**
 * פונקציה לביצוע ידני של תהליך הביטול (לצורכי בדיקה)
 */
export async function manualProcessExpדiredLines(): Promise<void> {
  logger.info('🔧 Manual trigger: Processing expired lines')
  await processExpiredLines()
}
