import { NextFunction, Request, Response } from 'express'
import { readExcelFile } from '@utils/excel'
import { DeviceExcelProcessor } from '@service/DeviceExcelProcessor'
import * as fs from 'fs'
import logger from '../utils/logger'

/**
 * מטפל בהעלאת קובץ Excel של מכשירים בלבד
 * כולל אימות מול API של סמסונג
 */
const handleDeviceExcelUpload = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const processor = new DeviceExcelProcessor()

  try {
    logger.info('🏁 Starting device Excel upload process')

    // בדיקת קובץ
    if (!req.file) {
      res.status(400).json({
        status: 400,
        message: 'לא הועלה קובץ Excel',
        error: 'NO_FILE_UPLOADED'
      })
      return
    }

    logger.debug(`📁 Processing file: ${req.file.filename}`)
    const filePath = req.file.path

    // קריאת הקובץ
    const rawData = await readExcelFile(filePath)
    logger.info(`📊 Excel file loaded: ${rawData.length} rows`)

    if (rawData.length === 0) {
      res.status(400).json({
        status: 400,
        message: 'קובץ Excel ריק',
        error: 'EMPTY_FILE'
      })
      return
    }

    // עיבוד הנתונים
    const processingResults = await processor.processExcelData(rawData as any[])

    // מחיקת קובץ זמני
    await cleanupTempFile(filePath)

    // הכנת תגובה מפורטת
    const response = {
      message: generateSuccessMessage(processingResults),
      summary: {
        total: processingResults.totalRows,
        successful: processingResults.successCount,
        errors: processingResults.errorsCount,
        duplicates: processingResults.duplicatesCount,
        samsungValidationFailures: processingResults.samsungValidationFailures
      },
      errorReport: {
        generated: !!processingResults.errorFilePath,
        ...(processingResults.errorFilePath && {
          message: 'קובץ דוח שגיאות נוצר בהצלחה'
        })
      },
      sampleData: rawData.slice(0, 2) // 2 שורות ראשונות לדוגמה
    }

    // קביעת סטטוס HTTP
    const statusCode = processingResults.errorsCount === 0 ? 200 : 207 // 207 = Multi-Status

    res.status(statusCode).json(response)
    logger.info(`✅ Device Excel processing completed: ${processingResults.successCount}/${processingResults.totalRows} successful`)

  } catch (error: any) {
    logger.error('💥 Device Excel processing failed:', error)

    // מחיקת קובץ זמני במקרה של שגיאה
    if (req.file?.path) {
      await cleanupTempFile(req.file.path)
    }

    next(error)
  }
}

/**
 * מחיקת קובץ זמני באופן בטוח
 */
const cleanupTempFile = async (filePath: string): Promise<void> => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      logger.debug(`🗑️ Temporary file deleted: ${filePath}`)
    }
  } catch (deleteError) {
    logger.warn(`⚠️ Could not delete temporary file: ${filePath}`, deleteError)
  }
}

/**
 * יוצר הודעת הצלחה דינמית
 */
const generateSuccessMessage = (results: any): string => {
  const { totalRows, successCount, errorsCount, samsungValidationFailures } = results

  if (errorsCount === 0) {
    return `🎉 כל ${totalRows} המכשירים עובדו בהצלחה!`
  }

  let message = `📊 עובדו ${successCount} מתוך ${totalRows} מכשירים`
  
  if (samsungValidationFailures > 0) {
    message += `. ${samsungValidationFailures} נכשלו באימות סמסונג`
  }

  if (errorsCount > 0) {
    message += `. ${errorsCount} שגיאות נוספות`
  }

  return message
}

export { handleDeviceExcelUpload }
