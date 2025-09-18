import { NextFunction, Request, Response } from 'express'
import { readExcelFile } from '@utils/excel'
import { processCustomerDeviceExcelData, ExcelRowData } from '@service/excel/CustomerDeviceExcelService'
import * as fs from 'fs'
import * as path from 'path'
import { handleError } from './err'
import logger from '../utils/logger'

/**
 * פונקציה כללית לטיפול בהעלאת קבצי Excel
 * בודקת שקובץ הועלה ומחזירה את הנתיב שלו
 */
const handleFileUpload = (req: Request, res: Response): string | null => {
  logger.debug('Checking uploaded file...')

  if (!req.file) {
    res.status(400).json({
      status: 400,
      message: 'לא הועלה קובץ Excel'
    })
    return null
  }

  logger.debug('File uploaded:', req.file.filename)
  const filePath = req.file.path
  logger.debug('File path:', filePath)

  return filePath
}

/**
 * פונקציה כללית למחיקת קובץ זמני
 */
const cleanupTempFile = (filePath: string): void => {
  try {
    fs.unlinkSync(filePath)
    logger.info('Temporary file deleted:', filePath)
  } catch (deleteError) {
    logger.warn('Could not delete temporary file:', deleteError)
  }
}

/**
 * קונטרולר אחראי על עיבוד קבצי Excel של לקוחות ומכשירים
 * מטפל בכל הלוגיקה הספציפית לעיבוד נתוני לקוחות ומכשירים
 */
const processCustomerDeviceExcel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let filePath: string | null = null

  try {
    // בדיקת העלאת קובץ
    filePath = handleFileUpload(req, res)
    if (!filePath) return // השגיאה כבר נשלחה בפונקציה

    // קריאת הקובץ
    const data = await readExcelFile(filePath)
    logger.info('Customer-Device Excel file read successfully, rows:', data.length)

    // עיבוד הנתונים הספציפיים ללקוחות ומכשירים
    const processingResults = await processCustomerDeviceExcelData(data as ExcelRowData[])
    logger.info('Customer and device data processed and saved to DB')
    logger.info(`✅ Success: ${processingResults.successCount}/${processingResults.totalRows}`)
    
    if (processingResults.errorsCount > 0) {
      logger.error(`❌ Errors: ${processingResults.errorsCount}`)
    }

    // מחיקת הקובץ הזמני אחרי העיבוד
    cleanupTempFile(filePath)

    // הכנת הודעת התגובה
    const isSuccessful = processingResults.errorsCount === 0
    const successMessage = isSuccessful 
      ? 'עיבוד קובץ לקוחות-מכשירים הושלם בהצלחה! 🎉'
      : `עיבוד קובץ לקוחות-מכשירים הושלם עם ${processingResults.errorsCount} שגיאות. קובץ שגיאות נוצר.`

    res.status(200).json({
      success: isSuccessful,
      message: successMessage,
      results: {
        totalRows: processingResults.totalRows,
        successCount: processingResults.successCount,
        errorsCount: processingResults.errorsCount,
        successRate: `${Math.round((processingResults.successCount / processingResults.totalRows) * 100)}%`
      },
      ...(processingResults.errorFilePath && {
        errorFile: {
          generated: true,
          message: 'קובץ שגיאות נוצר לבדיקה מפורטת'
        }
      }),
      sampleData: data.slice(0, 3) // מחזיר רק 3 שורות ראשונות כדוגמה
    })
  } catch (error: unknown) {
    // מחיקת הקובץ הזמני במקרה של שגיאה
    if (filePath) {
      cleanupTempFile(filePath)
    }
    handleError(error, next)
  }
}

export { processCustomerDeviceExcel }
