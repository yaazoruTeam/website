/**
 * PaymentExcelService - דוגמה לשירות עיבוד קבצי Excel של תשלומים
 * זהו רק דוגמה למבנה עתידי
 */

import logger from '../../utils/logger'
import { writeErrorsToExcel } from '../../utils/excel'
import { 
  ExcelRowData, 
  ProcessError, 
  ProcessingResult,
  buildProcessingResult,
  validateRowData 
} from './BaseExcelService'

/**
 * עיבוד נתוני Excel ספציפיים לתשלומים
 * דוגמה לפונקציה שתטפל בקבצי Excel של תשלומים
 */
const processPaymentExcelData = async (data: ExcelRowData[]): Promise<ProcessingResult> => {
  const errors: ProcessError[] = []
  let successCount = 0

  logger.info(`Starting to process ${data.length} rows of payment data`)

  // שדות נדרשים לתשלומים
  const requiredFields = ['customer_id', 'amount', 'payment_date', 'payment_method']

  for (const item of data) {
    const rowIndex = data.indexOf(item) + 1
    
    try {
      // וולידציה בסיסית
      if (!validateRowData(item, requiredFields)) {
        throw new Error('Missing required payment fields')
      }

      // כאן תהיה הלוגיקה לעיבוד תשלומים
      // await processPayment(item)
      
      successCount++
      logger.debug(`Row ${rowIndex}: Payment processed successfully`)
      
    } catch (err: unknown) {
      logger.error(`Row ${rowIndex}: Payment processing failed:`, err)
      errors.push({
        row: rowIndex,
        error: `Payment processing failed: ${err instanceof Error ? err.message : String(err)}`,
        data: item,
      })
    }
  }

  // כתיבת השגיאות לקובץ Excel עבור payments
  const errorFilePath = await writeErrorsToExcel(errors, 'payments')
  if (errorFilePath) {
    logger.info(`📋 Payments error report generated: ${errorFilePath}`)
  }

  logger.info(`Payment processing completed: ${successCount}/${data.length} successful`)

  return buildProcessingResult(data.length, successCount, errors, errorFilePath || undefined)
}

export { processPaymentExcelData }